import {beforeEach, describe, expect, test, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MainPage} from './MainPage.component.tsx';
import {BUSINESS_ONGLETS} from '../../Utils/AppBusinessEnums.constants.ts';
import {fetchComptes} from './MainPage.extservices.ts';

const {setSelectedCompte, state} = vi.hoisted(() => ({setSelectedCompte: vi.fn(), state: {comptes: [] as {id: string, libelle: string}[]}}));
const compteSel = {id: 'c1', libelle: 'C1'};
const ctx = {
    get comptes() { return state.comptes; }, setListeComptes: vi.fn(), selectedCompte: compteSel, setSelectedCompte,
    selectedDate: new Date('2026-01-10'), setSelectedDate: vi.fn()
};

// MainPage lit uniquement la moitié "sélection" du contexte (AP 006 T6)
vi.mock('../../hooks/useBudgetContext.ts', () => ({
    useBudgetSelection: () => ctx
}));
vi.mock('react-oidc-context', () => ({useAuth: () => ({user: {profile: {email: 'a@b.c'}}})}));
vi.mock('./MainPage.extservices.ts', () => ({fetchComptes: vi.fn()}));
// Regroupement par propriétaire : un seul groupe "a" contenant tous les comptes du contexte (ou aucun)
vi.mock('../../Utils/UserData.utils.ts', () => ({
    getCompteGroupByOwner: (comptes: unknown[]) => comptes.length > 0 ? {a: comptes} : {}
}));
vi.mock('./menuSlideBar/DateRange.component.tsx', () => ({
    default: ({onDateChange}: { onDateChange: (d: Date) => void }) =>
        <button onClick={() => onDateChange(new Date(2026, 4, 1))}>changer-date</button>
}));
vi.mock('./menuSlideBar/CompteItem.component.tsx', () => ({
    default: ({compte, onClick}: { compte: { id: string, libelle: string }, onClick: (c: unknown) => void }) =>
        <button onClick={() => onClick(compte)}>{'compte-' + compte.libelle}</button>
}));
vi.mock('../budgets/recurrents/Recurrents.component.tsx', () => ({RecurrentsPage: () => <div>page-recurrents</div>}));
vi.mock('../analyses/Analyses.component.tsx', () => ({Analyses: () => <div>page-analyses</div>}));
// Page budget mockée : expose un bouton qui déclenche onOpenMenu (équivalent du burger)
vi.mock('../budgets/budget/Budget.component.tsx', () => ({
    default: ({onOpenMenu}: { onOpenMenu: () => void }) => <button onClick={onOpenMenu}>burger</button>
}));

const closeBtnQuery = () => screen.queryByRole('button', {name: 'Fermer le menu'});

describe('MainPage menu', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // useFetch consomme une Promise : liste de comptes vide par défaut
        (fetchComptes as any).mockResolvedValue([]);
        state.comptes = [];
        ctx.selectedCompte = compteSel;
    });

    test('fermeture par le bouton "Fermer le menu"', async () => {
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);
        const closeBtn = screen.getByRole('button', {name: 'Fermer le menu'});
        await userEvent.click(closeBtn);
        await waitFor(() => expect(closeBtnQuery()).toBeNull());
    });

    test('fermeture par Échap', async () => {
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);
        const closeBtn = screen.getByRole('button', {name: 'Fermer le menu'});
        fireEvent.keyDown(closeBtn, {key: 'Escape', code: 'Escape'});
        await waitFor(() => expect(closeBtnQuery()).toBeNull());
    });

    test('ouverture par le burger ne remet pas selectedCompte à null', async () => {
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);
        await userEvent.click(screen.getByRole('button', {name: 'Fermer le menu'}));
        await waitFor(() => expect(closeBtnQuery()).toBeNull());
        await userEvent.click(screen.getByText('burger'));
        expect(await screen.findByRole('button', {name: 'Fermer le menu'})).toBeInTheDocument();
        expect(setSelectedCompte).not.toHaveBeenCalled();
    });

    test('charge les comptes via useFetch et les injecte dans le contexte', async () => {
        const comptes = [{id: 'c1', libelle: 'C1'}];
        (fetchComptes as any).mockResolvedValue(comptes);
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);

        await waitFor(() => expect(ctx.setListeComptes).toHaveBeenCalledWith(comptes));
        expect(fetchComptes).toHaveBeenCalledTimes(1);
    });

    test('échec du chargement des comptes : liste non modifiée', async () => {
        (fetchComptes as any).mockRejectedValue(new Error('500'));
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);

        await waitFor(() => expect(fetchComptes).toHaveBeenCalled());
        expect(ctx.setListeComptes).not.toHaveBeenCalled();
    });

    test('clic sur un compte : sélection du compte puis fermeture du menu', async () => {
        state.comptes = [{id: 'c2', libelle: 'C2'}];
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);

        await userEvent.click(screen.getByText('compte-C2'));

        expect(setSelectedCompte).toHaveBeenCalledWith({id: 'c2', libelle: 'C2'});
        await waitFor(() => expect(closeBtnQuery()).toBeNull());
    });

    test('changement de date dans le menu (BUDGET) : setSelectedDate appelé', async () => {
        render(<MainPage fonction={BUSINESS_ONGLETS.BUDGET}/>);

        await userEvent.click(screen.getByText('changer-date'));

        expect(ctx.setSelectedDate).toHaveBeenCalledWith(new Date(2026, 4, 1));
    });

    test('onglet ANALYSES : pas de sélecteur de date, page Analyses affichée', () => {
        render(<MainPage fonction={BUSINESS_ONGLETS.ANALYSES}/>);

        expect(screen.queryByText('changer-date')).not.toBeInTheDocument();
        expect(screen.getByText('page-analyses')).toBeInTheDocument();
    });

    test('onglet RECURRENTS : sélecteur de date et page Récurrents affichés', () => {
        render(<MainPage fonction={BUSINESS_ONGLETS.RECURRENTS}/>);

        expect(screen.getByText('changer-date')).toBeInTheDocument();
        expect(screen.getByText('page-recurrents')).toBeInTheDocument();
    });

    test('sans compte sélectionné : aucune page affichée', () => {
        ctx.selectedCompte = null as never;
        render(<MainPage fonction={BUSINESS_ONGLETS.RECURRENTS}/>);

        expect(screen.queryByText('page-recurrents')).not.toBeInTheDocument();
    });
});
