import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { AnalysesFiltreCategories } from './AnalysesFiltreCategories.component.tsx';
import { AnalysesFiltresSsCategories } from './AnalysesFiltresSsCategories.component.tsx';

const alimentation: any = { id: 'cat-alim', libelle: 'Alimentation' };
const loisirs: any = { id: 'cat-loisirs', libelle: 'Loisirs' };

describe('AnalysesFiltreCategories', () => {

    function afficherFiltre(selected: any[] = []) {
        const onChange = vi.fn();
        render(<AnalysesFiltreCategories distinctCategories={[alimentation, loisirs]} selectedCategories={selected} onChange={onChange} />);
        return onChange;
    }

    test('sans sélection : placeholder affiché', () => {
        afficherFiltre();

        expect(screen.getByPlaceholderText('Sélectionnez des catégories')).toBeInTheDocument();
    });

    test('avec sélection : catégorie affichée en tag, placeholder masqué', () => {
        afficherFiltre([alimentation]);

        expect(screen.getByText('Alimentation')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Sélectionnez des catégories')).not.toBeInTheDocument();
    });

    test('choisir une catégorie : onChange avec la sélection complète', async () => {
        const onChange = afficherFiltre([alimentation]);

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(await screen.findByRole('option', { name: 'Loisirs' }));

        expect(onChange).toHaveBeenCalledWith([alimentation, loisirs]);
    });

    test('vider la sélection : onChange avec une liste vide', async () => {
        const onChange = afficherFiltre([alimentation, loisirs]);

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(screen.getByRole('button', { name: 'Clear' }));

        expect(onChange).toHaveBeenCalledWith([]);
    });
});

describe('AnalysesFiltresSsCategories', () => {

    const courses: any = { id: 'ss-courses', libelle: 'Courses', categorieParente: alimentation };
    const cine: any = { id: 'ss-cine', libelle: 'Cinéma', categorieParente: loisirs };
    const orpheline: any = { id: 'ss-orph', libelle: 'Orpheline' };

    function afficherFiltre(selected: any[] = []) {
        const onChange = vi.fn();
        render(<AnalysesFiltresSsCategories distinctSubcategories={[courses, cine, orpheline]} selectedSubcategories={selected} onChange={onChange} />);
        return onChange;
    }

    test('sans sélection : placeholder affiché', () => {
        afficherFiltre();

        expect(screen.getByPlaceholderText('Sélectionnez des sous-catégories')).toBeInTheDocument();
    });

    test('options groupées par catégorie parente (sans parente : groupe vide)', async () => {
        afficherFiltre();

        await userEvent.click(screen.getByRole('combobox'));

        expect(await screen.findByText('Alimentation')).toBeInTheDocument();
        expect(screen.getByText('Loisirs')).toBeInTheDocument();
        expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Courses', 'Cinéma', 'Orpheline']);
    });

    test('choisir une sous-catégorie : onChange avec la sélection complète', async () => {
        const onChange = afficherFiltre([courses]);

        await userEvent.click(screen.getByRole('combobox'));
        await userEvent.click(await screen.findByRole('option', { name: 'Cinéma' }));

        expect(onChange).toHaveBeenCalledWith([courses, cine]);
    });
});
