import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { OperationDetailDateFin, validateFormDateFinPeriode } from './OperationRecurrenteDetailDateFin.component.tsx';
import { CurrentBudgetContext } from '../../../../hooks/useBudgetContext.ts';
import BudgetMensuelModel from '../../../../Models/budgets/BudgetMensuel.model.ts';
import { OPERATION_RECURRENTE_EDITION_FORM } from '../recurrentes/details/OperationRecurrenteDetailPage.constants.ts';
import { OPERATION_STATUS_ENUM } from '../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Composant déplacé vers operations/shared/ (AP 006) et lisant CurrentBudgetContext (T6).
 */

const budget = Object.assign(new BudgetMensuelModel('c1_2026_03', 'Budget'), { actif: true });

function renderDateFin(opts: { budget?: BudgetMensuelModel, operation?: any, edition?: boolean, error?: string | null } = {}) {
    const fill = vi.fn();
    const value: any = {
        currentBudget: 'budget' in opts ? opts.budget : budget,
        currentOperation: 'operation' in opts ? opts.operation : { mensualite: { dateFin: null } }
    };
    render(
        <CurrentBudgetContext.Provider value={value}>
            <OperationDetailDateFin formDateInEdition={opts.edition ?? false} errorDateOperation={opts.error ?? null} fillOperationForm={fill} />
        </CurrentBudgetContext.Provider>
    );
    return { fill };
}

describe('OperationDetailDateFin (composant)', () => {

    test('lecture : "Jamais" si pas de date de fin', () => {
        renderDateFin();
        expect(screen.getByText('Jamais')).toBeInTheDocument();
    });

    test('lecture : mois/année en français si date de fin', () => {
        renderDateFin({ operation: { mensualite: { dateFin: new Date(2026, 5, 15) } } });
        expect(screen.getByText(/juin 2026/i)).toBeInTheDocument();
    });

    test('ne rend rien sans budget courant ou sans opération courante', () => {
        renderDateFin({ budget: undefined });
        expect(screen.queryByText('Jamais')).not.toBeInTheDocument();
    });

    test('ne rend rien sans opération courante', () => {
        renderDateFin({ operation: null });
        expect(screen.queryByText('Jamais')).not.toBeInTheDocument();
    });

    test('édition : saisie d un mois -> fillOperationForm(DATE_FIN, valeur)', () => {
        const { fill } = renderDateFin({ edition: true });
        fireEvent.change(screen.getByDisplayValue(''), { target: { value: '2026-09' } });
        expect(fill).toHaveBeenCalledWith(OPERATION_RECURRENTE_EDITION_FORM.DATE_FIN, '2026-09');
    });

    test('édition : message d erreur affiché', () => {
        renderDateFin({ edition: true, error: 'Date invalide' });
        expect(screen.getByText('Date invalide')).toBeInTheDocument();
    });
});

describe('validateFormDateFinPeriode', () => {

    const buildOperation = () => ({ mensualite: { dateFin: null }, statuts: [] as OPERATION_STATUS_ENUM[] }) as any;

    test('ne fait rien si le champ dateFin n est pas en édition', () => {
        const errors: any = { dateFin: 'x' };
        validateFormDateFinPeriode(budget, { mensualite: { dateFin: new Date(2020, 0, 1) } } as any, buildOperation(), { dateFin: false } as any, errors);
        expect(errors.dateFin).toBe('x');
    });

    test('erreur si la date de fin précède le mois du budget', () => {
        const errors: any = { dateFin: null };
        validateFormDateFinPeriode(budget, { mensualite: { dateFin: new Date(2026, 0, 1) } } as any, buildOperation(), { dateFin: true } as any, errors);
        expect(errors.dateFin).toMatch(/supérieure ou égale au mois du budget/);
    });

    test('date de fin = mois du budget : appliquée et statut DERNIERE_ECHEANCE ajouté une seule fois', () => {
        const errors: any = { dateFin: 'x' };
        const operation = buildOperation();
        const dateFin = new Date(2026, 2, 15);
        validateFormDateFinPeriode(budget, { mensualite: { dateFin } } as any, operation, { dateFin: true } as any, errors);
        validateFormDateFinPeriode(budget, { mensualite: { dateFin } } as any, operation, { dateFin: true } as any, errors);
        expect(errors.dateFin).toBeNull();
        expect(operation.mensualite.dateFin).toBe(dateFin);
        expect(operation.statuts.filter((s: OPERATION_STATUS_ENUM) => s === OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE)).toHaveLength(1);
    });

    test('date de fin postérieure au mois du budget : statut DERNIERE_ECHEANCE retiré', () => {
        const errors: any = { dateFin: null };
        const operation = buildOperation();
        operation.statuts = [OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE];
        validateFormDateFinPeriode(budget, { mensualite: { dateFin: new Date(2026, 8, 1) } } as any, operation, { dateFin: true } as any, errors);
        expect(operation.statuts).not.toContain(OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE);
    });

    test('date de fin effacée (null) : appliquée sans statut', () => {
        const errors: any = { dateFin: 'x' };
        const operation = buildOperation();
        validateFormDateFinPeriode(budget, { mensualite: { dateFin: null } } as any, operation, { dateFin: true } as any, errors);
        expect(errors.dateFin).toBeNull();
        expect(operation.mensualite.dateFin).toBeNull();
        expect(operation.statuts).toEqual([]);
    });
});
