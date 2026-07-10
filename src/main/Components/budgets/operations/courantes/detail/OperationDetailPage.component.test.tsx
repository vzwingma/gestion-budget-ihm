import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { OperationDetailPage } from './OperationDetailPage.component.tsx';
import { BudgetContext } from '../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import CategorieOperationModel from '../../../../../Models/budgets/CategorieOperation.model.ts';
import { createNewOperation } from '../../../../../Models/budgets/Operation.model.ts';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Tests de OperationDetailPage.component.tsx, en particulier de la fonction interne
 * `fillCategorieForm` (refactorée en helpers applyCategorieParente / applyRentreeArgent /
 * applyActifInvest / applyDefaut - issue SonarCloud S3776).
 *
 * Stratégie : tous les sous-composants sont mockés (rendu simplifié), sauf la logique
 * métier de la page elle-même. Le sous-composant OperationDetailCategories est mocké par
 * un bouton par sous-catégorie déclenchant fillOperationForm(CATEGORIE, ssCatId), ce qui
 * permet de piloter précisément fillCategorieForm sans dépendre du fonctionnement interne
 * du composant MUI Autocomplete réel (comportement déjà couvert par ses propres tests).
 */

vi.mock('./actions/OperationDetailActions.component.tsx', () => ({
    OperationDetailActions: () => <div data-testid="mock-actions" />
}));
vi.mock('./subcomponents/OperationDetailValeur.component.tsx', () => ({
    OperationDetailValeur: () => <div data-testid="mock-valeur" />,
    validateFormMontant: vi.fn()
}));
vi.mock('./subcomponents/OperationDetailLibelle.component.tsx', () => ({
    OperationDetailLibelle: () => <div data-testid="mock-libelle" />
}));
vi.mock('./subcomponents/OperationDetailIntercompte.component.tsx', () => ({
    OperationDetailIntercompte: () => <div data-testid="mock-intercompte" />,
    getAffichageIntercompteRO: () => <div data-testid="mock-intercompte-ro" />,
    validateFormTransfertIntercompte: vi.fn()
}));
vi.mock('./subcomponents/OperationDetailMensualite.component.tsx', () => ({
    OperationDetailMensualite: () => <div data-testid="mock-mensualite" />
}));
vi.mock('./subcomponents/OperationDetailDateOperation.component.tsx', () => ({
    OperationDetailDate: () => <div data-testid="mock-date" />
}));
vi.mock('./subcomponents/OperationDetailCategorieType.component.tsx', () => ({
    OperationDetailCategorieType: () => <div data-testid="mock-categorie-type" />
}));
vi.mock('../../recurrentes/details/subcomponents/OperationRecurrenteDetailDateFin.component.tsx', () => ({
    OperationDetailDateFin: () => <div data-testid="mock-date-fin" />,
    validateFormDateFinPeriode: vi.fn()
}));
vi.mock('../../../../../Utils/renderers/OperationDetailStatus.renderer.tsx', () => ({
    default: () => <div data-testid="mock-status" />
}));

// Mock du composant Catégories : expose un bouton par sous-catégorie fournie dans listeCategories
vi.mock('./subcomponents/OperationDetailCategories.component.tsx', () => ({
    OperationDetailCategories: ({ listeCategories, fillOperationForm }: any) => (
        <div data-testid="mock-categories">
            {listeCategories
                .flatMap((cat: CategorieOperationModel) => cat.listeSSCategories ?? [])
                .map((ssCat: any) => (
                    <button
                        key={ssCat.id}
                        data-testid={`select-sscat-${ssCat.id}`}
                        onClick={() => fillOperationForm('OPERATION_CATEGORIE', ssCat.id)}
                    >
                        {ssCat.libelle}
                    </button>
                ))}
            <button
                data-testid="select-sscat-inconnue"
                onClick={() => fillOperationForm('OPERATION_CATEGORIE', 'id-inconnu')}
            >
                inconnue
            </button>
        </div>
    ),
    validateFormCategories: vi.fn()
}));

function buildCategorie(id: string | null, libelle: string, parente?: CategorieOperationModel): CategorieOperationModel {
    return { id, libelle, categorieParente: parente } as any;
}

function buildListeCategories(): CategorieOperationModel[] {
    const rentreeArgent: CategorieOperationModel = { id: BUSINESS_GUID.CAT_RENTREE_ARGENT, libelle: 'Rentrées d\'argent' };
    const actifsInvest: CategorieOperationModel = { id: BUSINESS_GUID.CAT_ACTIFS_INVEST, libelle: 'Actifs / Investissements' };
    const autreParente: CategorieOperationModel = { id: 'cat-autre', libelle: 'Autre catégorie' };

    return [
        {
            id: BUSINESS_GUID.CAT_RENTREE_ARGENT,
            libelle: rentreeArgent.libelle,
            listeSSCategories: [
                buildCategorie('sscat-rentree', 'Salaire', rentreeArgent)
            ]
        },
        {
            id: BUSINESS_GUID.CAT_ACTIFS_INVEST,
            libelle: actifsInvest.libelle,
            listeSSCategories: [
                buildCategorie('sscat-actif', 'Bourse', actifsInvest)
            ]
        },
        {
            id: 'cat-autre',
            libelle: autreParente.libelle,
            listeSSCategories: [
                buildCategorie('sscat-autre', 'Loisirs', autreParente),
                // sous-catégorie sans catégorie parente (branche categorieParente null/undefined)
                { id: 'sscat-sans-parente', libelle: 'Sans parente', categorieParente: undefined } as any
            ]
        }
    ];
}

