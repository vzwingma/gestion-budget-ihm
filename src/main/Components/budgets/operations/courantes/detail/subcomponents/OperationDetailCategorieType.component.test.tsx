import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailCategorieType } from './OperationDetailCategorieType.component.tsx';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

describe('OperationDetailCategorieType', () => {

    const fill = vi.fn();

    /** Opération du contexte = Essentiel ; opération en édition = Plaisir (le mode édition lit l'opération en édition) */
    function editionPlaisir() {
        const edit = cloneOperation(buildOperation());
        edit.ssCategorie.type = TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR;
        return edit;
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('budget absent : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={false} editOperation={editionPlaisir()} fillOperationForm={fill} />, { budget: undefined });

        expect(screen.queryByText('Essentiel')).not.toBeInTheDocument();
    });

    test('opération absente : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={false} editOperation={editionPlaisir()} fillOperationForm={fill} />, { operation: null });

        expect(screen.queryByText('Essentiel')).not.toBeInTheDocument();
    });

    test('lecture : affiche le type de l\'opération du contexte (et non celui de l\'édition), éditable', () => {
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={false} editOperation={editionPlaisir()} fillOperationForm={fill} />);

        const libelle = screen.getByText('Essentiel');
        expect(libelle).toHaveClass('editableField');
        expect(libelle).toHaveAttribute('id', 'OPERATION_TYPE_CATEGORIE');
        expect(screen.queryByText('Plaisir')).not.toBeInTheDocument();
    });

    test('lecture sur budget clos : marqué désactivé', () => {
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={false} editOperation={editionPlaisir()} fillOperationForm={fill} />, { budget: buildBudget(false) });

        expect(screen.getByText('Essentiel')).toHaveClass('editableField--disabled');
    });

    test('édition : le sélecteur affiche le type de l\'opération en cours d\'édition', () => {
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={true} editOperation={editionPlaisir()} fillOperationForm={fill} />);

        expect(screen.getByRole('combobox')).toHaveTextContent('Plaisir');
    });

    test('édition : choisir un type appelle fillOperationForm(OPERATION_TYPE_CATEGORIE, valeur de l\'enum)', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={true} editOperation={editionPlaisir()} fillOperationForm={fill} />);

        await user.click(screen.getByRole('combobox'));
        await user.click(await screen.findByRole('option', { name: 'Extras' }));

        expect(fill).toHaveBeenCalledWith('OPERATION_TYPE_CATEGORIE', TYPES_CATEGORIES_OPERATION_ENUM.EXTRAS);
    });

    test('édition : tous les types de catégorie sont proposés', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={true} editOperation={editionPlaisir()} fillOperationForm={fill} />);

        await user.click(screen.getByRole('combobox'));

        expect(await screen.findAllByRole('option')).toHaveLength(Object.values(TYPES_CATEGORIES_OPERATION_ENUM).length);
    });

    test('édition : le focus désactive la validation clavier, la perte de focus la réactive', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailCategorieType formCategorieTypeInEdition={true} editOperation={editionPlaisir()} fillOperationForm={fill} />);

        await user.click(screen.getByRole('combobox'));
        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'false');
        await user.keyboard('{Escape}');
        await user.tab();

        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'true');
    });
});
