import { screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { OperationDetailEtatSection } from './OperationDetailEtatSection.component.tsx';
import { buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { createEmptyEditForm, createEmptyErrors } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_ETATS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

/** Champ MUI sans label ni nom accessible (select) : accès par id, contrat DOM du formulaire */
function parId(id: string): HTMLElement | null {
    // eslint-disable-next-line testing-library/no-node-access -- select MUI sans nom accessible
    return document.getElementById(id);
}

describe('OperationDetailEtatSection', () => {

    function rendre(etat: OPERATION_ETATS_ENUM, creation = false) {
        return renderWithContexts(
            <OperationDetailEtatSection resetKey={0} etat={etat} editForm={createEmptyEditForm(creation)} errors={createEmptyErrors()}
                editOperation={cloneOperation(buildOperation())} fillOperationForm={vi.fn()} isMobile={false} />);
    }

    test.each([OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REALISEE, OPERATION_ETATS_ENUM.REPORTEE])(
        'affiche l\'état transmis (%s) et les libellés Etat / Date d\'opération', (etat) => {
            rendre(etat);

            expect(screen.getByText('Etat')).toBeInTheDocument();
            expect(screen.getByText('Date d\'opération')).toBeInTheDocument();
            expect(screen.getByText(etat)).toBeInTheDocument();
        });

    test('lecture : date d\'opération vide affichée en espace réservé, éditable', () => {
        rendre(OPERATION_ETATS_ENUM.PREVUE);

        expect(screen.getByText('jj/mm/aaaa')).toHaveAttribute('id', 'OPERATION_DATE_OPERATION');
    });

    test('création : champ date d\'opération ouvert', () => {
        rendre(OPERATION_ETATS_ENUM.PREVUE, true);

        expect(parId('OPERATION_DATE_OPERATION_INPUT')).not.toBeNull();
    });
});
