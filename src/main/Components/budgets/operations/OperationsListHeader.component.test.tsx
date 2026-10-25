import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import OperationsListHeader, {getTotalLabel} from './OperationsListHeader.component.tsx';
import {GROUPE_A_VALIDER} from '../budget/Budget.controller.ts';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';

const ope = (valeur: number, etat: OPERATION_ETATS_ENUM = OPERATION_ETATS_ENUM.REALISEE, date: Date | null = null): OperationModel =>
    ({id: 'x' + valeur + etat, valeur, etat, autresInfos: {dateOperation: date}}) as unknown as OperationModel;

// Les espaces insécables des séparateurs de milliers / avant « € » ne sont pas garantis : on normalise
const norm = (t: string | null) => (t ?? '').replace(/\s/g, ' ');

describe('getTotalLabel', () => {
    test('total positif : « + » explicite', () => {
        expect(getTotalLabel([ope(10), ope(2)], false)).toBe('+12,00 €');
    });
    test('total négatif', () => {
        expect(getTotalLabel([ope(-4.35)], false)).toBe('-4,35 €');
    });
    test('zéro : « 0,00 € » sans signe ni -0', () => {
        expect(getTotalLabel([ope(-5), ope(5)], false)).toBe('0,00 €');
        expect(getTotalLabel([], false)).toBe('0,00 €');
    });
    test('arrondi des flottants (0,1 + 0,2)', () => {
        expect(getTotalLabel([ope(0.1), ope(0.2)], false)).toBe('+0,30 €');
    });
    test('exclureInactives ignore ANNULEE et SUPPRIMEE uniquement', () => {
        const ops = [ope(-10), ope(-100, OPERATION_ETATS_ENUM.ANNULEE), ope(-1000, OPERATION_ETATS_ENUM.SUPPRIMEE),
            ope(-1, OPERATION_ETATS_ENUM.PREVUE)];
        expect(getTotalLabel(ops, true)).toBe('-11,00 €');
    });
    test('sans exclusion, annulées et supprimées comptent', () => {
        expect(getTotalLabel([ope(-10), ope(-100, OPERATION_ETATS_ENUM.ANNULEE)], false)).toBe('-110,00 €');
    });
});

describe('OperationsListHeader', () => {
    test('« À valider · N · total » : compteur et total sans exclusion', () => {
        const ops = [ope(-10, OPERATION_ETATS_ENUM.PREVUE), ope(-5, OPERATION_ETATS_ENUM.REPORTEE), ope(-1, OPERATION_ETATS_ENUM.ANNULEE)];
        render(<OperationsListHeader groupKey={GROUPE_A_VALIDER} operations={ops}/>);
        expect(norm(screen.getByRole('heading').textContent)).toBe('À valider · 3 · -16,00 €');
    });

    test('en-tête de date : jour de semaine local + jj/mm + sous-total', () => {
        // lundi 02/11/2026, construit en local
        const date = new Date(2026, 10, 2, 0, 30);
        render(<OperationsListHeader groupKey="02/11/2026" operations={[ope(-4.35, OPERATION_ETATS_ENUM.REALISEE, date)]}/>);
        expect(norm(screen.getByRole('heading').textContent)).toBe('Lun. 02/11 · -4,35 €');
    });

    test('sous-total de date exclut ANNULEE et SUPPRIMEE', () => {
        const date = new Date(2026, 10, 2, 12);
        const ops = [ope(-4.35, OPERATION_ETATS_ENUM.REALISEE, date),
            ope(-50, OPERATION_ETATS_ENUM.ANNULEE, date),
            ope(-70, OPERATION_ETATS_ENUM.SUPPRIMEE, date)];
        render(<OperationsListHeader groupKey="02/11/2026" operations={ops}/>);
        expect(norm(screen.getByRole('heading').textContent)).toBe('Lun. 02/11 · -4,35 €');
    });

    test('role=heading niveau 3, hauteur fixe 40px', () => {
        render(<OperationsListHeader groupKey={GROUPE_A_VALIDER} operations={[ope(1, OPERATION_ETATS_ENUM.PREVUE)]}/>);
        const h = screen.getByRole('heading', {level: 3});
        expect(h).toBeInTheDocument();
        expect(h).toHaveTextContent(/À valider · 1 · \+1,00/);
    });
});
