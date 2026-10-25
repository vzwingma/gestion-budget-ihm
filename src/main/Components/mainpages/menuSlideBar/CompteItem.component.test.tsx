import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import CompteItem from './CompteItem.component.tsx';
import { getSoldesBudget } from './CompteItem.controller.ts';
import { BUSINESS_ONGLETS } from '../../../Utils/AppBusinessEnums.constants.ts';

// Contrôleur mocké : évite tout appel réseau, le solde est injecté via le setter fourni
vi.mock('./CompteItem.controller.ts', () => ({ getSoldesBudget: vi.fn() }));

const compte: any = { id: 'c1', libelle: 'Compte courant', itemIcon: 'banque.png', actif: true };
const selectedDate = new Date(2026, 0, 1);

function renderItem(props: any = {}) {
    const onClick = vi.fn();
    const base = { compte, selectedDate, selectedFunction: BUSINESS_ONGLETS.BUDGET, onRefreshMenuBar: false, onClick, ...props };
    const utils = render(<CompteItem {...base} />);
    return { onClick, base, ...utils };
}

describe('CompteItem (React.memo)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche un spinner tant que le solde est inconnu (BUDGET)', () => {
        renderItem();
        expect(screen.getByText('Compte courant')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(getSoldesBudget).toHaveBeenCalledWith(compte, selectedDate, expect.any(Function));
    });

    test('affiche le solde une fois chargé (BUDGET)', () => {
        (getSoldesBudget as any).mockImplementation((_c: any, _d: any, setSoldes: any) => setSoldes(125.5));
        renderItem();
        expect(screen.getByText(/125[.,]50/)).toBeInTheDocument();
    });

    test('RECURRENTS : "Non initialisé" si solde null, "Actif" sinon', () => {
        (getSoldesBudget as any).mockImplementation((_c: any, _d: any, setSoldes: any) => setSoldes(null));
        const { unmount } = renderItem({ selectedFunction: BUSINESS_ONGLETS.RECURRENTS });
        expect(screen.getByText('Non initialisé')).toBeInTheDocument();
        unmount();

        (getSoldesBudget as any).mockImplementation((_c: any, _d: any, setSoldes: any) => setSoldes(10));
        renderItem({ selectedFunction: BUSINESS_ONGLETS.RECURRENTS });
        expect(screen.getByText('Actif')).toBeInTheDocument();
    });

    test('autre onglet (ANALYSES) : Actif / Inactif selon le compte, sans chargement des soldes', () => {
        renderItem({ selectedFunction: BUSINESS_ONGLETS.ANALYSES });
        expect(screen.getByText('Actif')).toBeInTheDocument();
        expect(getSoldesBudget).not.toHaveBeenCalled();
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
        expect(getSoldesBudget).toHaveBeenCalledTimes(1);

        rerender(<CompteItem {...base} />);
        expect(getSoldesBudget).toHaveBeenCalledTimes(1);

        rerender(<CompteItem {...base} selectedDate={new Date(2026, 1, 1)} />);
        expect(getSoldesBudget).toHaveBeenCalledTimes(2);
    });
});
