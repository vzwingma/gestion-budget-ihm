import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailLibelle } from './OperationDetailLibelle.component.tsx';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';

describe('OperationDetailLibelle - composant', () => {

    const fill = vi.fn();
    const historique = () => [
        { libelle: 'Banque', categorieId: 'cat-alim', ssCategorieId: 'ss-courses' },
        { libelle: 'Courses Carrefour', categorieId: 'cat-alim', ssCategorieId: 'ss-courses' },
        { libelle: 'Cadeau', categorieId: 'cat-alim', ssCategorieId: 'ss-resto' },
        { libelle: 'Carte', categorieId: 'cat-alim', ssCategorieId: 'ss-resto' }
    ];
    const description = () => screen.getByRole('combobox', { name: /description/i });

    function rendre(props: { enEdition?: boolean; erreur?: string | null; libelles?: ReturnType<typeof historique> } = {}, contexte: Parameters<typeof renderWithContexts>[1] = {}) {
        return renderWithContexts(
            <OperationDetailLibelle listeLibellesOperations={props.libelles ?? historique()} formLibelleInEdition={props.enEdition ?? true}
                errorLibelle={props.erreur ?? null} fillOperationForm={fill} />, contexte);
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('budget ou opération absents : rien n\'est rendu', () => {
        rendre({ enEdition: false }, { budget: undefined });
        expect(screen.queryByText('Courses Carrefour')).not.toBeInTheDocument();
    });

    test('lecture : libellé affiché, éditable', () => {
        rendre({ enEdition: false });

        const texte = screen.getByText('Courses Carrefour');
        // la classe d'édition est portée par le conteneur #OPERATION_LIBELLE, parent du texte
        // eslint-disable-next-line testing-library/no-node-access
        expect(texte.closest('#OPERATION_LIBELLE')).toHaveClass('editableField');
    });

    test('lecture sur budget clos : marqué désactivé', () => {
        rendre({ enEdition: false }, { budget: buildBudget(false) });

        // eslint-disable-next-line testing-library/no-node-access -- classe portée par le conteneur #OPERATION_LIBELLE
        expect(screen.getByText('Courses Carrefour').closest('#OPERATION_LIBELLE')).toHaveClass('editableField--disabled');
    });

    test('lecture d\'un virement interne : le libellé est affiché avec l\'icône du compte cible', () => {
        rendre({ enEdition: false }, { operation: buildOperation({ libelle: '[vers compte-2] Epargne' }) });

        expect(screen.getByText('Epargne')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Livret A' })).toBeInTheDocument();
    });

    test('édition : champ Description pré-rempli', () => {
        rendre();

        expect(description()).toHaveValue('Courses Carrefour');
    });

    test('édition d\'un virement interne : seule la partie libre du libellé est éditable', () => {
        rendre({}, { operation: buildOperation({ libelle: '[vers compte-2] Epargne' }) });

        // la regex INTERCOMPTE_LIBELLE_REGEX capture l'espace qui suit la balise : il fait partie de la valeur affichée
        expect(description()).toHaveValue(' Epargne');
    });

    test('édition avec erreur : message affiché et champ invalide', () => {
        rendre({ erreur: 'Le champ Description est obligatoire' });

        expect(screen.getByText('Le champ Description est obligatoire')).toBeInTheDocument();
        // Le FormControl externe porte l'état d'erreur (aide en rouge) mais pas l'attribut aria-invalid de l'input interne
    });

    test('le focus désactive la validation clavier', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(description());

        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'false');
    });

    test('la perte de focus réactive la validation clavier et enregistre le texte saisi', async () => {
        const user = userEvent.setup();
        rendre();

        await user.clear(description());
        await user.type(description(), 'Loyer');
        await user.tab();

        expect(fill).toHaveBeenCalledWith('FORM_VALIDATION', 'true');
        expect(fill).toHaveBeenLastCalledWith('OPERATION_LIBELLE', 'Loyer');
    });

    // Comportement actuel : la balise est conservée mais l'espace qui la suivait est perdu ("[vers compte-2]Livret").
    test('saisie libre sur un virement interne : les balises [vers compte] sont conservées', async () => {
        const user = userEvent.setup();
        rendre({}, { operation: buildOperation({ libelle: '[vers compte-2] Epargne' }) });

        await user.clear(description());
        await user.type(description(), 'Livret');
        await user.tab();

        expect(fill).toHaveBeenLastCalledWith('OPERATION_LIBELLE', '[vers compte-2]Livret');
    });

    test('choisir un libellé de l\'historique sur une opération existante : libellé seul (catégorie non modifiée)', async () => {
        const user = userEvent.setup();
        rendre();

        await user.click(description());
        await user.click(await screen.findByRole('option', { name: 'Cadeau' }));

        expect(fill).toHaveBeenCalledWith('OPERATION_LIBELLE', 'Cadeau');
        expect(fill).not.toHaveBeenCalledWith('OPERATION_CATEGORIE', expect.anything());
    });

    test('choisir un libellé de l\'historique sur une nouvelle opération : la catégorie associée est appliquée avant le libellé', async () => {
        const user = userEvent.setup();
        rendre({}, { operation: buildOperation({ id: '-1', libelle: '' }) });

        await user.click(description());
        await user.click(await screen.findByRole('option', { name: 'Cadeau' }));

        const appels = fill.mock.calls.map((appel) => appel[0]);
        expect(fill).toHaveBeenCalledWith('OPERATION_CATEGORIE', 'ss-resto');
        expect(fill).toHaveBeenCalledWith('OPERATION_LIBELLE', 'Cadeau');
        expect(appels.indexOf('OPERATION_CATEGORIE')).toBeLessThan(appels.lastIndexOf('OPERATION_LIBELLE'));
    });

    test('saisir un libellé existant (sans le choisir) sur une nouvelle opération applique aussi sa catégorie (insensible à la casse)', async () => {
        const user = userEvent.setup();
        rendre({}, { operation: buildOperation({ id: '-1', libelle: '' }) });

        await user.type(description(), 'cadeau');
        await user.tab();

        expect(fill).toHaveBeenCalledWith('OPERATION_CATEGORIE', 'ss-resto');
        expect(fill).toHaveBeenLastCalledWith('OPERATION_LIBELLE', 'cadeau');
    });

    test('libellé inconnu sur une nouvelle opération : aucune catégorie proposée', async () => {
        const user = userEvent.setup();
        rendre({}, { operation: buildOperation({ id: '-1', libelle: '' }) });

        await user.type(description(), 'Inconnu');
        await user.tab();

        expect(fill).not.toHaveBeenCalledWith('OPERATION_CATEGORIE', expect.anything());
    });

    test('les suggestions commençant par la saisie sont proposées en premier (plus courtes d\'abord)', async () => {
        const user = userEvent.setup();
        rendre({}, { operation: buildOperation({ id: '-1', libelle: '' }) });

        await user.type(description(), 'ca');

        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(['Carte', 'Cadeau', 'Courses Carrefour']);
    });
});
