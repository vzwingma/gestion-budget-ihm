import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import ProfileInfos from './ProfileInfos.component.tsx';
import { fetchLastAccessDateUtilisateur } from './ProfileInfos.extservices.ts';

/**
 * ProfileInfos (AP 006 - T11/T20) : dernière connexion chargée via useFetch.
 * Service réseau mocké.
 */

vi.mock('./ProfileInfos.extservices.ts', () => ({
    fetchLastAccessDateUtilisateur: vi.fn()
}));

describe('ProfileInfos', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche "-" tant que la date n est pas chargée', () => {
        (fetchLastAccessDateUtilisateur as any).mockReturnValue(new Promise(() => {}));
        render(<ProfileInfos />);

        expect(screen.getByText('Dernière connexion :')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    test('affiche la date de dernière connexion une fois chargée', async () => {
        (fetchLastAccessDateUtilisateur as any).mockResolvedValue('25/10/2026 - 10:00:00');
        render(<ProfileInfos />);

        expect(await screen.findByText('25/10/2026 - 10:00:00')).toBeInTheDocument();
        expect(screen.queryByText('-')).not.toBeInTheDocument();
        expect(fetchLastAccessDateUtilisateur).toHaveBeenCalledTimes(1);
    });

    test('garde "-" si le chargement échoue', async () => {
        (fetchLastAccessDateUtilisateur as any).mockRejectedValue(new Error('500'));
        render(<ProfileInfos />);

        await vi.waitFor(() => expect(fetchLastAccessDateUtilisateur).toHaveBeenCalled());
        expect(screen.getByText('-')).toBeInTheDocument();
    });
});
