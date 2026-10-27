import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import {
    getOperationIntercompteCatLibelle,
    getOperationLibelle,
    getOperationStateColor,
    getOperationStateLabel
} from './OperationItem.renderer.tsx';
import {OPERATION_ETATS_ENUM} from '../AppBusinessEnums.constants.ts';
import CompteBancaireModel from '../../Models/budgets/CompteBancaire.model.ts';

const comptes = [{id: 'cpt1', libelle: 'Livret A', itemIcon: 'livret.png'}] as unknown as CompteBancaireModel[];

describe('getOperationStateColor (non-régression : inchangée)', () => {
    test.each([
        [OPERATION_ETATS_ENUM.REALISEE, '#2e7d32'],
        [OPERATION_ETATS_ENUM.PREVUE, '#ed6c02'],
        [OPERATION_ETATS_ENUM.ANNULEE, '#ebebeb'],
        [OPERATION_ETATS_ENUM.SUPPRIMEE, '#ed1b24'],
        [OPERATION_ETATS_ENUM.REPORTEE, '#9c27b0'],
        [OPERATION_ETATS_ENUM.PLANIFIEE, '#0288d1'],
    ])('%s -> %s', (etat, couleur) => {
        expect(getOperationStateColor(etat)).toBe(couleur);
    });

    test('état inconnu ou null -> grey', () => {
        expect(getOperationStateColor('XXX' as OPERATION_ETATS_ENUM)).toBe('grey');
        expect(getOperationStateColor(null as unknown as OPERATION_ETATS_ENUM)).toBe('grey');
    });
});

describe('getOperationStateLabel', () => {
    test.each([
        [OPERATION_ETATS_ENUM.PREVUE, 'Prévue'],
        [OPERATION_ETATS_ENUM.REPORTEE, 'Reportée'],
        [OPERATION_ETATS_ENUM.REALISEE, 'Réalisée'],
        [OPERATION_ETATS_ENUM.ANNULEE, 'Annulée'],
        [OPERATION_ETATS_ENUM.SUPPRIMEE, 'Supprimée'],
        [OPERATION_ETATS_ENUM.PLANIFIEE, 'Planifiée'],
    ])('%s -> %s', (etat, libelle) => {
        expect(getOperationStateLabel(etat)).toBe(libelle);
    });

    test('valeur hors enum -> « État inconnu »', () => {
        expect(getOperationStateLabel('XXX' as OPERATION_ETATS_ENUM)).toBe('État inconnu');
    });
});

describe('getOperationLibelle - libellé et commentaire', () => {
    test('libellé et commentaire ont le même fontSize (desktop)', () => {
        render(getOperationLibelle('Loyer-janvier', [], false, false));
        expect(screen.getByText('Loyer').style.fontSize).toBe('medium');
        expect(screen.getByText(/janvier/).style.fontSize).toBe('medium');
    });

    test('libellé et commentaire ont le même fontSize (mobile)', () => {
        render(getOperationLibelle('Loyer-janvier', [], false, true));
        expect(screen.getByText('Loyer').style.fontSize).toBe('small');
        expect(screen.getByText(/janvier/).style.fontSize).toBe('small');
    });

    test('commentaire distingué par italique + couleur sous-texte', () => {
        render(getOperationLibelle('Loyer-janvier', [], false, false));
        const commentaire = screen.getByText(/janvier/);
        expect(commentaire).toHaveStyle({fontStyle: 'italic'});
        expect(commentaire.style.color).toContain('--color-operation-subtext');
    });

    test('libellé sans commentaire : affiché (régression : ne doit pas rendre undefined)', () => {
        render(<div>{getOperationLibelle('Loyer', [], false, false)}</div>);
        expect(screen.getByText('Loyer')).toBeInTheDocument();
    });

    test('libellé null -> fragment vide', () => {
        render(<div data-testid="vide">{getOperationLibelle(null as unknown as string, [], false)}</div>);
        expect(screen.getByTestId('vide')).toBeEmptyDOMElement();
    });
});

describe('Logo intercompte', () => {
    test('en liste : taille relative 1.4em, pas de bloc (inline)', () => {
        render(getOperationLibelle('[vers cpt1]Virement', comptes, false, false));
        const logo = screen.getByRole('img', {name: 'Livret A'});
        expect(logo).toHaveAttribute('src', '/img/banques/livret.png');
        expect(logo.style.width).toBe('1.4em');
        expect(logo.style.height).toBe('1.4em');
        expect(logo.style.display).toBe('inline');
        expect(screen.getByText('Virement')).toBeInTheDocument();
    });

    test('en vue détail (maxVue) : taille fixe 40px', () => {
        render(getOperationLibelle('[depuis cpt1]Virement', comptes, true, false));
        const logo = screen.getByRole('img', {name: 'Livret A'});
        expect(logo.style.width).toBe('40px');
        expect(logo.style.height).toBe('40px');
        expect(logo).toHaveAttribute('width', '40');
    });

    test('libellé de catégorie intercompte : direction + compte, logo relatif', () => {
        render(getOperationIntercompteCatLibelle('[vers cpt1]Virement', comptes, false));
        expect(screen.getByText('vers Livret A')).toBeInTheDocument();
        expect(screen.getByRole('img', {name: 'Livret A'}).style.width).toBe('1.4em');
    });

    test('nom d icône non sûr fourni par l API : icône par défaut', () => {
        const comptesPieges = [{id: 'cpt1', libelle: 'Livret A', itemIcon: '../x.png'}] as unknown as CompteBancaireModel[];
        render(getOperationLibelle('[vers cpt1]Virement', comptesPieges, false, false));

        expect(screen.getByRole('img', {name: 'Livret A'})).toHaveAttribute('src', '/img/icon.webp');
    });

    test('libellé de catégorie sans balise intercompte : libellé brut, sans logo', () => {
        render(getOperationIntercompteCatLibelle('Courses', comptes, false));

        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    test('compte introuvable : repli sur libellé brut, sans logo', () => {
        render(getOperationLibelle('[vers inconnu]Virement', comptes, false, false));
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});
