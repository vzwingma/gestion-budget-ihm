import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { AnalysesFiltrePeriodeComponent } from './AnalysesFiltrePeriode.component.tsx';
import { getValidPeriodesForCompte } from '../Analyses.extservices.ts';
import { AnalysesPeriodeModel } from '../../../Models/analyses/AnalysesPeriode.model.ts';

/**
 * Tests du filtre de période des analyses (AP 006 - T20) :
 * chargement des intervalles valides via useFetch, bornes min/max des champs "month" dérivées de ces
 * intervalles, raccourcis bornés, notification du parent.
 *
 * Service réseau mocké. Seule `Date` est figée (2026-06-15) : les timers restent réels pour waitFor/userEvent.
 */

vi.mock('../Analyses.extservices.ts', () => ({
    getValidPeriodesForCompte: vi.fn()
}));

const compte: any = { id: 'c1', libelle: 'Compte 1' };
const periodeInitiale: AnalysesPeriodeModel = {
    vuePeriode: false,
    periodeDebut: new Date(2026, 5, 1),
    periodeFin: new Date(2026, 5, 1)
};

/** Intervalle valide renvoyé par le back : mai 2026 -> juillet 2026 **/
const intervalle = { debut: new Date(2026, 4, 1), fin: new Date(2026, 6, 1) };

/** Champ <input type="month"> par libellé (les boutons radio "Mois" partagent le même libellé) **/
const monthInput = (label: string) =>
    screen.getByLabelText(label, { selector: 'input[type="month"]' });

function renderFiltre(selectedCompte: any = compte, periode: AnalysesPeriodeModel = periodeInitiale) {
    const onChange = vi.fn();
    const utils = render(
        <AnalysesFiltrePeriodeComponent periode={periode} selectedCompte={selectedCompte} onChange={onChange} />
    );
    return { onChange, ...utils };
}

