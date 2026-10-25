import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import SharedOperationsListe from './OperationsListe.shared.tsx';

describe('SharedOperationsListe', () => {
    test('conteneur scrollable : classe operationsListeScrollable + scrollbar-gutter stable', () => {
        render(
            <SharedOperationsListe operationsGrouped={{}} filterOperations={null} onClick={() => {
            }} renderItem={() => <div/>}/>);
        // Stack sans rôle ni texte propre : requête TL par sélecteur CSS (texte propre vide)
        const el = screen.getByText('', {selector: '.operationsListeScrollable'});
        expect(getComputedStyle(el).overflowY).toBe('auto');
        // jsdom ne gère pas toujours scrollbar-gutter en computed style : on vérifie la règle emotion injectée
        const css = document.head.textContent ?? '';
        expect(getComputedStyle(el).getPropertyValue('scrollbar-gutter') || css).toMatch(/stable/);
    });

    test('rend uniquement les items correspondant au filtre', () => {
        const op = (id: string, lib: string) => ({id, libelle: lib, categorie: {libelle: 'Cat'}, ssCategorie: {libelle: 'Ss'}}) as any;
        render(
            <SharedOperationsListe operationsGrouped={{g: [op('1', 'Loyer'), op('2', 'Courses')]}}
                                   filterOperations="loyer" onClick={() => {
            }}
                                   renderItem={(o) => <div data-testid="item" key={o.id}/>}/>);
        expect(screen.getAllByTestId('item')).toHaveLength(1);
    });
});
