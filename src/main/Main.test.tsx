import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import Main from './Main.tsx';
import { useAuth } from 'react-oidc-context';
import { BUSINESS_ONGLETS } from './Utils/AppBusinessEnums.constants.ts';

/**
 * Routage de `Main` (React.lazy + Suspense + RouteLoadingFallback).
 * Mockés : fournisseur OIDC (passe-plat), état OIDC, barre de navigation / profil / synchro de token,
 * et les pages de routes (chargement différé piloté par le test pour observer le fallback).
 * La garde et les helpers de session restent réels.
 */

vi.mock('react-oidc-context', () => ({
    useAuth: vi.fn(),
    AuthProvider: ({ children }: any) => <>{children}</>
}));
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
        localStorage.clear();
        sessionStorage.clear();
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: {id_token: `e30.${btoa('{"exp":4102444800}').replace(/=+$/, '')}.c2ln`}
        } as ReturnType<typeof useAuth>);
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
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false, isLoading: false, user: null
        } as ReturnType<typeof useAuth>);
        globalThis.location.hash = hash;
        pagesLoaded.release();
        render(<Main />);

        expect(await screen.findByTestId('page-infos')).toBeInTheDocument();
        expect(screen.queryByTestId('page-main')).not.toBeInTheDocument();
    });

    test.each(['#/budgets', '#/recurrents', '#/analyses'])('sans session, accès direct %s retourne à l’accueil public', async hash => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false, isLoading: false, user: null
        } as ReturnType<typeof useAuth>);
        globalThis.location.hash = hash;
        pagesLoaded.release();
        render(<Main />);

        expect(await screen.findByTestId('page-infos')).toBeInTheDocument();
        expect(screen.queryByTestId('page-main')).not.toBeInTheDocument();
        expect(globalThis.location.hash).toBe('#/');
    });
});
