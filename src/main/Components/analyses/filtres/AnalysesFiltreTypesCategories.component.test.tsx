import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { AnalysesFiltreTypesCategories } from './AnalysesFiltreTypesCategories.component.tsx';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';

const TOUS_LES_TYPES = Object.values(TYPES_CATEGORIES_OPERATION_ENUM);

function afficherFiltre(selectedTypes: TYPES_CATEGORIES_OPERATION_ENUM[]) {
    const onChange = vi.fn();
    render(<AnalysesFiltreTypesCategories selectedTypes={selectedTypes} onChange={onChange} />);
    return onChange;
}

describe('AnalysesFiltreTypesCategories', () => {

    test('affiche "Tous" et un élément par type de catégorie', () => {
        afficherFiltre([]);

        expect(screen.getByText('Tous')).toBeInTheDocument();
        for (const libelle of ['Revenus', 'Essentiel', 'Plaisir', 'Economies', 'Imprévus', 'Extras']) {
            expect(screen.getByText(libelle)).toBeInTheDocument();
        }
    });

    test('cliquer un type non sélectionné : ajouté à la sélection', async () => {
        const onChange = afficherFiltre([TYPES_CATEGORIES_OPERATION_ENUM.REVENUS]);

        await userEvent.click(screen.getByText('Plaisir'));

        expect(onChange).toHaveBeenCalledWith([TYPES_CATEGORIES_OPERATION_ENUM.REVENUS, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR]);
    });

    test('cliquer un type sélectionné : retiré de la sélection', async () => {
        const onChange = afficherFiltre([TYPES_CATEGORIES_OPERATION_ENUM.REVENUS, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR]);

        await userEvent.click(screen.getByText('Revenus'));

        expect(onChange).toHaveBeenCalledWith([TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR]);
    });

    test('"Tous" avec une sélection partielle : sélectionne tous les types', async () => {
        const onChange = afficherFiltre([TYPES_CATEGORIES_OPERATION_ENUM.REVENUS]);

        await userEvent.click(screen.getByText('Tous'));

        expect(onChange).toHaveBeenCalledWith(TOUS_LES_TYPES);
    });

    test('"Tous" avec sélection vide : sélectionne tous les types', async () => {
        const onChange = afficherFiltre([]);

        await userEvent.click(screen.getByText('Tous'));

        expect(onChange).toHaveBeenCalledWith(TOUS_LES_TYPES);
    });

    test('"Tous" quand tous les types sont déjà sélectionnés : désélectionne tout', async () => {
        const onChange = afficherFiltre(TOUS_LES_TYPES);

        await userEvent.click(screen.getByText('Tous'));

        expect(onChange).toHaveBeenCalledWith([]);
    });
});
