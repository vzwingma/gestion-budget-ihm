import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import Main from './Main.tsx';
import { removeTokenFromStorage } from './Services/Auth.service.ts';
import { BUSINESS_ONGLETS } from './Utils/AppBusinessEnums.constants.ts';

/**
 * Routage de `Main` (React.lazy + Suspense + RouteLoadingFallback).
 * Mockés : fournisseur OIDC (passe-plat), barre de navigation / profil / synchro de token, services d'auth,
 * et les pages de routes (chargement différé piloté par le test pour observer le fallback).
 */

vi.mock('react-oidc-context', () => ({
    AuthProvider: ({ children }: any) => <>{children}</>
}));
vi.mock('./Services/Auth.service.ts', () => ({ removeTokenFromStorage: vi.fn() }));
vi.mock('./Components/shared/AuthTokenSync.component.tsx', () => ({ default: () => null }));
vi.mock('./Components/menuTopBar/PrivateNavLinks.component.tsx', () => ({ default: () => <nav data-testid="nav" /> }));
vi.mock('./Components/menuTopBar/Profile.component.tsx', () => ({ default: () => <div data-testid="profile" /> }));

/** Résolution contrôlée des imports différés des pages */
const pagesLoaded = vi.hoisted(() => {
    let release!: () => void;
    const promise = new Promise<void>((resolve) => { release = resolve; });
    return { promise, release };
});
vi.mock('./Components/infos/Infos.component.tsx', async () => {
    await pagesLoaded.promise;
    return { Infos: () => <div data-testid="page-infos" /> };
});
vi.mock('./Components/mainpages/MainPage.component.tsx', async () => {
    await pagesLoaded.promise;
    return { default: ({ fonction }: any) => <div data-testid="page-main">{String(fonction)}</div> };
});

describe('Main - routage et chargement différé', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        globalThis.location.hash = '';
    });

    test('pendant le chargement différé de la page : fallback (indicateur de chargement), pas de page', async () => {
        globalThis.location.hash = '#/budgets';
        render(<Main />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByTestId('page-main')).not.toBeInTheDocument();
        // La barre de navigation (hors Suspense) reste affichée
        expect(screen.getByTestId('nav')).toBeInTheDocument();
        expect(screen.getByTestId('profile')).toBeInTheDocument();
        expect(removeTokenFromStorage).toHaveBeenCalled();

        pagesLoaded.release();
        expect(await screen.findByTestId('page-main')).toHaveTextContent(String(BUSINESS_ONGLETS.BUDGET));
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test.each([
        ['#/recurrents', BUSINESS_ONGLETS.RECURRENTS],
        ['#/analyses', BUSINESS_ONGLETS.ANALYSES]
    ])('route %s : MainPage avec l\'onglet correspondant', async (hash, onglet) => {
        globalThis.location.hash = hash;
        pagesLoaded.release();
        render(<Main />);

        expect(await screen.findByTestId('page-main')).toHaveTextContent(String(onglet));
    });

    test.each(['#/', '#/infos'])('route %s : page Infos', async (hash) => {
        globalThis.location.hash = hash;
        pagesLoaded.release();
        render(<Main />);

        expect(await screen.findByTestId('page-infos')).toBeInTheDocument();
        expect(screen.queryByTestId('page-main')).not.toBeInTheDocument();
    });
});
