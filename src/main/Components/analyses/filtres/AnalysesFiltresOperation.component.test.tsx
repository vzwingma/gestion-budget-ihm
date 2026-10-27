import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { AnalysesFiltresOperation } from './AnalysesFiltresOperation.component.tsx';
import { OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';

function afficherFiltre(etats: OPERATION_ETATS_ENUM[], types: TYPES_OPERATION_ENUM[]) {
    const onChange = vi.fn();
    render(<AnalysesFiltresOperation selectedEtats={etats} selectedTypes={types} onChange={onChange} />);
    return onChange;
}

describe('AnalysesFiltresOperation', () => {

    test('cases cochées selon la sélection reçue', () => {
        afficherFiltre([OPERATION_ETATS_ENUM.PREVUE], [TYPES_OPERATION_ENUM.CREDIT]);

        expect(screen.getByRole('checkbox', { name: 'Prévue' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Réalisée' })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Crédit' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Dépense' })).not.toBeChecked();
    });

    test('cocher un état non sélectionné : ajouté, types inchangés', async () => {
        const onChange = afficherFiltre([OPERATION_ETATS_ENUM.PREVUE], [TYPES_OPERATION_ENUM.DEPENSE]);

        await userEvent.click(screen.getByRole('checkbox', { name: 'Réalisée' }));

        expect(onChange).toHaveBeenCalledWith([OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REALISEE], [TYPES_OPERATION_ENUM.DEPENSE]);
    });

    test('décocher un état sélectionné : retiré', async () => {
        const onChange = afficherFiltre([OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REALISEE], [TYPES_OPERATION_ENUM.DEPENSE]);

        await userEvent.click(screen.getByRole('checkbox', { name: 'Prévue' }));

        expect(onChange).toHaveBeenCalledWith([OPERATION_ETATS_ENUM.REALISEE], [TYPES_OPERATION_ENUM.DEPENSE]);
    });

    test('cocher un type : ajouté, états inchangés', async () => {
        const onChange = afficherFiltre([OPERATION_ETATS_ENUM.PREVUE], [TYPES_OPERATION_ENUM.DEPENSE]);

        await userEvent.click(screen.getByRole('checkbox', { name: 'Crédit' }));

        expect(onChange).toHaveBeenCalledWith([OPERATION_ETATS_ENUM.PREVUE], [TYPES_OPERATION_ENUM.DEPENSE, TYPES_OPERATION_ENUM.CREDIT]);
    });

    test('décocher le dernier type : sélection vide transmise', async () => {
        const onChange = afficherFiltre([], [TYPES_OPERATION_ENUM.DEPENSE]);

        await userEvent.click(screen.getByRole('checkbox', { name: 'Dépense' }));

        expect(onChange).toHaveBeenCalledWith([], []);
    });
});
