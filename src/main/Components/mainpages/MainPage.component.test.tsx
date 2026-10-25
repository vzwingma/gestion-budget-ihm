import {beforeEach, describe, expect, test, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MainPage} from './MainPage.component.tsx';
import {BUSINESS_ONGLETS} from '../../Utils/AppBusinessEnums.constants.ts';

const {setSelectedCompte} = vi.hoisted(() => ({setSelectedCompte: vi.fn()}));
const compteSel = {id: 'c1', libelle: 'C1'};
const ctx = {
    comptes: [], setListeComptes: vi.fn(), selectedCompte: compteSel, setSelectedCompte,
    selectedDate: new Date('2026-01-10'), setSelectedDate: vi.fn()
};

vi.mock('../../Models/contextProvider/BudgetContextProvider.tsx', () => ({
    useBudgetContext: () => ctx
}));
vi.mock('react-oidc-context', () => ({useAuth: () => ({user: {profile: {email: 'a@b.c'}}})}));
vi.mock('./MainPage.extservices.ts', () => ({loadComptes: vi.fn()}));
vi.mock('../../Utils/UserData.utils.ts', () => ({getCompteGroupByOwner: () => ({})}));
vi.mock('./menuSlideBar/DateRange.component.tsx', () => ({default: () => <div/>}));
vi.mock('./menuSlideBar/CompteItem.component.tsx', () => ({default: () => <div/>}));
vi.mock('../budgets/recurrents/Recurrents.component.tsx', () => ({RecurrentsPage: () => <div/>}));
vi.mock('../analyses/Analyses.component.tsx', () => ({Analyses: () => <div/>}));
// Page budget mockée : expose un bouton qui déclenche onOpenMenu (équivalent du burger)
vi.mock('../budgets/budget/Budget.component.tsx', () => ({
    default: ({onOpenMenu}: { onOpenMenu: () => void }) => <button onClick={onOpenMenu}>burger</button>
}));

const closeBtnQuery = () => screen.queryByRole('button', {name: 'Fermer le menu'});

describe('MainPage menu', () => {
    beforeEach(() => vi.clearAllMocks());

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
});
