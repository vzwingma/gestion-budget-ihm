import { screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { OperationDetailCategoriesSection } from './OperationDetailCategoriesSection.component.tsx';
import { buildCategories, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { createEmptyEditForm, createEmptyErrors } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { BUSINESS_GUID } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

/** Champ MUI sans label ni nom accessible (select) : accès par id, contrat DOM du formulaire */
function parId(id: string): HTMLElement | null {
    // eslint-disable-next-line testing-library/no-node-access -- select MUI sans nom accessible
    return document.getElementById(id);
}

describe('OperationDetailCategoriesSection', () => {

    function rendre(creation: boolean, virement = false) {
        const edition = cloneOperation(buildOperation());
        if (virement) {
            Object.assign(edition.ssCategorie, { id: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE, libelle: 'Virement interne', type: undefined });
            edition.libelle = 'Virement vers Livret A';
        }
        return renderWithContexts(
            <OperationDetailCategoriesSection listeCategories={buildCategories()} editForm={createEmptyEditForm(creation)}
                errors={createEmptyErrors()} editOperation={edition} fillOperationForm={vi.fn()} isMobile={false} />);
    }

    test('lecture : libellés Catégorie / Type Catégorie, catégorie et type affichés, pas de compte de transfert', () => {
        rendre(false);

        expect(screen.getByText('Catégorie')).toBeInTheDocument();
        expect(screen.getByText('Type Catégorie')).toBeInTheDocument();
        expect(screen.getByText('Alimentation / Courses')).toBeInTheDocument();
        expect(screen.getByText('Essentiel')).toBeInTheDocument();
        expect(screen.queryByText('Compte de transfert')).not.toBeInTheDocument();
    });

    test('virement interne hors création : compte de transfert affiché en lecture seule (pas de sélecteur)', () => {
        rendre(false, true);

        expect(screen.getByText('Compte de transfert')).toBeInTheDocument();
        expect(parId('OPERATION_INTERCOMPTES_INPUT')).toBeNull();
    });

    test('virement interne en création : sélecteur du compte de transfert affiché', () => {
        rendre(true, true);

        expect(screen.getByText('Compte de transfert')).toBeInTheDocument();
        expect(parId('OPERATION_INTERCOMPTES_INPUT')).not.toBeNull();
    });
});
