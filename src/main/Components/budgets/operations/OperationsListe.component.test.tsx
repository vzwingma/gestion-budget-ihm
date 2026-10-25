import {describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import OperationsListe from './OperationsListe.component.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';
import {getOperationsGroupedByDateOperation} from '../budget/Budget.controller.ts';

// Contexte budget : seule la liste des comptes est utilisée par les lignes
vi.mock('../../../hooks/useBudgetContext.ts', () => ({
    useBudgetSelection: () => ({comptes: []}),
}));

// Normalise les espaces (insécables) des séparateurs de milliers / avant « € »
const norm = (t: string | null) => (t ?? '').replace(/\s/g, ' ');
const titres = () => screen.queryAllByRole('heading').map(h => norm(h.textContent));
const d02 = new Date(2026, 10, 2, 12); // lundi 02/11/2026, construit en local

const ope = (id: string, libelle: string, valeur: number, etat: OPERATION_ETATS_ENUM, date: Date | null): OperationModel =>
    ({
        id, libelle, valeur, etat, statuts: [],
        categorie: {id: 'c', libelle: 'Cat'}, ssCategorie: {id: 's', libelle: 'Ss'},
        autresInfos: {dateOperation: date}
    }) as unknown as OperationModel;

const liste = (ops: OperationModel[], filter: string | null, selected: string | null) =>
    <OperationsListe operationGroupedByDate={getOperationsGroupedByDateOperation(ops)}
                     filterOperations={filter} onClick={vi.fn()} selectedOperationId={selected}/>;

const jeu = () => [
    ope('1', 'Loyer', -500, OPERATION_ETATS_ENUM.PREVUE, null),
    ope('2', 'Courses', -30, OPERATION_ETATS_ENUM.REPORTEE, null),
    ope('3', 'Salaire', 2000, OPERATION_ETATS_ENUM.REALISEE, d02),
    ope('4', 'Cafe', -4.35, OPERATION_ETATS_ENUM.REALISEE, d02),
    ope('5', 'Annule', -99, OPERATION_ETATS_ENUM.ANNULEE, d02),
    ope('6', 'Orphelin', -7, OPERATION_ETATS_ENUM.REALISEE, null),
];

describe('OperationsListe - en-têtes de groupe', () => {
    test('« À valider » en premier, puis la date ; clé "null" sans en-tête', () => {
        render(liste(jeu(), null, null));
        const t = titres();
        expect(t).toHaveLength(2);
        expect(t[0]).toBe('À valider · 2 · -530,00 €');
        // sous-total de date : 2000 - 4,35 (ANNULEE exclue) ; séparateur de milliers selon locale
        expect(t[1]).toMatch(/^Lun\. 02\/11 · \+1.995,65 €$/);
        expect(screen.getByText('Orphelin')).toBeInTheDocument();
    });

    test('le filtre texte met à jour compteur et total', () => {
        render(liste(jeu(), 'loyer', null));
        expect(titres()).toEqual(['À valider · 1 · -500,00 €']);
    });

    test('groupe filtré vide : pas d\'en-tête', () => {
        render(liste(jeu(), 'cafe', null));
        expect(titres()).toEqual(['Lun. 02/11 · -4,35 €']);
    });

    test('aucun résultat : aucun en-tête', () => {
        render(liste(jeu(), 'zzz', null));
        expect(titres()).toEqual([]);
    });

    test('opération remise sans date rejoint « À valider », puis retour au groupe de date', () => {
        const op = ope('9', 'Valid', -10, OPERATION_ETATS_ENUM.PREVUE, d02);
        const {rerender} = render(liste([op], null, null));
        expect(titres()).toEqual(['Lun. 02/11 · -10,00 €']);

        const sansDate = {...op, autresInfos: {dateOperation: null}} as OperationModel;
        rerender(liste([sansDate], null, null));
        expect(titres()).toEqual(['À valider · 1 · -10,00 €']);

        rerender(liste([op], null, null));
        expect(titres()).toEqual(['Lun. 02/11 · -10,00 €']);
    });
});

describe('OperationsListe - T3.4 sélection après regroupement', () => {
    test('la ligne sélectionnée (par id) reste marquée quand elle change de groupe', () => {
        const op = ope('9', 'Valid', -10, OPERATION_ETATS_ENUM.PREVUE, null);
        const {rerender} = render(liste([op], null, '9'));
        expect(screen.getAllByText('', {selector: '.operation-list-item--selected'})).toHaveLength(1);
        expect(screen.getByRole('heading')).toHaveTextContent(/À valider/);

        // Après validation : handleBudgetUpdate recalcule le regroupement, la même opération est datée
        const validee = {...op, etat: OPERATION_ETATS_ENUM.REALISEE, autresInfos: {dateOperation: d02}} as OperationModel;
        rerender(liste([validee], null, '9'));
        expect(screen.getByRole('heading')).toHaveTextContent(/Lun\. 02\/11/);
        expect(screen.getAllByText('', {selector: '.operation-list-item--selected'})).toHaveLength(1);
    });
});
