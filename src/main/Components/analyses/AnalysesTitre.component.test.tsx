import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import AnalysesTitre, { formatPeriode } from './AnalysesTitre.component.tsx';
import { getLabelMonthFRFromDate } from '../../Utils/Date.utils.ts';

const compte: any = { id: 'c1', libelle: 'Compte courant', itemIcon: 'banque.png' };
const moisUnique: any = { vuePeriode: false, periodeDebut: new Date(2026, 2, 1), periodeFin: new Date(2026, 2, 1) };
const plageMois: any = { vuePeriode: true, periodeDebut: new Date(2026, 0, 1), periodeFin: new Date(2026, 4, 1) };

describe('AnalysesTitre', () => {

    test('affiche libellé et icône du compte', () => {
        render(<AnalysesTitre currentCompte={compte} currentPeriode={moisUnique} />);

        expect(screen.getByText('Compte courant')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Compte courant' })).toHaveAttribute('src', '/img/banques/banque.png');
    });

    test.each(['../x', 'a/b', '%2e%2e'])('nom d icône non sûr "%s" : icône par défaut', (itemIcon) => {
        render(<AnalysesTitre currentCompte={{ ...compte, itemIcon }} currentPeriode={moisUnique} />);

        expect(screen.getByRole('img', { name: 'Compte courant' })).toHaveAttribute('src', '/img/icon.webp');
    });

    test('même mois : un seul mois affiché', () => {
        render(<AnalysesTitre currentCompte={compte} currentPeriode={moisUnique} />);

        expect(screen.getByText('Analyses de ' + getLabelMonthFRFromDate(moisUnique.periodeDebut))).toBeInTheDocument();
    });

    test('plusieurs mois : "début à fin"', () => {
        render(<AnalysesTitre currentCompte={compte} currentPeriode={plageMois} />);

        expect(screen.getByText('Analyses de ' + getLabelMonthFRFromDate(plageMois.periodeDebut) + ' à ' + getLabelMonthFRFromDate(plageMois.periodeFin))).toBeInTheDocument();
    });
});

describe('formatPeriode', () => {

    test('même mois mais années différentes : plage affichée', () => {
        const periode: any = { periodeDebut: new Date(2025, 2, 1), periodeFin: new Date(2026, 2, 1) };

        expect(formatPeriode(periode)).toBe('Analyses de ' + getLabelMonthFRFromDate(periode.periodeDebut) + ' à ' + getLabelMonthFRFromDate(periode.periodeFin));
    });

    test('même année mais mois différents : plage affichée', () => {
        const periode: any = { periodeDebut: new Date(2026, 1, 1), periodeFin: new Date(2026, 2, 1) };

        expect(formatPeriode(periode)).toContain(' à ');
    });
});
