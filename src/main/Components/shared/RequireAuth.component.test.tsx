import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {useAuth} from 'react-oidc-context';
import {Link, MemoryRouter, Route, Routes, useNavigate} from 'react-router-dom';
import RequireAuth from './RequireAuth.component.tsx';
import {putTokenInStorage} from '../../Services/Auth.service.ts';
import {estDeconnexionEnCours, verifierSessionExpiree} from '../../Services/ClientHTTP.service.ts';

vi.mock('react-oidc-context', () => ({useAuth: vi.fn()}));
// Conserver la vraie lecture JWT et les décisions de rendu ; seul le déclenchement de
// déconnexion (testé avec services réels dans le hook) est isolé pour éviter toute navigation.
vi.mock('../../Services/ClientHTTP.service.ts', () => ({
    estDeconnexionEnCours: vi.fn().mockReturnValue(false),
    verifierSessionExpiree: vi.fn()
}));

describe('RequireAuth — accès aux pages privées', () => {
    const maintenant = Date.UTC(2026, 10, 24, 12);
    const jwt = (exp: number) => `e30.${btoa(JSON.stringify({exp})).replace(/=+$/, '')}.c2ln`;
    let auth: ReturnType<typeof useAuth>;
    const monterPageMetier = vi.fn();

    function PageMetier() {
        React.useEffect(() => { monterPageMetier(); }, []);
        return <div>Page privée</div>;
    }

    function Accueil() {
        const navigate = useNavigate();
        return <><div>Accueil public</div><Link to="/budgets">Budget</Link>
            <button onClick={() => navigate(-1)}>Précédent</button></>;
    }

    function routes(entries = ['/budgets']) {
        return <MemoryRouter initialEntries={entries}>
            <Routes>
                <Route path="/" element={<Accueil />} />
                <Route element={<RequireAuth />}>
                    {['/budgets', '/recurrents', '/analyses'].map(path =>
                        <Route key={path} path={path} element={<PageMetier />} />)}
                </Route>
            </Routes>
        </MemoryRouter>;
    }

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(estDeconnexionEnCours).mockReturnValue(false);
        localStorage.clear();
        vi.spyOn(Date, 'now').mockReturnValue(maintenant);
        auth = {
            isAuthenticated: true,
            isLoading: false,
            activeNavigator: undefined,
            user: {id_token: jwt(maintenant / 1000 + 60)}
        } as ReturnType<typeof useAuth>;
        vi.mocked(useAuth).mockImplementation(() => auth);
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    test.each(['chargement', 'callback'])('restauration %s : indicateur sans montage métier ni déconnexion', mode => {
        auth = {...auth, isLoading: mode === 'chargement',
            activeNavigator: mode === 'callback' ? 'signinRedirect' : undefined,
            user: {id_token: jwt(0)}} as ReturnType<typeof useAuth>;

        render(routes());

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText('Page privée')).not.toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
        expect(verifierSessionExpiree).not.toHaveBeenCalled();
    });

    test.each(['/budgets', '/recurrents', '/analyses'])('sans session : accès direct %s redirigé sans montage métier', async path => {
        auth = {...auth, isAuthenticated: false, user: null};

        render(routes([path]));

        expect(await screen.findByText('Accueil public')).toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
        expect(verifierSessionExpiree).not.toHaveBeenCalled();
    });

    test('jeton périmé : aucun enfant monté, déconnexion demandée avec le vrai jeton', () => {
        const token = jwt(maintenant / 1000);
        auth = {...auth, user: {id_token: token}} as ReturnType<typeof useAuth>;
        putTokenInStorage(token);

        render(routes());

        expect(screen.queryByText('Page privée')).not.toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
        expect(verifierSessionExpiree).toHaveBeenCalledWith(token);
    });

    test('session valide : monte la page privée', () => {
        render(routes());

        expect(screen.getByText('Page privée')).toBeInTheDocument();
        expect(monterPageMetier).toHaveBeenCalledTimes(1);
        expect(verifierSessionExpiree).not.toHaveBeenCalled();
    });

    test('authentifié sans id_token : redirige sans monter de page privée', async () => {
        auth = {...auth, user: {}} as ReturnType<typeof useAuth>;
        render(routes());

        expect(await screen.findByText('Accueil public')).toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
    });

    test('déconnexion engagée : ne monte rien même avec un jeton encore valide', () => {
        vi.mocked(estDeconnexionEnCours).mockReturnValue(true);
        render(routes());

        expect(screen.queryByText('Page privée')).not.toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
    });

    test('fin de restauration valide : autorise la page seulement après le chargement', () => {
        auth = {...auth, isLoading: true};
        const {rerender} = render(routes());
        expect(monterPageMetier).not.toHaveBeenCalled();

        auth = {...auth, isLoading: false};
        rerender(routes());

        expect(screen.getByText('Page privée')).toBeInTheDocument();
        expect(monterPageMetier).toHaveBeenCalledTimes(1);
    });

    test('navigation depuis l’accueil sans session : aucun effet métier', async () => {
        auth = {...auth, isAuthenticated: false, user: null};
        render(routes(['/']));

        fireEvent.click(screen.getByRole('link', {name: 'Budget'}));

        // Attendre que la garde ait réellement été visitée : l'accueil était déjà présent
        // avant le clic et ne prouverait pas, seul, que la navigation a été traitée.
        await waitFor(() => expect(useAuth).toHaveBeenCalled());
        expect(await screen.findByText('Accueil public')).toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
    });

    test('historique vers une route privée sans session : reste à l’accueil sans effet métier', async () => {
        auth = {...auth, isAuthenticated: false, user: null};
        render(routes(['/budgets', '/']));

        fireEvent.click(screen.getByRole('button', {name: 'Précédent'}));

        await waitFor(() => expect(useAuth).toHaveBeenCalled());
        expect(await screen.findByText('Accueil public')).toBeInTheDocument();
        expect(monterPageMetier).not.toHaveBeenCalled();
    });
});
