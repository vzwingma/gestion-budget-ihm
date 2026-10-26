import { screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { OperationDetailMensualiteSection } from './OperationDetailMensualiteSection.component.tsx';
import { buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { createEmptyEditForm, createEmptyErrors } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { BUSINESS_GUID, PERIODES_MENSUALITE_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

/** Champ MUI sans label ni nom accessible (select) : accès par id, contrat DOM du formulaire */
function parId(id: string): HTMLElement | null {
    // eslint-disable-next-line testing-library/no-node-access -- select MUI sans nom accessible
    return document.getElementById(id);
}

describe('OperationDetailMensualiteSection', () => {

    function rendre(modifier: (edition: ReturnType<typeof cloneOperation>) => void = () => undefined, creation = false) {
        const edition = cloneOperation(buildOperation());
        modifier(edition);
        return renderWithContexts(
            <OperationDetailMensualiteSection resetKey={0} editForm={createEmptyEditForm(creation)} errors={createEmptyErrors()}
                editOperation={edition} fillOperationForm={vi.fn()} isMobile={false} />);
    }

    test('catégorie Actifs / Investissements : section masquée (période forcée à Mensuelle)', () => {
        rendre((edition) => { edition.categorie.id = BUSINESS_GUID.CAT_ACTIFS_INVEST; });

        expect(screen.queryByText('Période')).not.toBeInTheDocument();
        expect(screen.queryByText('Date de fin')).not.toBeInTheDocument();
    });

    test('période ponctuelle : "Période" affichée, pas de date de fin', () => {
        rendre();

        expect(screen.getByText('Période')).toBeInTheDocument();
        expect(screen.getByText('Ponctuelle')).toBeInTheDocument();
        expect(screen.queryByText('Date de fin')).not.toBeInTheDocument();
    });

    test('période récurrente de la copie de travail : libellé et champ "Date de fin" affichés', () => {
        rendre((edition) => { edition.mensualite = { periode: PERIODES_MENSUALITE_ENUM.TRIMESTRIELLE, dateFin: null }; });

        expect(screen.getByText('Date de fin')).toBeInTheDocument();
        expect(screen.getByText('Jamais')).toBeInTheDocument();
    });

    test('création : le sélecteur de période est ouvert', () => {
        rendre(() => undefined, true);

        expect(parId('OPERATION_MENSUALITE_INPUT')).not.toBeNull();
    });
});
