import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';
import { toast } from 'react-toastify';

import { handleOperationAction } from './OperationDetailActions.controller.ts';
import { saveOperation } from '../OperationDetailPage.extservices.ts';
import { buildBudget, buildOperation } from '../OperationDetailPage.testutils.tsx';
import type OperationModel from '../../../../../../Models/budgets/Operation.model.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Compléments de OperationDetailActions.controller.test.ts : dates selon l'état cible (création / édition),
 * suppression confirmée, no-op sur état identique, clic hors cadre.
 *
 * Contrat : l'opération du contexte n'est jamais mutée ; en édition, une COPIE est sauvegardée et ne devient
 * l'opération courante (onOperationCommit) qu'au succès de la sauvegarde.
 */
vi.mock('../OperationDetailPage.extservices.ts', () => ({ saveOperation: vi.fn() }));
vi.mock('react-toastify', () => ({ toast: { warn: vi.fn() } }));

describe('OperationDetailActions.controller - modes création / édition', () => {

    const onOperationChange = vi.fn();
    const onOperationCommit = vi.fn();
    const setShowModale = vi.fn();
    const handleDate = vi.fn();

    function agir(action: string, { creation = false, operation = buildOperation(), budget = buildBudget() } = {}) {
        const editOperation = cloneOperation(operation);
        handleOperationAction({ target: { id: action } }, operation, budget, creation, editOperation, handleDate, onOperationChange, setShowModale as any, onOperationCommit);
        return { operation, editOperation, budget };
    }

    /** Objet transmis à saveOperation (copie de l'opération du contexte) */
    function sauvegardee(): OperationModel {
        return (saveOperation as Mock).mock.calls[0][0];
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

    test('création, REALISEE avec date saisie : la date de l\'édition est transmise à la page avec l\'état, contexte inchangé', () => {
        const operation = buildOperation();
        const date = new Date('2026-05-02T00:00:00.000Z');
        const editOperation = cloneOperation(operation);
        editOperation.autresInfos.dateOperation = date;

        handleOperationAction({ target: { id: 'REALISEE' } }, operation, buildBudget(), true, editOperation, handleDate, onOperationChange, setShowModale as any, onOperationCommit);

        expect(handleDate).toHaveBeenCalledWith(date, OPERATION_ETATS_ENUM.REALISEE);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(operation.autresInfos.dateOperation).toBeNull();
        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('création, REALISEE sans date saisie : la date du jour est transmise', () => {
        const avant = Date.now();
        const { operation } = agir('REALISEE', { creation: true });

        const [date, etat] = handleDate.mock.calls[0];
        expect(etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(date).toBeInstanceOf(Date);
        expect(date.getTime()).toBeGreaterThanOrEqual(avant);
        expect(operation.autresInfos.dateOperation).toBeNull();
    });

    test.each(['REPORTEE', 'PREVUE'])('création, %s : date d\'opération effacée (null) et état transmis, contexte inchangé', (action) => {
        const operation = buildOperation({ etat: OPERATION_ETATS_ENUM.REALISEE });
        operation.autresInfos.dateOperation = new Date('2026-05-02');

        agir(action, { creation: true, operation });

        expect(handleDate).toHaveBeenCalledWith(null, action);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(operation.autresInfos.dateOperation).toEqual(new Date('2026-05-02'));
    });

    test('édition, REALISEE : copie sauvegardée avec la date existante, original inchangé', () => {
        const operation = buildOperation();
        const date = new Date('2026-04-01T00:00:00.000Z');
        operation.autresInfos.dateOperation = date;

        agir('REALISEE', { operation });

        const copie = sauvegardee();
        expect(copie).not.toBe(operation);
        expect(copie.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(copie.autresInfos.dateOperation).toBe(date);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(saveOperation).toHaveBeenCalledWith(copie, expect.anything(), expect.any(Function));
    });

    test('édition, REALISEE sans date : la copie porte la date du jour, original inchangé', () => {
        const { operation } = agir('REALISEE');

        expect(sauvegardee().autresInfos.dateOperation).toBeInstanceOf(Date);
        expect(operation.autresInfos.dateOperation).toBeNull();
    });

    test('édition, PREVUE : date effacée sur la copie et sauvegarde, original inchangé', () => {
        const operation = buildOperation({ etat: OPERATION_ETATS_ENUM.REALISEE });
        operation.autresInfos.dateOperation = new Date('2026-04-01');

        agir('PREVUE', { operation });

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(sauvegardee().etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(sauvegardee().autresInfos.dateOperation).toBeNull();
        expect(operation.autresInfos.dateOperation).toEqual(new Date('2026-04-01'));
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
    });

    test.each(['REPORTEE', 'ANNULEE'])('édition, %s : copie à l\'état changé sauvegardée, date inchangée, original inchangé', (action) => {
        const operation = buildOperation();
        const date = new Date('2026-04-01T00:00:00.000Z');
        operation.autresInfos.dateOperation = date;

        agir(action, { operation });

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(sauvegardee().etat).toBe(action);
        expect(sauvegardee().autresInfos.dateOperation).toBe(date);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
    });

    test('édition, état identique à l\'état courant : aucune sauvegarde', () => {
        agir('PREVUE');

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('suppression confirmée : copie SUPPRIMEE sauvegardée et modale refermée', () => {
        const { operation } = agir('SUPPRIMEE');

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(sauvegardee().etat).toBe(OPERATION_ETATS_ENUM.SUPPRIMEE);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(setShowModale).toHaveBeenCalledWith(false);
    });

    test('édition : le callback passé à saveOperation notifie le budget puis commit la copie (au succès uniquement)', () => {
        const budgetMaj = buildBudget();
        agir('REALISEE');
        const callback = (saveOperation as Mock).mock.calls[0][2];

        // Avant l'appel du callback (= succès de la sauvegarde) : ni notification ni commit
        expect(onOperationChange).not.toHaveBeenCalled();
        expect(onOperationCommit).not.toHaveBeenCalled();

        callback(budgetMaj);

        expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
        expect(onOperationCommit).toHaveBeenCalledWith(sauvegardee());
        expect(onOperationChange.mock.invocationCallOrder[0]).toBeLessThan(onOperationCommit.mock.invocationCallOrder[0]);
    });

    test('édition : sans onOperationCommit, le succès notifie seulement le budget', () => {
        const operation = buildOperation();
        handleOperationAction({ target: { id: 'REALISEE' } }, operation, buildBudget(), false, cloneOperation(operation), handleDate, onOperationChange, setShowModale as any);

        const budgetMaj = buildBudget();
        expect(() => (saveOperation as Mock).mock.calls[0][2](budgetMaj)).not.toThrow();
        expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
    });

    test('budget clos : avertissement, état inchangé, aucune sauvegarde', () => {
        const { operation } = agir('REALISEE', { budget: buildBudget(false) });

        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(saveOperation).not.toHaveBeenCalled();
        expect(onOperationCommit).not.toHaveBeenCalled();
        expect(toast.warn).toHaveBeenCalledTimes(1);
    });
});
