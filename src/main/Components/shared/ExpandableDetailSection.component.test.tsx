import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { ExpandableDetailSection } from './ExpandableDetailSection.component.tsx';

describe('ExpandableDetailSection', () => {

    test('affiche le titre, le contenu et le bouton Agrandir ; pas de modale au départ', () => {
        render(<ExpandableDetailSection label="Évolution"><div>contenu</div></ExpandableDetailSection>);

        expect(screen.getByText('Évolution')).toBeInTheDocument();
        expect(screen.getByText('contenu')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Agrandir' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument();
    });

    test('Agrandir : modale plein écran avec titre et contenu dupliqués', async () => {
        render(<ExpandableDetailSection label="Évolution"><div>contenu</div></ExpandableDetailSection>);

        await userEvent.click(screen.getByRole('button', { name: 'Agrandir' }));

        expect(await screen.findByRole('button', { name: 'Fermer' })).toBeInTheDocument();
        expect(screen.getAllByText('Évolution')).toHaveLength(2);
        expect(screen.getAllByText('contenu')).toHaveLength(2);
    });

    test('Fermer : la modale disparaît', async () => {
        render(<ExpandableDetailSection label="Évolution"><div>contenu</div></ExpandableDetailSection>);
        await userEvent.click(screen.getByRole('button', { name: 'Agrandir' }));

        await userEvent.click(await screen.findByRole('button', { name: 'Fermer' }));

        await waitFor(() => expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument());
        expect(screen.getAllByText('contenu')).toHaveLength(1);
    });

    test('Échap : ferme la modale', async () => {
        render(<ExpandableDetailSection label="Évolution"><div>contenu</div></ExpandableDetailSection>);
        await userEvent.click(screen.getByRole('button', { name: 'Agrandir' }));
        await screen.findByRole('button', { name: 'Fermer' });

        await userEvent.keyboard('{Escape}');

        await waitFor(() => expect(screen.queryByRole('button', { name: 'Fermer' })).not.toBeInTheDocument());
    });
});
