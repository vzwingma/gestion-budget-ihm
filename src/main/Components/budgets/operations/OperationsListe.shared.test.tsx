import {describe, expect, test, vi} from 'vitest';
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

    describe('renderGroupHeader', () => {
        const op = (id: string, lib: string) => ({id, libelle: lib, categorie: {libelle: 'Cat'}, ssCategorie: {libelle: 'Ss'}}) as any;
        const noop = () => {
        };

        test('reçoit clé et opérations filtrées ; retour null = aucun en-tête', () => {
            const header = vi.fn((key: string, ops: any[]) => key === 'vide' ? null : <h4>{key}:{ops.length}</h4>);
            render(<SharedOperationsListe
                operationsGrouped={{g1: [op('1', 'Loyer'), op('2', 'Courses'), op('7', 'Zzz')], vide: [op('3', 'Poche')], g2: [op('4', 'Photo')]}}
                filterOperations="o" onClick={noop} renderItem={(o) => <div key={o.id}/>} renderGroupHeader={header}/>);
            // filtre "o" : g1 = Loyer + Courses (Zzz exclu)
            expect(screen.getByRole('heading', {name: 'g1:2'})).toBeInTheDocument();
            expect(screen.getByRole('heading', {name: 'g2:1'})).toBeInTheDocument();
            expect(screen.queryByText(/^vide/)).not.toBeInTheDocument();
        });

        test('groupe filtré vide : renderGroupHeader non appelé', () => {
            const header = vi.fn(() => <h4>H</h4>);
            render(<SharedOperationsListe operationsGrouped={{g: [op('1', 'Loyer')]}} filterOperations="zzz" onClick={noop}
                                          renderItem={(o) => <div key={o.id}/>} renderGroupHeader={header}/>);
            expect(header).not.toHaveBeenCalled();
            expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        });
    });

    test('sans renderGroupHeader : séparateur par défaut affiché, rien pour la clé "null"', () => {
        const op = (id: string, lib: string) => ({id, libelle: lib, categorie: {libelle: 'Cat'}, ssCategorie: {libelle: 'Ss'}}) as any;
        render(<SharedOperationsListe operationsGrouped={{Mensuelle: [op('1', 'Loyer')], null: [op('2', 'Autre')]}}
                                      filterOperations={null} onClick={() => {
        }} renderItem={(o) => <div data-testid="item" key={o.id}/>}/>);
        expect(screen.getByText('Mensuelle')).toBeInTheDocument();
        expect(screen.queryByText('null')).not.toBeInTheDocument();
        expect(screen.getAllByTestId('item')).toHaveLength(2);
    });
});
