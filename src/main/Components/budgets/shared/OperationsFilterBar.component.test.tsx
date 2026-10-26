import React from 'react';
import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperationsFilterBar from './OperationsFilterBar.component.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';
import {
    FILTRE_OPERATIONS_VIDE,
    FiltreOperations,
    PUCE_ETAT_ENUM,
    PUCE_SENS_ENUM
} from '../../../Utils/OperationsFilter.utils.ts';

const ope = (valeur: number, etat: OPERATION_ETATS_ENUM = OPERATION_ETATS_ENUM.REALISEE): OperationModel =>
    ({id: 'o' + valeur + etat, valeur, etat}) as unknown as OperationModel;

// Normalise les espaces (insécables) des séparateurs de milliers / avant « € »
const norm = (t: string | null) => (t ?? '').replace(/\s/g, ' ');

const filtreTexte: FiltreOperations = {texte: 'abc', etats: [], sens: []};
const filtrePuce: FiltreOperations = {texte: '', etats: [PUCE_ETAT_ENUM.A_VALIDER], sens: []};

describe('OperationsFilterBar', () => {
    const onFiltreChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('sans filtre : puces visibles, aucune barre de résultat ni « Réinitialiser »', () => {
        render(<OperationsFilterBar filtre={FILTRE_OPERATIONS_VIDE} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(1), ope(2)]}/>);
        expect(screen.getByRole('group', {name: 'Filtres des opérations'})).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Réinitialiser'})).not.toBeInTheDocument();
    });

    test('filtre texte seul : barre de résultat présente (role="status")', () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-10)]}/>);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Réinitialiser'})).toBeInTheDocument();
    });

    test('puce seule : barre de résultat présente', () => {
        render(<OperationsFilterBar filtre={filtrePuce} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-10)]}/>);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('texte null + aucune puce : pas de barre de résultat', () => {
        render(<OperationsFilterBar filtre={{texte: null, etats: [], sens: []}} onFiltreChange={onFiltreChange} operationsFiltrees={[]}/>);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('singulier : « 1 opération »', () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-10)]}/>);
        expect(norm(screen.getByRole('status').textContent)).toMatch(/^1 opération · net /);
    });

    test('pluriel : « N opérations »', () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-10), ope(-5), ope(3)]}/>);
        expect(norm(screen.getByRole('status').textContent)).toMatch(/^3 opérations · net /);
    });

    test('zéro résultat : « 0 opération · net 0,00 € » (pas de signe)', () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[]}/>);
        expect(norm(screen.getByRole('status').textContent)).toContain('0 opération · net 0,00 €');
    });

    test('net négatif : moins ASCII', () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-10), ope(-4.35)]}/>);
        const texte = norm(screen.getByRole('status').textContent);
        expect(texte).toContain('net -14,35 €');
        expect(texte).not.toContain('−'); // pas de moins typographique
    });

    test('net positif : « + » explicite', () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(10), ope(2.5)]}/>);
        expect(norm(screen.getByRole('status').textContent)).toContain('net +12,50 €');
    });

    test('net exclut ANNULEE et SUPPRIMEE mais le compteur les compte', () => {
        const ops = [ope(-10), ope(-100, OPERATION_ETATS_ENUM.ANNULEE), ope(-1000, OPERATION_ETATS_ENUM.SUPPRIMEE), ope(-1, OPERATION_ETATS_ENUM.PREVUE)];
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={ops}/>);
        const texte = norm(screen.getByRole('status').textContent);
        expect(texte).toContain('4 opérations');
        expect(texte).toContain('net -11,00 €');
    });

    test('seule puce « Annulée » : net 0,00 € (annulées exclues du net)', () => {
        const filtre: FiltreOperations = {texte: '', etats: [PUCE_ETAT_ENUM.ANNULEE], sens: []};
        render(<OperationsFilterBar filtre={filtre} onFiltreChange={onFiltreChange}
                                    operationsFiltrees={[ope(-50, OPERATION_ETATS_ENUM.ANNULEE), ope(-20, OPERATION_ETATS_ENUM.ANNULEE)]}/>);
        const texte = norm(screen.getByRole('status').textContent);
        expect(texte).toContain('2 opérations');
        expect(texte).toContain('net 0,00 €');
    });

    test('« Réinitialiser » : onFiltreChange(FILTRE_OPERATIONS_VIDE) (texte ET puces vidés)', async () => {
        const filtre: FiltreOperations = {texte: 'abc', etats: [PUCE_ETAT_ENUM.REALISEE], sens: [PUCE_SENS_ENUM.DEPENSES]};
        render(<OperationsFilterBar filtre={filtre} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-1)]}/>);
        await userEvent.click(screen.getByRole('button', {name: 'Réinitialiser'}));
        expect(onFiltreChange).toHaveBeenCalledTimes(1);
        expect(onFiltreChange).toHaveBeenCalledWith(FILTRE_OPERATIONS_VIDE);
    });

    test('clic sur une puce : onFiltreChange conserve le texte et ajoute la puce', async () => {
        render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[]}/>);
        await userEvent.click(screen.getByRole('button', {name: 'Rentrées'}));
        expect(onFiltreChange).toHaveBeenCalledWith({texte: 'abc', etats: [], sens: [PUCE_SENS_ENUM.RENTREES]});
    });

    test('puces actives reflétées par aria-pressed', () => {
        render(<OperationsFilterBar filtre={filtrePuce} onFiltreChange={onFiltreChange} operationsFiltrees={[]}/>);
        expect(screen.getByRole('button', {name: 'À valider'})).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', {name: 'Réalisée'})).toHaveAttribute('aria-pressed', 'false');
    });

    test('fragment de 2 cellules : puces dans la 1re, barre de résultat dans la 2e', () => {
        const {container} = render(<OperationsFilterBar filtre={filtreTexte} onFiltreChange={onFiltreChange} operationsFiltrees={[ope(-10)]}/>);
        // eslint-disable-next-line testing-library/no-node-access
        const cellules = Array.from(container.children) as HTMLElement[];
        expect(cellules).toHaveLength(2);
        expect(within(cellules[0]).getByRole('group', {name: 'Filtres des opérations'})).toBeInTheDocument();
        expect(within(cellules[0]).queryByRole('status')).not.toBeInTheDocument();
        expect(within(cellules[1]).getByRole('status')).toBeInTheDocument();
        expect(within(cellules[1]).getByRole('button', {name: 'Réinitialiser'})).toBeInTheDocument();
        expect(within(cellules[1]).queryByRole('group')).not.toBeInTheDocument();
    });

    test('sans filtre actif : 2 cellules, la 2e est vide', () => {
        const {container} = render(<OperationsFilterBar filtre={FILTRE_OPERATIONS_VIDE} onFiltreChange={onFiltreChange} operationsFiltrees={[]}/>);
        // eslint-disable-next-line testing-library/no-node-access
        const cellules = Array.from(container.children) as HTMLElement[];
        expect(cellules).toHaveLength(2);
        expect(cellules[1]).toBeEmptyDOMElement();
    });

    test('les 5 puces sont rendues dans la cellule filtre', () => {
        render(<OperationsFilterBar filtre={FILTRE_OPERATIONS_VIDE} onFiltreChange={onFiltreChange} operationsFiltrees={[]}/>);
        const boutons = within(screen.getByRole('group', {name: 'Filtres des opérations'})).getAllByRole('button');
        expect(boutons.map(b => b.textContent)).toEqual(['À valider', 'Réalisée', 'Annulée', 'Dépenses', 'Rentrées']);
    });
});
