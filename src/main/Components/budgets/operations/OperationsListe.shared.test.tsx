import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import SharedOperationsListe from './OperationsListe.shared.tsx';

describe('SharedOperationsListe', () => {
    test('conteneur scrollable : classe operationsListeScrollable + scrollbar-gutter stable', () => {
        const {container} = render(
            <SharedOperationsListe operationsGrouped={{}} filterOperations={null} onClick={() => {
            }} renderItem={() => <div/>}/>);
        const el = container.querySelector('.operationsListeScrollable') as HTMLElement;
        expect(el).not.toBeNull();
        expect(getComputedStyle(el).overflowY).toBe('auto');
        // jsdom ne gère pas toujours scrollbar-gutter en computed style : on vérifie la règle emotion injectée
        const css = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('');
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
