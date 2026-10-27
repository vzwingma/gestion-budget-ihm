import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailCategories, validateFormCategories } from './OperationDetailCategories.component.tsx';
import { buildBudget, buildCategories, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { createEmptyErrors } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';

describe('OperationDetailCategories - composant', () => {

    const fill = vi.fn();
    const categorie = () => screen.getByRole('combobox');

    function rendre(props: { enEdition?: boolean; erreur?: string | null } = {}, contexte: Parameters<typeof renderWithContexts>[1] = {}) {
        return renderWithContexts(
            <OperationDetailCategories listeCategories={buildCategories()} formCatgoriesInEdition={props.enEdition ?? true}
                errorsCategories={props.erreur ?? null} fillOperationForm={fill} />, contexte);
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('opération absente : rien n\'est rendu', () => {
        rendre({ enEdition: false }, { operation: null });

        expect(screen.queryByText(/Alimentation/)).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('lecture : "Catégorie / Sous-catégorie" de l\'opération', () => {
        rendre({ enEdition: false });

        expect(screen.getByText('Alimentation / Courses')).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('édition : la sous-catégorie courante est pré-sélectionnée', () => {
        rendre();

        expect(categorie()).toHaveValue('Courses');
    });

    test('édition : toutes les sous-catégories du contexte sont proposées, triées par catégorie parente puis libellé, groupées', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(categorie());

        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(['Bourse', 'Courses', 'Restaurant', 'Salaire', 'Virement interne']);
        expect(screen.getByText('Alimentation')).toBeInTheDocument();
        expect(screen.getByText('Virements')).toBeInTheDocument();
    });

    test('édition : choisir une sous-catégorie appelle fillOperationForm(OPERATION_CATEGORIE, id de la sous-catégorie)', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(categorie());
        await user.click(await screen.findByRole('option', { name: 'Restaurant' }));

        expect(fill).toHaveBeenCalledWith('OPERATION_CATEGORIE', 'ss-resto');
    });

    test('édition : vider la sélection transmet une chaîne vide', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(categorie());
        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(fill).toHaveBeenCalledWith('OPERATION_CATEGORIE', '');
    });

    test('édition avec erreur : message affiché et champ invalide', () => {
        rendre({ erreur: 'Le champ Catégorie est obligatoire' });

        expect(screen.getByText('Le champ Catégorie est obligatoire')).toBeInTheDocument();
    });

    test('édition : le focus désactive la validation clavier, la perte de focus la réactive', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(categorie());
        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'false');
        await user.keyboard('{Escape}');
        await user.tab();

        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'true');
    });

    test('édition : les options viennent de la prop listeCategories, pas des catégories du contexte', async () => {
        const user = userEvent.setup();
        const autre = { id: 'cat-autre', libelle: 'Autre', listeSSCategories: [{ id: 'ss-autre', libelle: 'Sous-cat de la prop', categorieParente: { id: 'cat-autre', libelle: 'Autre' } }] } as any;
        // Contexte : catégories par défaut (Courses, Restaurant...) DIFFÉRENTES de la prop
        renderWithContexts(
            <OperationDetailCategories listeCategories={[autre]} formCatgoriesInEdition={true}
                errorsCategories={null} fillOperationForm={fill} />);

        await user.click(categorie());

        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(['Sous-cat de la prop']);
    });

    test('édition : ssCategorieInEdition prime sur la sous-catégorie de la ligne du contexte', () => {
        renderWithContexts(
            <OperationDetailCategories listeCategories={buildCategories()} formCatgoriesInEdition={true}
                ssCategorieInEdition={{ id: 'ss-resto', libelle: 'Restaurant' } as any}
                errorsCategories={null} fillOperationForm={fill} />);

        expect(categorie()).toHaveValue('Restaurant');
    });

    test('édition : catégories sans sous-catégories ni parente : aucune option', async () => {
        const user = userEvent.setup();
        renderWithContexts(
            <OperationDetailCategories listeCategories={[{ id: 'vide', libelle: 'Vide' } as any]} formCatgoriesInEdition={true}
                errorsCategories={null} fillOperationForm={fill} />);

        await user.click(categorie());

        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    test('édition : une option sans identifiant n est jamais considérée comme la valeur sélectionnée', async () => {
        const user = userEvent.setup();
        const sansId = { id: 'cat-x', libelle: 'X', listeSSCategories: [
            { id: null, libelle: 'Sans identifiant', categorieParente: { id: 'cat-x', libelle: 'X' } },
            { id: 'ss-courses', libelle: 'Courses', categorieParente: { id: 'cat-x', libelle: 'X' } }
        ] } as any;
        renderWithContexts(
            <OperationDetailCategories listeCategories={[sansId]} formCatgoriesInEdition={true}
                errorsCategories={null} fillOperationForm={fill} />);

        await user.click(categorie());

        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(expect.arrayContaining(['Sans identifiant', 'Courses']));
        expect(screen.getByRole('option', { name: 'Courses' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('option', { name: 'Sans identifiant' })).toHaveAttribute('aria-selected', 'false');
    });

    test('édition sur budget clos : le composant reste fonctionnel (le verrou est porté par la page)', () => {
        rendre({}, { budget: buildBudget(false) });

        expect(categorie()).toHaveValue('Courses');
    });
});

describe('OperationDetailCategories - validateFormCategories', () => {

    test('catégorie et sous-catégorie renseignées : recopiées sur l\'opération, aucune erreur', () => {
        const operation = buildOperation({ categorie: { id: 'x', libelle: 'X' } });
        const edition = cloneOperation(operation);
        edition.categorie.id = 'cat-alim';
        edition.categorie.libelle = 'Alimentation';
        edition.ssCategorie.id = 'ss-resto';
        edition.ssCategorie.libelle = 'Restaurant';
        const errors = createEmptyErrors();

        validateFormCategories(edition, operation, errors);

        expect(errors.categorie).toBeNull();
        expect(operation.categorie).toEqual({ id: 'cat-alim', libelle: 'Alimentation' });
        expect(operation.ssCategorie).toMatchObject({ id: 'ss-resto', libelle: 'Restaurant' });
    });

    test.each([
        ['categorie.id', (e: ReturnType<typeof cloneOperation>) => { (e.categorie as any).id = null; }],
        ['categorie.libelle', (e: ReturnType<typeof cloneOperation>) => { (e.categorie as any).libelle = null; }],
        ['ssCategorie.id', (e: ReturnType<typeof cloneOperation>) => { (e.ssCategorie as any).id = null; }],
        ['ssCategorie.libelle', (e: ReturnType<typeof cloneOperation>) => { (e.ssCategorie as any).libelle = null; }]
    ])('%s nul : erreur "obligatoire" et opération inchangée', (_champ, casser) => {
        const operation = buildOperation();
        const edition = cloneOperation(operation);
        casser(edition);
        const errors = createEmptyErrors();

        validateFormCategories(edition, operation, errors);

        expect(errors.categorie).toBe('Le champ Catégorie est obligatoire');
        expect(operation.ssCategorie.id).toBe('ss-courses');
    });
});
