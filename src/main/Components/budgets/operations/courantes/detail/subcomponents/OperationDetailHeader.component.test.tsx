import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailHeader } from './OperationDetailHeader.component.tsx';
import { buildOperation } from '../OperationDetailPage.testutils.tsx';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_STATUS_ENUM, TYPES_CATEGORIES_OPERATION_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

describe('OperationDetailHeader', () => {

    beforeEach(() => {
        // catégories de test sans couleur / icône définies : avertissement volontaire des renderers
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    test('affiche la pastille de la catégorie de la copie de travail', () => {
        const edition = cloneOperation(buildOperation());
        Object.assign(edition.ssCategorie, { id: 'ss-inconnue', libelle: 'Sans icône', type: TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL });

        render(<OperationDetailHeader editOperation={edition} statuts={undefined} />);

        // icône de repli pour une sous-catégorie sans icône dédiée
        expect(screen.getByTestId('QuestionMarkRoundedIcon')).toBeInTheDocument();
    });

    test('statuts absents (undefined ou null) : aucun statut affiché', () => {
        const edition = cloneOperation(buildOperation());

        const { rerender } = render(<OperationDetailHeader editOperation={edition} statuts={undefined} />);
        expect(screen.queryByText('EN RETARD')).not.toBeInTheDocument();
        rerender(<OperationDetailHeader editOperation={edition} statuts={null} />);

        expect(screen.queryByText('EN RETARD')).not.toBeInTheDocument();
    });

    test('statut EN_RETARD : badge affiché', () => {
        render(<OperationDetailHeader editOperation={cloneOperation(buildOperation())} statuts={[OPERATION_STATUS_ENUM.EN_RETARD]} />);

        expect(screen.getByText('EN RETARD')).toBeInTheDocument();
    });
});
