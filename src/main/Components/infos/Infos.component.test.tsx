import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Infos } from './Infos.component.tsx';
import { fetchInfosFromMicroServices } from './Infos.extservices.ts';

/**
 * Page Infos (AP 006 - T11/T20) : chargement des versions des µS via useFetch.
 * Service réseau mocké ; les versions ne sont affichées qu'après clic sur le logo.
 */

vi.mock('./Infos.extservices.ts', () => ({
    fetchInfosFromMicroServices: vi.fn()
}));

describe('Infos', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('charge les infos des µS au montage, sans les afficher tant que le logo n est pas cliqué', async () => {
        (fetchInfosFromMicroServices as any).mockResolvedValue([{ nom: 'API Comptes', version: '1.2.3' }]);
        render(<Infos />);

        expect(await screen.findByRole('button', { name: 'Gestion de budgets' })).toBeInTheDocument();
        expect(fetchInfosFromMicroServices).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('API Comptes')).not.toBeInTheDocument();
    });

    test('clic sur le logo : affiche IHM et les versions des µS chargées', async () => {
        const user = userEvent.setup();
        (fetchInfosFromMicroServices as any).mockResolvedValue([
            { nom: 'API Comptes', version: '1.2.3' },
            { nom: 'API Opérations', version: 'N/A' }
        ]);
        render(<Infos />);

        await user.click(screen.getByRole('button', { name: 'Gestion de budgets' }));

        expect(await screen.findByText('API Comptes')).toBeInTheDocument();
        expect(screen.getByText('1.2.3')).toBeInTheDocument();
        expect(screen.getByText('API Opérations')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument();
        expect(screen.getByText('IHM')).toBeInTheDocument();
    });

    test('second clic : masque à nouveau les versions', async () => {
        const user = userEvent.setup();
        (fetchInfosFromMicroServices as any).mockResolvedValue([{ nom: 'API Comptes', version: '1.2.3' }]);
        render(<Infos />);

        await user.click(screen.getByRole('button', { name: 'Gestion de budgets' }));
        expect(await screen.findByText('API Comptes')).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Gestion de budgets' }));

        expect(screen.queryByText('API Comptes')).not.toBeInTheDocument();
    });

    test('chargement en échec : la page reste affichée, seule la ligne IHM est listée', async () => {
        const user = userEvent.setup();
        (fetchInfosFromMicroServices as any).mockRejectedValue(new Error('down'));
        render(<Infos />);

        await user.click(screen.getByRole('button', { name: 'Gestion de budgets' }));

        expect(screen.getByText('IHM')).toBeInTheDocument();
        expect(screen.queryByText('API Comptes')).not.toBeInTheDocument();
    });
});
