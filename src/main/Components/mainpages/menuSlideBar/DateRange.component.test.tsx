import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import DateRange from './DateRange.component.tsx';

/**
 * Sélecteur de mois (précédent / courant / suivant). Les libellés de mois dépendent de la locale du runtime :
 * les boutons sont repérés par leur position (précédent, courant, suivant), jamais par leur texte.
 * Seule `Date` est figée (15/06/2026) : les timers restent réels pour userEvent.
 */

const boutons = () => screen.getAllByRole('button').slice(0, 3);

function afficher(selectedDate: Date) {
    const onDateChange = vi.fn();
    render(<DateRange selectedDate={selectedDate} onDateChange={onDateChange} />);
    return onDateChange;
}

describe('DateRange', () => {

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date(2026, 5, 15, 12, 0));
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    test('affiche trois boutons : mois précédent, courant, suivant', () => {
        afficher(new Date(2026, 0, 1));

        expect(boutons()).toHaveLength(3);
    });

    test('mois précédent : remonte le 1er du mois précédent et décale la fenêtre', async () => {
        const onDateChange = afficher(new Date(2026, 0, 1));

        await userEvent.click(boutons()[0]);

        expect(onDateChange).toHaveBeenCalledTimes(1);
        expect(onDateChange).toHaveBeenCalledWith(new Date(2025, 11, 1));

        // La fenêtre est décalée : un nouveau clic sur "précédent" remonte encore d'un mois
        await userEvent.click(boutons()[0]);
        expect(onDateChange).toHaveBeenLastCalledWith(new Date(2025, 10, 1));
    });

    test('mois suivant dans le passé (mois déjà clos) : passage direct, sans confirmation', async () => {
        const onDateChange = afficher(new Date(2026, 0, 1));

        await userEvent.click(boutons()[2]);

        expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 1, 1));
        expect(screen.queryByText("Confirmation d'ouverture")).not.toBeInTheDocument();
    });

    test('mois suivant depuis le mois en cours : demande de confirmation, aucun changement tant que non confirmé', async () => {
        const onDateChange = afficher(new Date(2026, 5, 1));

        await userEvent.click(boutons()[2]);

        expect(await screen.findByText("Confirmation d'ouverture")).toBeInTheDocument();
        expect(onDateChange).not.toHaveBeenCalled();
    });

    test('confirmation : le mois suivant devient le mois courant et la fenêtre se ferme', async () => {
        const onDateChange = afficher(new Date(2026, 5, 1));
        await userEvent.click(boutons()[2]);

        await userEvent.click(await screen.findByRole('button', { name: 'Confirmer' }));

        expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 6, 1));
        await waitFor(() => expect(screen.queryByText("Confirmation d'ouverture")).not.toBeInTheDocument());
    });

    test('annulation : fenêtre fermée, mois inchangé', async () => {
        const onDateChange = afficher(new Date(2026, 5, 1));
        await userEvent.click(boutons()[2]);

        await userEvent.click(await screen.findByRole('button', { name: 'Annuler' }));

        expect(onDateChange).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByText("Confirmation d'ouverture")).not.toBeInTheDocument());
    });

    test('clic sur le mois courant : aucun changement', async () => {
        const onDateChange = afficher(new Date(2026, 0, 1));

        await userEvent.click(boutons()[1]);

        expect(onDateChange).not.toHaveBeenCalled();
    });
});
