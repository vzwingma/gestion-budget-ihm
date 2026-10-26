import { beforeEach, describe, expect, test, vi } from 'vitest';
import { toast } from 'react-toastify';

import { handleOperationAction } from './OperationDetailActions.controller.ts';
import { saveOperation } from '../OperationDetailPage.extservices.ts';
import { buildBudget, buildOperation } from '../OperationDetailPage.testutils.tsx';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Compléments de OperationDetailActions.controller.test.ts : dates selon l'état cible (création / édition),
 * suppression confirmée, no-op sur état identique, clic hors cadre.
 */
vi.mock('../OperationDetailPage.extservices.ts', () => ({ saveOperation: vi.fn() }));
vi.mock('react-toastify', () => ({ toast: { warn: vi.fn() } }));

describe('OperationDetailActions.controller - modes création / édition', () => {

    const onOperationChange = vi.fn();
    const setShowModale = vi.fn();
    const handleDate = vi.fn();

    function agir(action: string, { creation = false, operation = buildOperation(), budget = buildBudget() } = {}) {
        const editOperation = cloneOperation(operation);
        handleOperationAction({ target: { id: action } }, operation, budget, creation, editOperation, handleDate, onOperationChange, setShowModale as any);
        return { operation, editOperation, budget };
    }

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    test('clic sur le cadre du formulaire (OPERATION_FORM) : ignoré', () => {
        const { operation } = agir('OPERATION_FORM');

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(saveOperation).not.toHaveBeenCalled();
        expect(setShowModale).not.toHaveBeenCalled();
    });

    test('création, REALISEE avec date saisie : la date de l\'édition est reprise et transmise à la page', () => {
        const operation = buildOperation();
        const date = new Date('2026-05-02T00:00:00.000Z');
        const editOperation = cloneOperation(operation);
        editOperation.autresInfos.dateOperation = date;

        handleOperationAction({ target: { id: 'REALISEE' } }, operation, buildBudget(), true, editOperation, handleDate, onOperationChange, setShowModale as any);

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(operation.autresInfos.dateOperation).toBe(date);
        expect(handleDate).toHaveBeenCalledWith(date);
        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('création, REALISEE sans date saisie : la date du jour est utilisée', () => {
        const { operation } = agir('REALISEE', { creation: true });

        expect(operation.autresInfos.dateOperation).toBeInstanceOf(Date);
        expect(handleDate).toHaveBeenCalledWith(operation.autresInfos.dateOperation);
    });

    test.each(['REPORTEE', 'PREVUE'])('création, %s : date d\'opération effacée', (action) => {
        const operation = buildOperation();
        operation.autresInfos.dateOperation = new Date('2026-05-02');

        agir(action, { creation: true, operation });

        expect(operation.etat).toBe(action);
        expect(operation.autresInfos.dateOperation).toBeNull();
        expect(handleDate).toHaveBeenCalledWith(null);
    });

    test('édition, REALISEE : conserve la date existante', () => {
        const operation = buildOperation();
        const date = new Date('2026-04-01T00:00:00.000Z');
        operation.autresInfos.dateOperation = date;

        agir('REALISEE', { operation });

        expect(operation.autresInfos.dateOperation).toBe(date);
        expect(saveOperation).toHaveBeenCalledWith(operation, expect.anything(), onOperationChange);
    });

    test('édition, REALISEE sans date : date du jour', () => {
        const { operation } = agir('REALISEE');

        expect(operation.autresInfos.dateOperation).toBeInstanceOf(Date);
    });

    test('édition, PREVUE : date effacée et sauvegarde', () => {
        const operation = buildOperation({ etat: OPERATION_ETATS_ENUM.REALISEE });
        operation.autresInfos.dateOperation = new Date('2026-04-01');

        agir('PREVUE', { operation });

        expect(operation.autresInfos.dateOperation).toBeNull();
        expect(saveOperation).toHaveBeenCalledTimes(1);
    });

    test.each(['REPORTEE', 'ANNULEE'])('édition, %s : état changé et sauvegardé, date inchangée', (action) => {
        const operation = buildOperation();
        const date = new Date('2026-04-01T00:00:00.000Z');
        operation.autresInfos.dateOperation = date;

        agir(action, { operation });

        expect(operation.etat).toBe(action);
        expect(operation.autresInfos.dateOperation).toBe(date);
        expect(saveOperation).toHaveBeenCalledTimes(1);
    });

    test('édition, état identique à l\'état courant : aucune sauvegarde', () => {
        agir('PREVUE');

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('suppression confirmée : état SUPPRIMEE sauvegardé et modale refermée', () => {
        const { operation } = agir('SUPPRIMEE');

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.SUPPRIMEE);
        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(setShowModale).toHaveBeenCalledWith(false);
    });

    test('budget clos : avertissement, état inchangé, aucune sauvegarde', () => {
        const { operation } = agir('REALISEE', { budget: buildBudget(false) });

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(saveOperation).not.toHaveBeenCalled();
        expect(toast.warn).toHaveBeenCalledTimes(1);
    });
});
