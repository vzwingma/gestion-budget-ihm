import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import SharedOperationsListe, {filterOperationsList} from './OperationsListe.shared.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';
import {PUCE_ETAT_ENUM, PUCE_SENS_ENUM, PucesFiltre} from '../../../Utils/OperationsFilter.utils.ts';

/** Tests AP 005 - Phase 4 (T4.6) : puces de filtre dans la liste partagée, non-régression texte seul / récurrents */

const ope = (id: string, libelle: string, valeur: number, etat: OPERATION_ETATS_ENUM, cat = 'Cat', ssCat = 'Ss'): OperationModel =>
    ({id, libelle, valeur, etat, categorie: {libelle: cat}, ssCategorie: {libelle: ssCat}}) as unknown as OperationModel;

const jeu = () => [
    ope('1', 'Pharmacie', -12, OPERATION_ETATS_ENUM.PREVUE),
    ope('2', 'Pharmacie bis', -8, OPERATION_ETATS_ENUM.REALISEE),
    ope('3', 'Loyer', -500, OPERATION_ETATS_ENUM.REPORTEE),
    ope('4', 'Salaire', 2000, OPERATION_ETATS_ENUM.REALISEE),
    ope('5', 'Cafe', -4, OPERATION_ETATS_ENUM.ANNULEE, 'Sorties'),
    ope('6', 'Rembours', 30, OPERATION_ETATS_ENUM.SUPPRIMEE, 'Sante', 'Pharma-ss'),
];
const ids = (ops: OperationModel[]) => ops.map(o => o.id);
const puces = (etats: PUCE_ETAT_ENUM[] = [], sens: PUCE_SENS_ENUM[] = []): PucesFiltre => ({etats, sens});

describe('filterOperationsList', () => {
    test('texte seul (puces undefined) : comportement d avant, insensible à la casse, libellé / catégorie / sous-catégorie', () => {
        expect(ids(filterOperationsList(jeu(), 'PHARMA'))).toEqual(['1', '2', '6']);
        expect(ids(filterOperationsList(jeu(), 'sorties'))).toEqual(['5']);
        expect(ids(filterOperationsList(jeu(), 'zzz'))).toEqual([]);
    });

    test('texte null ou vide : tout passe sans puces', () => {
        expect(filterOperationsList(jeu(), null)).toHaveLength(6);
        expect(filterOperationsList(jeu(), '')).toHaveLength(6);
    });

    test('puces vides explicites : équivaut à aucune puce', () => {
        expect(filterOperationsList(jeu(), null, puces())).toHaveLength(6);
        expect(ids(filterOperationsList(jeu(), 'pharma', puces()))).toEqual(['1', '2', '6']);
    });

    test('puces seules (texte null) : filtre par état et sens', () => {
        expect(ids(filterOperationsList(jeu(), null, puces([PUCE_ETAT_ENUM.A_VALIDER])))).toEqual(['1', '3']);
        expect(ids(filterOperationsList(jeu(), '', puces([PUCE_ETAT_ENUM.ANNULEE])))).toEqual(['5']);
        expect(ids(filterOperationsList(jeu(), null, puces([], [PUCE_SENS_ENUM.RENTREES])))).toEqual(['4', '6']);
    });

    test('ET texte + puces : « pharma » + « À valider »', () => {
        expect(ids(filterOperationsList(jeu(), 'pharma', puces([PUCE_ETAT_ENUM.A_VALIDER])))).toEqual(['1']);
    });

    test('ET texte + puces : résultat vide si aucune opération ne satisfait les deux', () => {
        expect(filterOperationsList(jeu(), 'loyer', puces([PUCE_ETAT_ENUM.REALISEE]))).toEqual([]);
    });

    test('combinaison État × Sens', () => {
        expect(ids(filterOperationsList(jeu(), null, puces([PUCE_ETAT_ENUM.REALISEE], [PUCE_SENS_ENUM.DEPENSES])))).toEqual(['2']);
    });
});

describe('SharedOperationsListe - puces', () => {
    const noop = () => {
    };
    const renderItem = (o: OperationModel) => <div data-testid="item" key={o.id}>{o.libelle}</div>;

    test('filterPuces filtre les items rendus et les opérations transmises à renderGroupHeader', () => {
        const header = vi.fn((key: string, ops: OperationModel[]) => <h4>{key}:{ops.length}</h4>);
        render(<SharedOperationsListe operationsGrouped={{g1: jeu().slice(0, 4), g2: jeu().slice(4)}} filterOperations={null}
                                      filterPuces={puces([PUCE_ETAT_ENUM.REALISEE])} onClick={noop}
                                      renderItem={renderItem} renderGroupHeader={header}/>);
        expect(screen.getAllByTestId('item').map(i => i.textContent)).toEqual(['Pharmacie bis', 'Salaire']);
        expect(screen.getByRole('heading', {name: 'g1:2'})).toBeInTheDocument();
        // g2 (Annulée + Supprimée) entièrement filtré : pas d'en-tête
        expect(screen.queryByRole('heading', {name: /^g2/})).not.toBeInTheDocument();
    });

    test('sans filterPuces (liste récurrente) : aucun filtrage par puce', () => {
        render(<SharedOperationsListe operationsGrouped={{Mensuelle: jeu()}} filterOperations={null} onClick={noop} renderItem={renderItem}/>);
        expect(screen.getAllByTestId('item')).toHaveLength(6);
    });

    describe('hauteur de la liste (reservedHeight)', () => {
        beforeEach(() => {
            vi.stubGlobal('innerHeight', 1000);
        });
        afterEach(() => {
            vi.unstubAllGlobals();
        });

        test('sans reservedHeight (récurrents) : hauteur inchangée (innerHeight - 140)', () => {
            render(<SharedOperationsListe operationsGrouped={{}} filterOperations={null} onClick={noop} renderItem={renderItem}/>);
            // Stack sans rôle ni texte propre : requête TL par sélecteur CSS (cf. test existant)
            expect(getComputedStyle(screen.getByText('', {selector: '.operationsListeScrollable'})).height).toBe('860px');
        });

        test('avec reservedHeight : hauteur réduite d autant', () => {
            render(<SharedOperationsListe operationsGrouped={{}} filterOperations={null} onClick={noop} renderItem={renderItem}
                                          reservedHeight={48}/>);
            expect(getComputedStyle(screen.getByText('', {selector: '.operationsListeScrollable'})).height).toBe('812px');
        });
    });
});
