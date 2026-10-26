import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailDate } from './OperationDetailDateOperation.component.tsx';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';

describe('OperationDetailDate', () => {

    const fill = vi.fn();

    /** Champ date : TextField type=date sans label ni rôle ARIA -> accès par id (contrat DOM du formulaire) */
    function champDate(): HTMLInputElement {
        // eslint-disable-next-line testing-library/no-node-access -- input type=date sans label ni rôle ARIA
        return document.getElementById('OPERATION_DATE_OPERATION_INPUT') as HTMLInputElement;
    }

    function operationAvecDate() {
        const operation = buildOperation();
        operation.autresInfos.dateOperation = new Date('2026-03-15T00:00:00.000Z');
        return operation;
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('budget absent : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />, { budget: undefined });

        expect(screen.queryByText('jj/mm/aaaa')).not.toBeInTheDocument();
    });

    test('opération absente : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />, { operation: null });

        expect(champDate()).toBeNull();
    });

    test('lecture sans date : "jj/mm/aaaa", éditable', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />);

        const texte = screen.getByText('jj/mm/aaaa');
        expect(texte).toHaveClass('editableField');
        expect(texte).toHaveAttribute('id', 'OPERATION_DATE_OPERATION');
    });

    test('lecture avec date : date au format français jj/mm/aaaa', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />, { operation: operationAvecDate() });

        expect(screen.getByText('15/03/2026')).toBeInTheDocument();
    });

    test('lecture sur budget clos : marquée désactivée', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />, { budget: buildBudget(false) });

        expect(screen.getByText('jj/mm/aaaa')).toHaveClass('editableField--disabled');
    });

    test('édition sans date : champ date vide', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />);

        expect(champDate()).toHaveValue('');
    });

    test('édition avec date : champ pré-rempli au format ISO', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />, { operation: operationAvecDate() });

        expect(champDate()).toHaveValue('2026-03-15');
    });

    test('édition : saisir une date appelle fillOperationForm(OPERATION_DATE_OPERATION, date ISO)', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />);

        fireEvent.change(champDate(), { target: { value: '2026-05-01' } });

        expect(fill).toHaveBeenCalledWith('OPERATION_DATE_OPERATION', '2026-05-01');
    });

    test('édition : effacer la date transmet null', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />, { operation: operationAvecDate() });

        fireEvent.change(champDate(), { target: { value: '' } });

        expect(fill).toHaveBeenCalledWith('OPERATION_DATE_OPERATION', null);
    });

    test('édition avec erreur : message affiché et champ invalide', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation="Date invalide" fillOperationForm={fill} />);

        expect(screen.getByText('Date invalide')).toBeInTheDocument();
        expect(champDate()).toBeInvalid();
    });
});
