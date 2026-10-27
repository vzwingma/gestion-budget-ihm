import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import AnalysesFiltres from './AnalysesFiltres.component.tsx';
import { getDefaultAnalysesFilters } from '../../Models/analyses/AnalysesFilters.model.ts';
import { OPERATION_ETATS_ENUM, TYPES_OPERATION_ENUM } from '../../Utils/AppBusinessEnums.constants.ts';

/** Filtre de période mocké (service réseau et champs de dates couverts par son propre test) : un bouton de changement */
vi.mock('./filtres/AnalysesFiltrePeriode.component.tsx', () => ({
    AnalysesFiltrePeriodeComponent: ({ periode, onChange }: any) => (
        <button onClick={() => onChange({ ...periode, vuePeriode: true })}>changer période</button>
    )
}));

const periode: any = { vuePeriode: false, periodeDebut: new Date(2026, 0, 1), periodeFin: new Date(2026, 0, 1) };
const categorie: any = { id: 'cat-1', libelle: 'Alimentation' };

function renderFiltres(isLoading = false) {
    const setFilters = vi.fn();
    const setPeriodeAnalyses = vi.fn();
    render(
        <AnalysesFiltres isLoading={isLoading} currentPeriode={periode} selectedCompte={null}
            setPeriodeAnalyses={setPeriodeAnalyses} filters={getDefaultAnalysesFilters()} setFilters={setFilters}
            distinctCategories={[categorie]} />);
    return { setFilters, setPeriodeAnalyses };
}

/** Applique le dernier updater fonctionnel transmis à `setFilters` sur l'état par défaut */
function appliquer(setFilters: ReturnType<typeof vi.fn>) {
    const updater = setFilters.mock.calls.at(-1)?.[0];
    return updater(getDefaultAnalysesFilters());
}

describe('AnalysesFiltres', () => {

    test('chargement : indicateur affiché (Backdrop ouvert)', () => {
        renderFiltres(true);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('hors chargement : pas d indicateur', () => {
        renderFiltres(false);

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    test('changement de période : transmis à setPeriodeAnalyses', async () => {
        const { setPeriodeAnalyses } = renderFiltres();

        await userEvent.click(screen.getByRole('button', { name: 'changer période' }));

        expect(setPeriodeAnalyses).toHaveBeenCalledWith({ ...periode, vuePeriode: true });
    });

    test('changement de types de catégories : met à jour selectedTypes en conservant le reste', async () => {
        const { setFilters } = renderFiltres();

        await userEvent.click(screen.getByText('Tous')); // tous sélectionnés par défaut -> désélection

        expect(appliquer(setFilters)).toEqual({ ...getDefaultAnalysesFilters(), selectedTypes: [] });
    });

    test('changement des filtres d opération : met à jour états et types, sans toucher aux autres', async () => {
        const { setFilters } = renderFiltres();

        await userEvent.click(screen.getByRole('checkbox', { name: 'Prévue' }));

        expect(appliquer(setFilters)).toEqual({
            ...getDefaultAnalysesFilters(),
            selectedOperationEtats: [OPERATION_ETATS_ENUM.REALISEE],
            selectedOperationTypes: [TYPES_OPERATION_ENUM.DEPENSE, TYPES_OPERATION_ENUM.CREDIT]
        });
    });

    test('changement de catégories : met à jour selectedCategories', async () => {
        const { setFilters } = renderFiltres();

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(await screen.findByRole('option', { name: 'Alimentation' }));

        expect(appliquer(setFilters)).toEqual({ ...getDefaultAnalysesFilters(), selectedCategories: [categorie] });
    });
});
