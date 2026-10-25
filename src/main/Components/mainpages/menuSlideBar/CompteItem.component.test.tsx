import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompteItem from './CompteItem.component.tsx';
import {BUSINESS_ONGLETS} from '../../../Utils/AppBusinessEnums.constants.ts';
import CompteBancaireModel from '../../../Models/budgets/CompteBancaire.model.ts';

// Évite les appels HTTP de chargement des soldes
vi.mock('./CompteItem.controller.ts', () => ({getSoldesBudget: vi.fn()}));

const compte = {id: 'c1', libelle: 'Compte 1', itemIcon: 'a.png', actif: true} as unknown as CompteBancaireModel;
const autre = {id: 'c2', libelle: 'Compte 2', itemIcon: 'b.png', actif: true} as unknown as CompteBancaireModel;

function renderItem(selected: CompteBancaireModel | null) {
    const onClick = vi.fn();
    const {container} = render(<CompteItem compte={compte} selectedCompte={selected} selectedDate={new Date('2026-01-10')}
                                 selectedFunction={BUSINESS_ONGLETS.ANALYSES} onRefreshMenuBar={false}
                                 onClick={onClick}/>);
    // Tuile sans rôle : on vérifie les classes de la tuile racine via le HTML rendu
    const classes = /class="([^"]*)"/.exec(container.innerHTML)?.[1].split(/\s+/) ?? [];
    return {onClick, classes};
}

describe('CompteItem', () => {
    beforeEach(() => vi.clearAllMocks());

    test('classe listeItem--selected si compte sélectionné', () => {
        const {classes} = renderItem(compte);
        expect(classes).toEqual(expect.arrayContaining(['listeItem', 'listeItem--selected']));
    });

    test('pas de classe selected si autre compte sélectionné', () => {
        const {classes} = renderItem(autre);
        expect(classes).toContain('listeItem');
        expect(classes).not.toContain('listeItem--selected');
    });

    test('pas de classe selected si selectedCompte null', () => {
        const {classes} = renderItem(null);
        expect(classes).not.toContain('listeItem--selected');
    });

    test('clic appelle onClick avec le compte', async () => {
        const {onClick} = renderItem(null);
        await userEvent.click(screen.getByText('Compte 1'));
        expect(onClick).toHaveBeenCalledWith(compte);
    });
});