describe('AnalysesFiltrePeriodeComponent', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date(2026, 5, 15));
        (getValidPeriodesForCompte as any).mockResolvedValue([intervalle]);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('chargement des intervalles via useFetch', () => {

        test('charge les intervalles du compte sélectionné', async () => {
            renderFiltre();

            await waitFor(() => expect(monthInput('Mois')).toHaveAttribute('min', '2026-05'));
            expect(getValidPeriodesForCompte).toHaveBeenCalledTimes(1);
            expect(getValidPeriodesForCompte).toHaveBeenCalledWith(compte);
        });

        test('sans compte sélectionné : aucun appel, pas de borne min, max = mois courant', () => {
            renderFiltre(null);

            expect(getValidPeriodesForCompte).not.toHaveBeenCalled();
            expect(monthInput('Mois')).not.toHaveAttribute('min');
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-06');
        });

        test('rechargement des intervalles quand le compte change', async () => {
            const { rerender, onChange } = renderFiltre();
            await waitFor(() => expect(monthInput('Mois')).toHaveAttribute('min', '2026-05'));

            (getValidPeriodesForCompte as any).mockResolvedValue([{ debut: new Date(2025, 0, 1), fin: new Date(2025, 11, 1) }]);
            const autreCompte: any = { id: 'c2', libelle: 'Compte 2' };
            rerender(<AnalysesFiltrePeriodeComponent periode={periodeInitiale} selectedCompte={autreCompte} onChange={onChange} />);

            await waitFor(() => expect(monthInput('Mois')).toHaveAttribute('min', '2025-01'));
            expect(monthInput('Mois')).toHaveAttribute('max', '2025-12');
            expect(getValidPeriodesForCompte).toHaveBeenCalledTimes(2);
        });

        test('intervalles vides renvoyés par le back : bornes par défaut', async () => {
            (getValidPeriodesForCompte as any).mockResolvedValue([]);
            renderFiltre();

            await waitFor(() => expect(getValidPeriodesForCompte).toHaveBeenCalled());
            expect(monthInput('Mois')).not.toHaveAttribute('min');
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-06');
        });

        test('échec de chargement (promesse rejetée) : bornes par défaut, composant toujours affiché', async () => {
            (getValidPeriodesForCompte as any).mockRejectedValue(new Error('500'));
            renderFiltre();

            await waitFor(() => expect(getValidPeriodesForCompte).toHaveBeenCalled());
            expect(monthInput('Mois')).not.toHaveAttribute('min');
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-06');
        });
    });

    describe('indicateur de chargement des périodes valides', () => {

        /** Promesse résolue à la demande, pour figer l'état "chargement en cours" **/
        function deferred<T>() {
            let resolve!: (v: T) => void;
            const promise = new Promise<T>(res => { resolve = res; });
            return { promise, resolve };
        }

        test('pendant le chargement : progressbar présent, aucune borne min, max = mois courant', () => {
            const d = deferred<any>();
            (getValidPeriodesForCompte as any).mockReturnValue(d.promise);
            renderFiltre();

            expect(screen.getByRole('progressbar', { name: 'Chargement des périodes valides' })).toBeInTheDocument();
            expect(monthInput('Mois')).not.toHaveAttribute('min');
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-06');
        });

        test('après résolution : spinner disparu, min/max = bornes du compte', async () => {
            const d = deferred<any>();
            (getValidPeriodesForCompte as any).mockReturnValue(d.promise);
            renderFiltre();
            expect(screen.getByRole('progressbar')).toBeInTheDocument();

            d.resolve([intervalle]);

            await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
            expect(monthInput('Mois')).toHaveAttribute('min', '2026-05');
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-07');
        });

        test('changement de compte : spinner réapparaît, anciennes bornes non appliquées', async () => {
            const { rerender, onChange } = renderFiltre();
            await waitFor(() => expect(monthInput('Mois')).toHaveAttribute('min', '2026-05'));
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

            const d = deferred<any>();
            (getValidPeriodesForCompte as any).mockReturnValue(d.promise);
            const autreCompte: any = { id: 'c2', libelle: 'Compte 2' };
            rerender(<AnalysesFiltrePeriodeComponent periode={periodeInitiale} selectedCompte={autreCompte} onChange={onChange} />);

            expect(await screen.findByRole('progressbar')).toBeInTheDocument();
            expect(monthInput('Mois')).not.toHaveAttribute('min');
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-06');

            d.resolve([{ debut: new Date(2025, 0, 1), fin: new Date(2025, 11, 1) }]);
            await waitFor(() => expect(monthInput('Mois')).toHaveAttribute('min', '2025-01'));
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });

        test('raccourci cliqué pendant le chargement : bornes périmées du compte précédent ignorées', async () => {
            const user = userEvent.setup();
            const { rerender, onChange } = renderFiltre(compte, { ...periodeInitiale, vuePeriode: true });
            await waitFor(() => expect(monthInput('Début')).toHaveAttribute('min', '2026-05'));

            const d = deferred<any>();
            (getValidPeriodesForCompte as any).mockReturnValue(d.promise);
            const autreCompte: any = { id: 'c2', libelle: 'Compte 2' };
            rerender(<AnalysesFiltrePeriodeComponent periode={{ ...periodeInitiale, vuePeriode: true }} selectedCompte={autreCompte} onChange={onChange} />);
            expect(await screen.findByRole('progressbar')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: '3 mois' }));

            // Non borné par l'ancien min (mai 2026) : avril -> juin 2026
            expect(monthInput('Début')).toHaveValue('2026-04');
            expect(monthInput('Fin')).toHaveValue('2026-06');
        });

        test('compte null : aucun appel réseau, spinner transitoire (promesse immédiate) puis disparu', async () => {
            renderFiltre(null);
            // useFetch passe brièvement en loading même sans compte (Promise.resolve(undefined))
            await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
            expect(getValidPeriodesForCompte).not.toHaveBeenCalled();
        });

        test('échec de chargement : spinner disparu', async () => {
            (getValidPeriodesForCompte as any).mockRejectedValue(new Error('500'));
            renderFiltre();

            await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
        });
    });

    describe('bornes min/max dérivées des intervalles', () => {

        test('vue "Mois" : min = début, max = fin de l intervalle', async () => {
            renderFiltre();

            await waitFor(() => expect(monthInput('Mois')).toHaveAttribute('min', '2026-05'));
            expect(monthInput('Mois')).toHaveAttribute('max', '2026-07');
        });

        test('vue "Période" : Début borné par min et Fin, Fin bornée par Début et max', async () => {
            const user = userEvent.setup();
            renderFiltre(compte, { ...periodeInitiale, vuePeriode: true });
            await waitFor(() => expect(monthInput('Début')).toHaveAttribute('min', '2026-05'));

            await user.click(screen.getByRole('radio', { name: 'Période' }));

            expect(monthInput('Début')).toHaveAttribute('min', '2026-05');
            expect(monthInput('Début')).toHaveAttribute('max', '2026-06');
            expect(monthInput('Fin')).toHaveAttribute('min', '2026-06');
            expect(monthInput('Fin')).toHaveAttribute('max', '2026-07');
        });
    });

    describe('raccourcis de période', () => {

        async function renderVuePeriode() {
            const utils = renderFiltre(compte, { ...periodeInitiale, vuePeriode: true });
            await waitFor(() => expect(monthInput('Début')).toHaveAttribute('min', '2026-05'));
            return utils;
        }

        test('"3 mois" : 3 derniers mois jusqu au mois courant, début borné au min de l intervalle', async () => {
            const user = userEvent.setup();
            await renderVuePeriode();

            await user.click(screen.getByRole('button', { name: '3 mois' }));

            // 3 mois = avril -> juin 2026, avril < min (mai 2026) -> début ramené à mai
            expect(monthInput('Début')).toHaveValue('2026-05');
            expect(monthInput('Fin')).toHaveValue('2026-06');
            expect(screen.getByText('Durée : 2 mois')).toBeInTheDocument();
        });

        test('"Année courante" : début borné au min de l intervalle', async () => {
            const user = userEvent.setup();
            await renderVuePeriode();

            await user.click(screen.getByRole('button', { name: 'Année courante' }));

            expect(monthInput('Début')).toHaveValue('2026-05');
            expect(monthInput('Fin')).toHaveValue('2026-06');
        });

        test('"Année précédente" hors intervalle : retombe sur tout l intervalle disponible', async () => {
            const user = userEvent.setup();
            await renderVuePeriode();

            await user.click(screen.getByRole('button', { name: 'Année précédente' }));

            expect(monthInput('Début')).toHaveValue('2026-05');
            expect(monthInput('Fin')).toHaveValue('2026-07');
        });

        test('sans intervalle (compte null) : raccourci "3 mois" non borné', async () => {
            const user = userEvent.setup();
            renderFiltre(null, { ...periodeInitiale, vuePeriode: true });

            await user.click(screen.getByRole('button', { name: '3 mois' }));

            expect(monthInput('Début')).toHaveValue('2026-04');
            expect(monthInput('Fin')).toHaveValue('2026-06');
            expect(screen.getByText('Durée : 3 mois')).toBeInTheDocument();
        });
    });

    describe('notification du parent', () => {

        test('notifie la période initiale au montage', () => {
            const { onChange } = renderFiltre(null);

            expect(onChange).toHaveBeenCalledWith({
                vuePeriode: false,
                periodeDebut: periodeInitiale.periodeDebut,
                periodeFin: periodeInitiale.periodeFin
            });
        });

        test('saisie d un mois en vue "Mois" : début et fin = 1er du mois saisi', () => {
            const { onChange } = renderFiltre(null);

            fireEvent.change(monthInput('Mois'), { target: { value: '2026-03' } });

            const derniere: AnalysesPeriodeModel = onChange.mock.calls[onChange.mock.calls.length - 1][0];
            expect(derniere.vuePeriode).toBe(false);
            expect(derniere.periodeDebut).toEqual(new Date(2026, 2, 1));
            expect(derniere.periodeFin).toEqual(new Date(2026, 2, 1));
        });

        test('période > 12 mois : début ramené à 12 mois avant la fin', async () => {
            const { onChange } = renderFiltre(null, { vuePeriode: true, periodeDebut: new Date(2024, 0, 1), periodeFin: new Date(2026, 5, 1) });
            await waitFor(() => expect(onChange).toHaveBeenCalled());

            await waitFor(() => expect(monthInput('Début')).toHaveValue('2025-07'));
            const derniere: AnalysesPeriodeModel = onChange.mock.calls[onChange.mock.calls.length - 1][0];
            expect(derniere.vuePeriode).toBe(true);
            expect(derniere.periodeDebut).toEqual(new Date(2025, 6, 1));
            expect(derniere.periodeFin).toEqual(new Date(2026, 5, 1));
        });
    });
});
