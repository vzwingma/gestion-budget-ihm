import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import {
    BudgetContext,
    BudgetContextProvider,
    BudgetSelectionContext,
    CurrentBudgetContext,
    useBudgetContext
} from '../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import type { BudgetSelectionContextType, CurrentBudgetContextType } from '../../../../../hooks/useBudgetContext.ts';
import { FILTRE_OPERATIONS_VIDE } from '../../../../../Utils/OperationsFilter.utils.ts';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import CategorieOperationModel from '../../../../../Models/budgets/CategorieOperation.model.ts';
import CompteBancaireModel from '../../../../../Models/budgets/CompteBancaire.model.ts';
import OperationModel, { createNewOperation } from '../../../../../Models/budgets/Operation.model.ts';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../../Utils/AppBusinessEnums.constants.ts';
import { OperationDetailPage } from './OperationDetailPage.component.tsx';

/**
 * Utilitaires partagés des tests de caractérisation de `OperationDetailPage`
 * (vrai `BudgetContextProvider` + vrais sous-composants ; seuls les services HTTP sont mockés par chaque fichier de test).
 */

/** Référentiel de catégories : une catégorie "standard", Rentrées d'argent, Actifs/Investissements, Virements */
export function buildCategories(): CategorieOperationModel[] {
    const alimentation: CategorieOperationModel = { id: 'cat-alim', libelle: 'Alimentation' };
    const rentree: CategorieOperationModel = { id: BUSINESS_GUID.CAT_RENTREE_ARGENT, libelle: "Rentrées d'argent" };
    const actifs: CategorieOperationModel = { id: BUSINESS_GUID.CAT_ACTIFS_INVEST, libelle: 'Actifs' };
    const virements: CategorieOperationModel = { id: 'cat-virements', libelle: 'Virements' };
    const ss = (id: string, libelle: string, parente: CategorieOperationModel, type: TYPES_CATEGORIES_OPERATION_ENUM) =>
        ({ id, libelle, type, categorieParente: parente }) as any;
    return [
        { ...alimentation, listeSSCategories: [ss('ss-courses', 'Courses', alimentation, TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL), ss('ss-resto', 'Restaurant', alimentation, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR)] },
        { ...rentree, listeSSCategories: [ss('ss-salaire', 'Salaire', rentree, TYPES_CATEGORIES_OPERATION_ENUM.REVENUS)] },
        { ...actifs, listeSSCategories: [ss('ss-bourse', 'Bourse', actifs, TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES)] },
        { ...virements, listeSSCategories: [ss(BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE, 'Virement interne', virements, TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL)] }
    ];
}

export function buildComptes(): CompteBancaireModel[] {
    const compte = (id: string, libelle: string, actif: boolean): CompteBancaireModel =>
        ({ id, libelle, itemIcon: 'icone.png', ordre: 1, actif, proprietaires: [{ login: 'vincent.z' }] }) as any;
    return [compte('compte-1', 'Compte courant', true), compte('compte-2', 'Livret A', true), compte('compte-3', 'Compte fermé', false)];
}

export function buildBudget(actif = true): BudgetMensuelModel {
    const budget = new BudgetMensuelModel('compte-1_2026_10', 'Budget octobre');
    budget.idCompteBancaire = 'compte-1';
    budget.actif = actif;
    return budget;
}

/** Opération existante "Courses", dépense de 50, prévue, ponctuelle */
export function buildOperation(overrides: Partial<OperationModel> = {}): OperationModel {
    const operation = createNewOperation();
    operation.id = 'op-1';
    operation.libelle = 'Courses Carrefour';
    operation.categorie = { id: 'cat-alim', libelle: 'Alimentation' };
    operation.ssCategorie = { id: 'ss-courses', libelle: 'Courses', type: TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL };
    operation.typeOperation = TYPES_OPERATION_ENUM.DEPENSE;
    operation.etat = OPERATION_ETATS_ENUM.PREVUE;
    operation.valeur = -50;
    operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE, prochaineEcheance: -1 };
    operation.autresInfos.dateOperation = null;
    return Object.assign(operation, overrides);
}