function renderPage(listeCategories: CategorieOperationModel[]) {
    const operation = createNewOperation();
    operation.id = 'op-1';
    operation.categorie = { id: 'cat-initiale', libelle: 'Catégorie initiale' };
    operation.ssCategorie = { id: 'sscat-initiale', libelle: 'Sous-catégorie initiale', type: TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL };
    operation.typeOperation = TYPES_OPERATION_ENUM.DEPENSE;
    operation.etat = OPERATION_ETATS_ENUM.PREVUE;
    operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE, prochaineEcheance: -1 };

    const budget = new BudgetMensuelModel('budget-1', 'Budget test');
    budget.actif = false; // simplifie le rendu (masque bloc Actions/Valider)

    const contextValue: any = {
        currentBudget: budget,
        setCurrentBudget: vi.fn(),
        currentOperation: operation,
        setCurrentOperation: vi.fn(),
        comptes: [],
        setListeComptes: vi.fn(),
        selectedCompte: null,
        setSelectedCompte: vi.fn(),
        selectedDate: new Date(2026, 0, 1),
        setSelectedDate: vi.fn(),
        categories: listeCategories,
        setCategories: vi.fn()
    };

    render(
        <BudgetContext.Provider value={contextValue}>
            <OperationDetailPage
                listeCategories={listeCategories}
                listeLibellesOperations={[]}
                onOperationChange={vi.fn()}
            />
        </BudgetContext.Provider>
    );

    return { operation, budget };
}

describe('OperationDetailPage - fillCategorieForm (via sélection de sous-catégorie)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('branche CAT_RENTREE_ARGENT : type opération = CREDIT et ssCategorie.type = REVENUS', async () => {
        const user = userEvent.setup();
        const listeCategories = buildListeCategories();
        const { operation } = renderPage(listeCategories);

        await user.click(screen.getByTestId('select-sscat-sscat-rentree'));

        expect(operation.categorie.id).toBe(BUSINESS_GUID.CAT_RENTREE_ARGENT);
        expect(operation.categorie.libelle).toBe('Rentrées d\'argent');
        expect(operation.ssCategorie.id).toBe('sscat-rentree');
        expect(operation.ssCategorie.libelle).toBe('Salaire');
        expect(operation.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
        expect(operation.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.REVENUS);
    });

    test('branche CAT_ACTIFS_INVEST : type CREDIT, catégorie ECONOMIES, mensualité forcée MENSUELLE', async () => {
        const user = userEvent.setup();
        const listeCategories = buildListeCategories();
        const { operation } = renderPage(listeCategories);

        await user.click(screen.getByTestId('select-sscat-sscat-actif'));

        expect(operation.categorie.id).toBe(BUSINESS_GUID.CAT_ACTIFS_INVEST);
        expect(operation.ssCategorie.id).toBe('sscat-actif');
        expect(operation.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
        expect(operation.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES);
        expect(operation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
        // Le bloc "Période" n'est affiché que si categorie.id !== CAT_ACTIFS_INVEST : ici masqué
        expect(screen.queryByText('Période')).not.toBeInTheDocument();
    });

    test('branche défaut : type opération = DEPENSE pour une catégorie parente quelconque', async () => {
        const user = userEvent.setup();
        const listeCategories = buildListeCategories();
        const { operation } = renderPage(listeCategories);

        await user.click(screen.getByTestId('select-sscat-sscat-autre'));

        expect(operation.categorie.id).toBe('cat-autre');
        expect(operation.ssCategorie.id).toBe('sscat-autre');
        expect(operation.typeOperation).toBe(TYPES_OPERATION_ENUM.DEPENSE);
        // Bloc "Période" affiché car catégorie != CAT_ACTIFS_INVEST
        expect(screen.getByText('Période')).toBeInTheDocument();
    });

    test('sous-catégorie sans catégorie parente : ssCategorie mise à jour, categorie inchangée', async () => {
        const user = userEvent.setup();
        const listeCategories = buildListeCategories();
        const { operation } = renderPage(listeCategories);
        const categorieAvant = { ...operation.categorie };

        await user.click(screen.getByTestId('select-sscat-sscat-sans-parente'));

        // categorie inchangée : pas de categorieParente sur la sscat sélectionnée
        expect(operation.categorie).toEqual(categorieAvant);
        expect(operation.ssCategorie.id).toBe('sscat-sans-parente');
        expect(operation.ssCategorie.libelle).toBe('Sans parente');
        // Branche défaut appliquée (pas de match CAT_RENTREE_ARGENT/CAT_ACTIFS_INVEST)
        expect(operation.typeOperation).toBe(TYPES_OPERATION_ENUM.DEPENSE);
    });

    test('ssCatId non trouvé dans listeCategories : aucune mise à jour, formulaire inchangé', async () => {
        const user = userEvent.setup();
        const listeCategories = buildListeCategories();
        const { operation } = renderPage(listeCategories);
        const categorieAvant = { ...operation.categorie };
        const ssCategorieAvant = { ...operation.ssCategorie };
        const typeOperationAvant = operation.typeOperation;

        await user.click(screen.getByTestId('select-sscat-inconnue'));

        expect(operation.categorie).toEqual(categorieAvant);
        expect(operation.ssCategorie.id).toEqual(ssCategorieAvant.id);
        expect(operation.ssCategorie.libelle).toEqual(ssCategorieAvant.libelle);
        expect(operation.typeOperation).toBe(typeOperationAvant);
    });
});
