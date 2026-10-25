import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CompteItem from './CompteItem.component.tsx';
import { fetchSoldesBudget } from './CompteItem.controller.ts';
import { BUSINESS_ONGLETS } from '../../../Utils/AppBusinessEnums.constants.ts';

// Contrôleur mocké : évite tout appel réseau, le solde est la valeur résolue de la promesse (useFetch)
vi.mock('./CompteItem.controller.ts', () => ({ fetchSoldesBudget: vi.fn() }));

const compte: any = { id: 'c1', libelle: 'Compte courant', itemIcon: 'banque.png', actif: true };
const selectedDate = new Date(2026, 0, 1);

function renderItem(props: any = {}) {
    const onClick = vi.fn();
    const base = { compte, selectedCompte: null, selectedDate, selectedFunction: BUSINESS_ONGLETS.BUDGET, onRefreshMenuBar: false, onClick, ...props };
    const utils = render(<CompteItem {...base} />);
    return { onClick, base, ...utils };
}

describe('CompteItem (React.memo)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Par défaut : promesse jamais résolue (= chargement en cours)
        (fetchSoldesBudget as any).mockReturnValue(new Promise(() => {}));
    });

    test('affiche un spinner tant que le solde est inconnu (BUDGET)', () => {
        renderItem();
        expect(screen.getByText('Compte courant')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(fetchSoldesBudget).toHaveBeenCalledWith(compte, selectedDate);
    });

    test('affiche le solde une fois chargé (BUDGET)', async () => {
        (fetchSoldesBudget as any).mockResolvedValue(125.5);
        renderItem();
        expect(await screen.findByText(/125[.,]50/)).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('repasse au spinner si le chargement du solde échoue (BUDGET)', async () => {
        (fetchSoldesBudget as any).mockRejectedValue(new Error('500'));
        renderItem();
        await waitFor(() => expect(fetchSoldesBudget).toHaveBeenCalled());
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('RECURRENTS : "Non initialisé" si solde null, "Actif" sinon', async () => {
        (fetchSoldesBudget as any).mockResolvedValue(null);
        const { unmount } = renderItem({ selectedFunction: BUSINESS_ONGLETS.RECURRENTS });
        expect(await screen.findByText('Non initialisé')).toBeInTheDocument();
        unmount();

        (fetchSoldesBudget as any).mockResolvedValue(10);
        renderItem({ selectedFunction: BUSINESS_ONGLETS.RECURRENTS });
        expect(await screen.findByText('Actif')).toBeInTheDocument();
    });

    test('autre onglet (ANALYSES) : Actif / Inactif selon le compte, sans chargement des soldes', () => {
        renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES });
        expect(screen.getByText('Actif')).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(fetchSoldesBudget).not.toHaveBeenCalled();
    });

    test('BUDGET : changement de date -> spinner pendant le rechargement, ancien solde masqué', async () => {
        (fetchSoldesBudget as any).mockResolvedValueOnce(125.5);
        const { base, rerender } = renderItem();
        expect(await screen.findByText(/125[.,]50/)).toBeInTheDocument();

        // Rechargement : promesse jamais résolue
        (fetchSoldesBudget as any).mockReturnValue(new Promise(() => {}));
        rerender(<CompteItem {...base} selectedDate={new Date(2026, 1, 1)} />);

        expect(await screen.findByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText(/125[.,]50/)).not.toBeInTheDocument();
    });

    test('BUDGET : changement de date -> nouveau solde affiché une fois rechargé', async () => {
        (fetchSoldesBudget as any).mockResolvedValueOnce(125.5);
        const { base, rerender } = renderItem();
        expect(await screen.findByText(/125[.,]50/)).toBeInTheDocument();

        (fetchSoldesBudget as any).mockResolvedValue(300);
        rerender(<CompteItem {...base} selectedDate={new Date(2026, 1, 1)} />);

        expect(await screen.findByText(/300[.,]00/)).toBeInTheDocument();
        expect(screen.queryByText(/125[.,]50/)).not.toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('RECURRENTS : changement de date -> spinner pendant le rechargement, puis "Actif" / "Non initialisé"', async () => {
        (fetchSoldesBudget as any).mockResolvedValueOnce(10);
        const { base, rerender } = renderItem({ selectedFunction: BUSINESS_ONGLETS.RECURRENTS });
        expect(await screen.findByText('Actif')).toBeInTheDocument();

        (fetchSoldesBudget as any).mockReturnValue(new Promise(() => {}));
        rerender(<CompteItem {...base} selectedDate={new Date(2026, 1, 1)} />);
        expect(await screen.findByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText('Actif')).not.toBeInTheDocument();

        (fetchSoldesBudget as any).mockResolvedValue(null);
        rerender(<CompteItem {...base} selectedDate={new Date(2026, 2, 1)} />);
        expect(await screen.findByText('Non initialisé')).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('BUDGET : rechargement en erreur après un solde chargé -> spinner (ancien solde non conservé)', async () => {
        (fetchSoldesBudget as any).mockResolvedValueOnce(125.5);
        const { base, rerender } = renderItem();
        expect(await screen.findByText(/125[.,]50/)).toBeInTheDocument();

        (fetchSoldesBudget as any).mockRejectedValue(new Error('500'));
        rerender(<CompteItem {...base} selectedDate={new Date(2026, 1, 1)} />);

        await waitFor(() => expect(fetchSoldesBudget).toHaveBeenCalledTimes(2));
        expect(await screen.findByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText(/125[.,]50/)).not.toBeInTheDocument();
    });

    test('RECURRENTS : erreur du fetch -> spinner', async () => {
        (fetchSoldesBudget as any).mockRejectedValue(new Error('500'));
        renderItem({ selectedFunction: BUSINESS_ONGLETS.RECURRENTS });

        await waitFor(() => expect(fetchSoldesBudget).toHaveBeenCalled());
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText('Actif')).not.toBeInTheDocument();
    });

    test('BUDGET -> autre onglet : le spinner disparaît, Actif affiché', async () => {
        const { base, rerender } = renderItem();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        rerender(<CompteItem {...base} selectedFunction={BUSINESS_ONGLETS.ANALYSES} />);

        expect(await screen.findByText('Actif')).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('compte inactif affiché "Inactif" hors BUDGET/RECURRENTS', () => {
        renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES, compte: { ...compte, actif: false } });
        expect(screen.getByText('Inactif')).toBeInTheDocument();
    });

    test('clic sur la tuile : appelle onClick avec le compte', async () => {
        const { onClick } = renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES });
        await userEvent.click(screen.getByText('Compte courant'));
        expect(onClick).toHaveBeenCalledWith(compte);
    });

    test('re-render avec mêmes props : pas de rechargement ; changement de date : rechargement', () => {
        const { base, rerender } = renderItem();
        expect(fetchSoldesBudget).toHaveBeenCalledTimes(1);

        rerender(<CompteItem {...base} />);
        expect(fetchSoldesBudget).toHaveBeenCalledTimes(1);

        rerender(<CompteItem {...base} selectedDate={new Date(2026, 1, 1)} />);
        expect(fetchSoldesBudget).toHaveBeenCalledTimes(2);
    });
});

describe('CompteItem (sélection)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Tuile racine (Container MUI portant la classe listeItem), sans rôle ni testid accessible
    function getTuile(libelle: string): HTMLElement | null {
        // eslint-disable-next-line testing-library/no-node-access
        return screen.getByText(libelle).closest('.listeItem');
    }

    test('classe listeItem--selected si compte sélectionné', () => {
        renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES, selectedCompte: compte });
        expect(getTuile('Compte courant')).toHaveClass('listeItem', 'listeItem--selected');
    });

    test('pas de classe selected si autre compte sélectionné', () => {
        renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES, selectedCompte: { ...compte, id: 'c2' } });
        const tuile = getTuile('Compte courant');
        expect(tuile).toHaveClass('listeItem');
        expect(tuile).not.toHaveClass('listeItem--selected');
    });

    test('pas de classe selected si selectedCompte null', () => {
        renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES, selectedCompte: null });
        expect(getTuile('Compte courant')).not.toHaveClass('listeItem--selected');
    });
});