/** Alimente le vrai provider (budget, comptes, catégories) puis expose des boutons de sélection d'opération */
function ContextSeed({ budget, comptes, categories, operations, initialOperationId }: Readonly<{
    budget: BudgetMensuelModel;
    comptes: CompteBancaireModel[];
    categories: CategorieOperationModel[];
    operations: Record<string, OperationModel | null>;
    initialOperationId?: string;
}>) {
    const { setCurrentBudget, setListeComptes, setCategories, setCurrentOperation, currentOperation, setSelectedDate } = useBudgetContext();
    useEffect(() => {
        setCurrentBudget(budget);
        setListeComptes(comptes);
        setCategories(categories);
        if (initialOperationId !== undefined) {
            setCurrentOperation(operations[initialOperationId]);
        }
        // Initialisation unique au montage
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <output aria-label="operation-courante">{currentOperation?.id ?? 'aucune'}</output>
            {/* Provoque un re-render des consumers de l'agrégat (dont la page) sans toucher au budget ni à l'opération */}
            <button type="button" onClick={() => setSelectedDate((date) => new Date(date))}>forcer le rendu</button>
            {Object.keys(operations).map((key) => (
                <button key={key} type="button" onClick={() => setCurrentOperation(operations[key])}>
                    {'select ' + key}
                </button>
            ))}
        </div>
    );
}

export interface RenderPageOptions {
    budget?: BudgetMensuelModel;
    operations?: Record<string, OperationModel | null>;
    initialOperationId?: string;
    categories?: CategorieOperationModel[];
    comptes?: CompteBancaireModel[];
    libelles?: any[];
    onOperationChange?: (budget: BudgetMensuelModel) => void;
}

/**
 * Rend la page dans le vrai provider.
 * @returns opérations/budget fournis + spy `onOperationChange` (et le `rerender` n'est pas exposé : sélection via boutons `select <clé>`)
 */
export function renderPage(options: RenderPageOptions = {}) {
    const budget = options.budget ?? buildBudget();
    const operations = options.operations ?? { existante: buildOperation() };
    const categories = options.categories ?? buildCategories();
    const comptes = options.comptes ?? buildComptes();
    const onOperationChange = options.onOperationChange ?? vi.fn();
    const initialOperationId = 'initialOperationId' in options ? options.initialOperationId : Object.keys(operations)[0];

    render(
        <BudgetContextProvider>
            <ContextSeed budget={budget} comptes={comptes} categories={categories} operations={operations} initialOperationId={initialOperationId} />
            <OperationDetailPage
                listeCategories={categories}
                listeLibellesOperations={options.libelles ?? []}
                onOperationChange={onOperationChange}
            />
        </BudgetContextProvider>
    );
    return { budget, operations, categories, comptes, onOperationChange };
}

export interface RenderWithContextsOptions {
    budget?: BudgetMensuelModel;
    /** `null` explicite = aucune opération sélectionnée */
    operation?: OperationModel | null;
    comptes?: CompteBancaireModel[];
    categories?: CategorieOperationModel[];
}

/**
 * Rend un sous-composant dans les trois contextes budget (agrégat + sélection + budget courant) avec des valeurs figées,
 * pour tester isolément les composants qui lisent le contexte (`useBudgetContext`, `useCurrentBudget`, `useBudgetSelection`).
 */
export function renderWithContexts(ui: React.ReactElement, options: RenderWithContextsOptions = {}) {
    const selection: BudgetSelectionContextType = {
        comptes: options.comptes ?? buildComptes(),
        setListeComptes: vi.fn(),
        selectedCompte: null,
        setSelectedCompte: vi.fn(),
        selectedDate: new Date(2026, 9, 1),
        setSelectedDate: vi.fn(),
        categories: options.categories ?? buildCategories(),
        setCategories: vi.fn()
    };
    const current: CurrentBudgetContextType = {
        currentBudget: 'budget' in options ? options.budget : buildBudget(),
        setCurrentBudget: vi.fn(),
        currentOperation: 'operation' in options ? (options.operation ?? null) : buildOperation(),
        setCurrentOperation: vi.fn(),
        filtreOperations: FILTRE_OPERATIONS_VIDE,
        setFiltreOperations: vi.fn()
    };
    return render(
        <BudgetSelectionContext.Provider value={selection}>
            <CurrentBudgetContext.Provider value={current}>
                <BudgetContext.Provider value={{ ...selection, ...current }}>
                    {ui}
                </BudgetContext.Provider>
            </CurrentBudgetContext.Provider>
        </BudgetSelectionContext.Provider>
    );
}
