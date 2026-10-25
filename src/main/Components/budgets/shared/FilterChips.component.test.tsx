import React, {useState} from 'react';
import {describe, expect, test, vi} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterChips, {COULEUR_PUCE_A_VALIDER, FILTER_CHIP_HEIGHT} from './FilterChips.component.tsx';
import {PUCE_ETAT_ENUM, PUCE_SENS_ENUM, PucesFiltre} from '../../../Utils/OperationsFilter.utils.ts';

const VIDE: PucesFiltre = {etats: [], sens: []};
const LIBELLES = ['À valider', 'Réalisée', 'Annulée', 'Dépenses', 'Rentrées'];

/** Wrapper contrôlé : l'état des puces est porté par le parent (comme dans le Context) */
const Controle = ({initial = VIDE, spy}: { initial?: PucesFiltre, spy?: (p: PucesFiltre) => void }) => {
    const [puces, setPuces] = useState<PucesFiltre>(initial);
    return <FilterChips puces={puces} onChange={(p) => {
        spy?.(p);
        setPuces(p);
    }}/>;
};

describe('FilterChips', () => {
    test('groupe accessible « Filtres des opérations » avec les 5 puces dans l ordre', () => {
        render(<FilterChips puces={VIDE} onChange={vi.fn()}/>);
        const groupe = screen.getByRole('group', {name: 'Filtres des opérations'});
        const boutons = within(groupe).getAllByRole('button');
        expect(boutons.map(b => b.textContent)).toEqual(LIBELLES);
    });

    test('aucune puce active : aria-pressed=false partout', () => {
        render(<FilterChips puces={VIDE} onChange={vi.fn()}/>);
        for (const libelle of LIBELLES) {
            expect(screen.getByRole('button', {name: libelle})).toHaveAttribute('aria-pressed', 'false');
        }
    });

    test('puces actives reflétées par aria-pressed, les autres restent à false', () => {
        render(<FilterChips puces={{etats: [PUCE_ETAT_ENUM.A_VALIDER, PUCE_ETAT_ENUM.ANNULEE], sens: [PUCE_SENS_ENUM.RENTREES]}}
                            onChange={vi.fn()}/>);
        expect(screen.getByRole('button', {name: 'À valider'})).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', {name: 'Annulée'})).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', {name: 'Rentrées'})).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', {name: 'Réalisée'})).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('button', {name: 'Dépenses'})).toHaveAttribute('aria-pressed', 'false');
    });

    test('clic sur une puce État : onChange avec la puce ajoutée, sens inchangé', async () => {
        const onChange = vi.fn();
        render(<FilterChips puces={{etats: [], sens: [PUCE_SENS_ENUM.DEPENSES]}} onChange={onChange}/>);
        await userEvent.click(screen.getByRole('button', {name: 'Réalisée'}));
        expect(onChange).toHaveBeenCalledWith({etats: [PUCE_ETAT_ENUM.REALISEE], sens: [PUCE_SENS_ENUM.DEPENSES]});
    });

    test('clic sur une puce Sens : onChange avec la puce ajoutée, états inchangés', async () => {
        const onChange = vi.fn();
        render(<FilterChips puces={{etats: [PUCE_ETAT_ENUM.ANNULEE], sens: []}} onChange={onChange}/>);
        await userEvent.click(screen.getByRole('button', {name: 'Rentrées'}));
        expect(onChange).toHaveBeenCalledWith({etats: [PUCE_ETAT_ENUM.ANNULEE], sens: [PUCE_SENS_ENUM.RENTREES]});
    });

    test('clic sur une puce active : elle est retirée', async () => {
        const onChange = vi.fn();
        render(<FilterChips puces={{etats: [PUCE_ETAT_ENUM.A_VALIDER, PUCE_ETAT_ENUM.REALISEE], sens: []}} onChange={onChange}/>);
        await userEvent.click(screen.getByRole('button', {name: 'À valider'}));
        expect(onChange).toHaveBeenCalledWith({etats: [PUCE_ETAT_ENUM.REALISEE], sens: []});
    });

    test('bascule et combinaison (composant contrôlé) : aria-pressed suit les clics', async () => {
        const spy = vi.fn();
        render(<Controle spy={spy}/>);
        await userEvent.click(screen.getByRole('button', {name: 'À valider'}));
        await userEvent.click(screen.getByRole('button', {name: 'Réalisée'}));
        await userEvent.click(screen.getByRole('button', {name: 'Dépenses'}));
        expect(screen.getByRole('button', {name: 'À valider'})).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', {name: 'Réalisée'})).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', {name: 'Dépenses'})).toHaveAttribute('aria-pressed', 'true');
        expect(spy).toHaveBeenLastCalledWith({
            etats: [PUCE_ETAT_ENUM.A_VALIDER, PUCE_ETAT_ENUM.REALISEE], sens: [PUCE_SENS_ENUM.DEPENSES]
        });

        await userEvent.click(screen.getByRole('button', {name: 'À valider'}));
        expect(screen.getByRole('button', {name: 'À valider'})).toHaveAttribute('aria-pressed', 'false');
        expect(screen.getByRole('button', {name: 'Réalisée'})).toHaveAttribute('aria-pressed', 'true');
    });

    test('la sélection n est pas portée par la couleur seule : coche présente uniquement si active', () => {
        const {rerender} = render(<FilterChips puces={VIDE} onChange={vi.fn()}/>);
        expect(within(screen.getByRole('button', {name: 'Annulée'})).queryByTestId('CheckIcon')).not.toBeInTheDocument();
        rerender(<FilterChips puces={{etats: [PUCE_ETAT_ENUM.ANNULEE], sens: []}} onChange={vi.fn()}/>);
        expect(within(screen.getByRole('button', {name: 'Annulée'})).getByTestId('CheckIcon')).toBeInTheDocument();
        expect(within(screen.getByRole('button', {name: 'Réalisée'})).queryByTestId('CheckIcon')).not.toBeInTheDocument();
    });

    test('constantes de style : hauteur visuelle 40 px, couleur « À valider » neutre', () => {
        expect(FILTER_CHIP_HEIGHT).toBe(40);
        expect(COULEUR_PUCE_A_VALIDER).toBe('#90a4ae');
    });

    test('bordure : couleur dédiée « À valider », couleur de variable CSS pour Dépenses / Rentrées', () => {
        render(<FilterChips puces={VIDE} onChange={vi.fn()}/>);
        // Règles emotion injectées dans <head> (le computed style des shorthands n'est pas fiable en jsdom)
        const css = document.head.textContent ?? '';
        expect(css).toContain('2px solid ' + COULEUR_PUCE_A_VALIDER);
        expect(css).toContain('2px solid var(--color-depense)');
        expect(css).toContain('2px solid var(--color-credit)');
    });
});
