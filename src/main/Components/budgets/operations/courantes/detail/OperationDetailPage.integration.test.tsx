import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { saveOperation, saveOperationIntercompte } from './OperationDetailPage.extservices.ts';
import { buildBudget, buildOperation, renderPage } from './OperationDetailPage.testutils.tsx';
import { createNewOperation } from '../../../../../Models/budgets/Operation.model.ts';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Tests de caractérisation de bout en bout de `OperationDetailPage` (AP 006 lot 3, phase 1 - filet avant refactor).
 *
 * Stratégie : vrai `BudgetContextProvider`, vrais sous-composants (MUI réel), seul le module `extservices`
 * (appels HTTP de sauvegarde) est mocké. On vérifie le comportement observable (rôles, libellés, valeurs saisies,
 * arguments transmis à `saveOperation` / `saveOperationIntercompte`), jamais les formats de montants/dates dépendants
 * de la locale du runtime.
 *
 * Contrat (lot 3) : l'état d'édition est immuable (hook `useOperationEditForm`) et l'opération du contexte
 * (`currentOperation`) n'est jamais mutée ; un brouillon est sauvegardé puis devient l'opération courante au succès.
 * Le helper `ouvrirEdition` clique puis force un re-render via le bouton de la harness ("forcer le rendu") : le re-render
 * est désormais redondant avec le clic (régression #704 couverte par « ouverture de l'édition au clic »), mais
 * l'attente reste inoffensive et conserve les scénarios historiques.
 */

vi.mock('react-oidc-context', () => ({ useAuth: () => ({ user: { profile: { email: 'vincent@test.fr' } } }) }));
vi.mock('./OperationDetailPage.extservices.ts', () => ({
    saveOperation: vi.fn(),
    saveOperationIntercompte: vi.fn(),
    fetchLibellesOperationsCompte: vi.fn()
}));

type UserEv = ReturnType<typeof userEvent.setup>;

/** Cible cliquable (en lecture) de chaque champ ; les ids du DOM sont le contrat utilisé par le gestionnaire de clic */
const CHAMPS = {
    valeur: () => screen.getByRole('heading', { level: 4 }),
    libelle: () => screen.getByText('Courses Carrefour', { selector: '#OPERATION_LIBELLE span' }),
    typeCategorie: () => screen.getByText('Essentiel', { selector: '#OPERATION_TYPE_CATEGORIE' }),
    mensualite: () => screen.getByText('Ponctuelle', { selector: '#OPERATION_MENSUALITE' }),
    dateOperation: () => screen.getByText('jj/mm/aaaa', { selector: '#OPERATION_DATE_OPERATION' })
};

/** Ouvre l'édition d'un champ (clic) puis force un re-render pour que l'état muté soit rendu */
async function ouvrirEdition(user: UserEv, champ: keyof typeof CHAMPS) {
    await user.click(CHAMPS[champ]());
    await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));
}

/** Champ sans label ni rôle ARIA distinctif (date, catégorie, intercompte) -> accès par id (contrat DOM du formulaire) */
function parId(id: string): HTMLElement | null {
    return document.getElementById(id);
}

const montant = () => screen.getByRole('textbox', { name: /montant/i });
const description = () => screen.getByRole('combobox', { name: /description/i });
const categorie = () => parId('OPERATION_CATEGORIE_INPUT') as HTMLElement;
const champDate = () => parId('OPERATION_DATE_OPERATION_INPUT') as HTMLInputElement;
/** Selects MUI : le combobox n'a pas de nom accessible, on lit sa valeur affichée (textContent) */
const selectTypeCategorie = () => parId('OPERATION_TYPE_CATEGORIE_INPUT') as HTMLElement;
const selectPeriode = () => parId('OPERATION_MENSUALITE_INPUT') as HTMLElement;
const selectIntercompte = () => parId('OPERATION_INTERCOMPTES_INPUT') as HTMLElement;
const boutonValider = () => screen.getByRole('button', { name: 'Valider' });

async function choisirCategorie(user: UserEv, libelleSsCategorie: string) {
    await user.click(categorie());
    await user.click(await screen.findByRole('option', { name: libelleSsCategorie }));
}

async function saisirDescription(user: UserEv, texte: string) {
    await user.clear(description());
    await user.type(description(), texte);
    await user.tab(); // blur -> valide la saisie dans le formulaire + réactive la validation clavier
}

/** Dernier appel à saveOperation : [operation, budget, onOperationUpdate] */
function dernierSave() {
    const calls = vi.mocked(saveOperation).mock.calls;
    return calls[calls.length - 1];
}

describe('OperationDetailPage - intégration', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // clearAllMocks ne retire pas les implémentations posées par certains scénarios (succès asynchrone)
        vi.mocked(saveOperation).mockReset();
        vi.mocked(saveOperationIntercompte).mockReset();
        vi.spyOn(console, 'error').mockImplementation(() => undefined); // validation : console.error volontaire
        vi.spyOn(console, 'warn').mockImplementation(() => undefined); // renderers : catégories de test sans couleur/icône
    });

    describe('sélection d\'une opération existante : formulaire pré-rempli (lecture)', () => {

        test('aucune opération sélectionnée : rien n\'est rendu', () => {
            renderPage({ initialOperationId: undefined });

            expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
            expect(screen.queryByText('Catégorie')).not.toBeInTheDocument();
        });

        test('affiche libellé, catégorie / sous-catégorie, type, période, état et date vide', () => {
            renderPage();

            expect(screen.getByText('Courses Carrefour')).toBeInTheDocument();
            expect(screen.getByText('Alimentation / Courses')).toBeInTheDocument();
            expect(screen.getByText('Essentiel')).toBeInTheDocument();
            expect(screen.getByText('Ponctuelle')).toBeInTheDocument();
            expect(screen.getByText('PREVUE')).toBeInTheDocument();
            expect(screen.getByText('jj/mm/aaaa')).toBeInTheDocument();
            // lecture seule : aucun champ de saisie ni bouton Valider
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
            // pas de date de fin pour une opération ponctuelle
            expect(screen.queryByText('Date de fin')).not.toBeInTheDocument();
        });

        test('opération mensuelle : le libellé "Date de fin" et la date de fin ("Jamais") sont affichés', () => {
            const operation = buildOperation({ mensualite: { periode: PERIODES_MENSUALITE_ENUM.MENSUELLE, prochaineEcheance: 3, dateFin: null } });
            renderPage({ operations: { mensuelle: operation } });

            expect(screen.getByText('Mensuelle')).toBeInTheDocument();
            expect(screen.getByText('Date de fin')).toBeInTheDocument();
            expect(screen.getByText('Jamais')).toBeInTheDocument();
        });

        test('catégorie Actifs / Investissements : le bloc "Période" n\'est pas affiché', () => {
            const operation = buildOperation({ categorie: { id: BUSINESS_GUID.CAT_ACTIFS_INVEST, libelle: 'Actifs' } });
            renderPage({ operations: { actif: operation } });

            expect(screen.queryByText('Période')).not.toBeInTheDocument();
        });

        test('les actions d\'état proposées excluent l\'état courant (PREVUE)', () => {
            renderPage();

            expect(screen.getByText('Actions')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Valider l\'opération' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Reporter l\'opération' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Annuler l\'opération' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Supprimer l\'opération' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Prévoir l\'opération' })).not.toBeInTheDocument();
        });

        test('opération supprimée : aucune action proposée', () => {
            renderPage({ operations: { supprimee: buildOperation({ etat: OPERATION_ETATS_ENUM.SUPPRIMEE }) } });

            expect(screen.getByText('Actions')).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /l'opération/ })).not.toBeInTheDocument();
        });

        test('virement interne existant : le compte de transfert est affiché en lecture seule (pas de sélecteur)', () => {
            const operation = buildOperation({
                libelle: '[vers compte-2] Epargne',
                ssCategorie: { id: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE, libelle: 'Virement interne', type: TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL }
            });
            renderPage({ operations: { virement: operation } });

            expect(screen.getByText('Compte de transfert')).toBeInTheDocument();
            expect(screen.getAllByRole('img', { name: 'Livret A' }).length).toBeGreaterThan(0);
            expect(parId('OPERATION_INTERCOMPTES_INPUT')).toBeNull();
        });

        test('opération non virement : pas de bloc "Compte de transfert"', () => {
            renderPage();

            expect(screen.queryByText('Compte de transfert')).not.toBeInTheDocument();
        });
    });

    describe('budget clos : aucune modification possible', () => {

        test('pas d\'actions ni de bouton Valider ; champs marqués désactivés ; le clic n\'ouvre pas l\'édition', async () => {
            const user = userEvent.setup();
            renderPage({ budget: buildBudget(false) });

            expect(screen.queryByText('Actions')).not.toBeInTheDocument();
            // la classe de désactivation est portée par le conteneur #OPERATION_LIBELLE, parent du texte
            // eslint-disable-next-line testing-library/no-node-access
            expect(CHAMPS.libelle().closest('#OPERATION_LIBELLE')).toHaveClass('editableField--disabled');

            await ouvrirEdition(user, 'libelle');

            expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
        });
    });

    describe('ouverture de l\'édition au clic sur un champ', () => {

        // Régression #704 (commit c3f235e, plan 005) : `editForm` était muté en place puis re-passé à `setEditForm`
        // (même référence) -> pas de re-rendu au clic. Corrigé : état immuable (nouvelle copie à chaque ouverture).
        test('un clic sur le montant ouvre le champ de saisie sans autre interaction', async () => {
            const user = userEvent.setup();
            renderPage();

            await user.click(CHAMPS.valeur());

            expect(montant()).toBeInTheDocument();
        });

        test.each([
            ['libelle', () => expect(description()).toHaveValue('Courses Carrefour')],
            ['typeCategorie', () => expect(selectTypeCategorie()).toHaveTextContent('Essentiel')],
            ['mensualite', () => expect(selectPeriode()).toHaveTextContent('Ponctuelle')],
            ['dateOperation', () => expect(champDate()).toBeInTheDocument()]
        ] as const)('un seul clic sur le champ %s l\'ouvre, sans re-rendu forcé', async (champ, verifier) => {
            const user = userEvent.setup();
            renderPage();

            await user.click(CHAMPS[champ]());

            verifier();
            expect(boutonValider()).toBeInTheDocument();
        });

        test.each([
            ['valeur', () => expect(montant()).toHaveValue('50')],
            ['libelle', () => expect(description()).toHaveValue('Courses Carrefour')],
            ['typeCategorie', () => expect(selectTypeCategorie()).toHaveTextContent('Essentiel')],
            ['mensualite', () => expect(selectPeriode()).toHaveTextContent('Ponctuelle')],
            ['dateOperation', () => expect(champDate()).toBeInTheDocument()]
        ] as const)('clic sur le champ %s (puis rendu) : le champ passe en saisie, avec Valider', async (champ, verifier) => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, champ);

            verifier();
            expect(boutonValider()).toBeInTheDocument();
        });

        test('seul le champ cliqué est ouvert : les autres restent en lecture', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'valeur');

            expect(montant()).toBeInTheDocument();
            expect(screen.queryByRole('combobox', { name: /description/i })).not.toBeInTheDocument();
            expect(screen.getByText('Courses Carrefour')).toBeInTheDocument();
        });
    });

    describe('création d\'une nouvelle opération', () => {

        test('formulaire entièrement ouvert, valeurs par défaut, actions limitées', () => {
            renderPage({ operations: { nouvelle: createNewOperation() } });

            expect(montant()).toHaveValue('0');
            expect(description()).toHaveValue('');
            expect(categorie()).toHaveValue('');
            expect(selectTypeCategorie()).toHaveTextContent('Essentiel');
            expect(selectPeriode()).toHaveTextContent('Ponctuelle');
            expect(champDate()).toHaveValue('');
            expect(boutonValider()).toBeInTheDocument();
            // en création : on ne peut ni annuler ni supprimer (ni "prévoir" : déjà PREVUE)
            expect(screen.getByRole('button', { name: 'Valider l\'opération' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Reporter l\'opération' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Annuler l\'opération' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Supprimer l\'opération' })).not.toBeInTheDocument();
        });

        test('création complète : saveOperation reçoit l\'opération saisie (dépense -> valeur négative)', async () => {
            const user = userEvent.setup();
            const { budget } = renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '12,5');
            await saisirDescription(user, 'Cinéma');
            await choisirCategorie(user, 'Restaurant');
            await user.click(boutonValider());

            expect(saveOperation).toHaveBeenCalledTimes(1);
            const [operation, budgetSauve, callback] = dernierSave();
            expect(operation).toMatchObject({
                id: '-1',
                libelle: 'Cinéma',
                valeur: -12.5,
                typeOperation: TYPES_OPERATION_ENUM.DEPENSE,
                categorie: { id: 'cat-alim', libelle: 'Alimentation' },
                ssCategorie: { id: 'ss-resto', libelle: 'Restaurant', type: TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR },
                etat: OPERATION_ETATS_ENUM.PREVUE
            });
            expect(budgetSauve).toBe(budget);
            expect(callback).toEqual(expect.any(Function));
            expect(saveOperationIntercompte).not.toHaveBeenCalled();
        });

        test('formulaire invalide : erreurs affichées et aucun appel de sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(boutonValider());

            expect(await screen.findByText('Le champ Description est obligatoire')).toBeInTheDocument();
            expect(screen.getByText('Le champ Catégorie est obligatoire')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
            expect(saveOperationIntercompte).not.toHaveBeenCalled();
        });

        test('montant mal formé : erreur de format affichée, pas de sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '-5');
            await saisirDescription(user, 'Test');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(await screen.findByText('Le format est incorrect : 0000.00 €')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
        });

        test('la correction d\'une erreur puis un nouveau Valider déclenche la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(boutonValider());
            expect(await screen.findByText('Le champ Description est obligatoire')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();

            await saisirDescription(user, 'Loyer');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(dernierSave()[0]).toMatchObject({ libelle: 'Loyer', ssCategorie: { id: 'ss-courses' } });
        });

        test('la touche Entrée valide le formulaire une fois la saisie d\'autocomplétion terminée (blur)', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '8');
            await saisirDescription(user, 'Café');
            await choisirCategorie(user, 'Restaurant');
            await user.click(montant());
            await user.keyboard('{Enter}');

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(dernierSave()[0]).toMatchObject({ libelle: 'Café', valeur: -8 });
        });

        test('la touche Entrée pendant la saisie d\'une autocomplétion (focus actif) ne valide pas', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(description()); // focus -> validation clavier désactivée
            await user.keyboard('Café{Enter}');

            expect(saveOperation).not.toHaveBeenCalled();
        });

        test('rentrée d\'argent : la valeur saisie est enregistrée positive (crédit)', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '1000');
            await saisirDescription(user, 'Paie');
            await choisirCategorie(user, 'Salaire');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({ valeur: 1000, typeOperation: TYPES_OPERATION_ENUM.CREDIT });
        });

        test('choisir une date d\'opération la transmet à la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.type(champDate(), '2026-03-15');
            await saisirDescription(user, 'Dentiste');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            const date = dernierSave()[0].autresInfos.dateOperation as Date;
            expect(date.toISOString().startsWith('2026-03-15')).toBe(true);
        });

        test('succès de la sauvegarde (asynchrone) : formulaire refermé et onOperationChange appelé avec le budget mis à jour', async () => {
            const user = userEvent.setup();
            const budgetMaj = new BudgetMensuelModel('compte-1_2026_10', 'Budget mis à jour');
            // Le vrai saveOperation appelle le callback après la réponse HTTP (donc après le clic, de façon asynchrone)
            vi.mocked(saveOperation).mockImplementation((_operation, _budget, onUpdate) => { void Promise.resolve().then(() => onUpdate(budgetMaj)); });
            const { onOperationChange } = renderPage({ operations: { nouvelle: createNewOperation() } });

            await saisirDescription(user, 'Loyer');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            await waitFor(() => expect(onOperationChange).toHaveBeenCalledTimes(1));
            expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
            // formulaire refermé : plus de saisie ni de bouton Valider
            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
            expect(screen.queryByRole('combobox', { name: /description/i })).not.toBeInTheDocument();
        });
    });

    describe('changement de catégorie : types et champs appliqués selon la catégorie parente', () => {

        test('Rentrées d\'argent : type Revenus, crédit (adornment +), période inchangée', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });
            expect(screen.getByTestId('RemoveRoundedIcon')).toBeInTheDocument();

            await choisirCategorie(user, 'Salaire');

            expect(selectTypeCategorie()).toHaveTextContent('Revenus');
            expect(screen.getByTestId('AddRoundedIcon')).toBeInTheDocument();
            expect(selectPeriode()).toHaveTextContent('Ponctuelle');
            expect(screen.getByText('Période')).toBeInTheDocument();
        });

        test('Actifs / Investissements : type Economies, crédit, bloc "Période" masqué', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await choisirCategorie(user, 'Bourse');

            expect(selectTypeCategorie()).toHaveTextContent('Economies');
            expect(screen.getByTestId('AddRoundedIcon')).toBeInTheDocument();
            expect(screen.queryByText('Période')).not.toBeInTheDocument();
        });

        test('Actifs / Investissements : la sauvegarde transmet crédit, Economies et période Mensuelle', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '200');
            await saisirDescription(user, 'PEA');
            await choisirCategorie(user, 'Bourse');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({
                typeOperation: TYPES_OPERATION_ENUM.CREDIT,
                valeur: 200,
                categorie: { id: BUSINESS_GUID.CAT_ACTIFS_INVEST },
                ssCategorie: { id: 'ss-bourse', type: TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES },
                mensualite: { periode: PERIODES_MENSUALITE_ENUM.MENSUELLE }
            });
        });

        test('catégorie standard : type de la sous-catégorie et dépense (adornment -)', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await choisirCategorie(user, 'Restaurant');

            expect(selectTypeCategorie()).toHaveTextContent('Plaisir');
            expect(screen.getByTestId('RemoveRoundedIcon')).toBeInTheDocument();
            expect(screen.getByText('Période')).toBeInTheDocument();
        });

        test('Rentrées d\'argent puis catégorie standard : retour en dépense', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await choisirCategorie(user, 'Salaire');
            expect(screen.getByTestId('AddRoundedIcon')).toBeInTheDocument();
            await choisirCategorie(user, 'Courses');

            expect(screen.getByTestId('RemoveRoundedIcon')).toBeInTheDocument();
            expect(selectTypeCategorie()).toHaveTextContent('Essentiel');
        });

        test('Rentrées d\'argent puis catégorie standard : la sauvegarde repasse en dépense (valeur négative)', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '40');
            await saisirDescription(user, 'Erreur de catégorie');
            await choisirCategorie(user, 'Salaire');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({ valeur: -40, typeOperation: TYPES_OPERATION_ENUM.DEPENSE });
        });

        test('changer le type de catégorie manuellement le conserve à la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await saisirDescription(user, 'Cadeau');
            // La sous-catégorie fixe aussi le type : on la choisit AVANT de forcer le type
            await choisirCategorie(user, 'Courses');
            await user.click(selectTypeCategorie());
            await user.click(await screen.findByRole('option', { name: 'Extras' }));
            await user.click(boutonValider());

            expect(dernierSave()[0].ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.EXTRAS);
        });

        test('changer la période Ponctuelle -> Mensuelle affiche la date de fin', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });
            expect(screen.queryByText('Date de fin')).not.toBeInTheDocument();

            await user.click(selectPeriode());
            await user.click(await screen.findByRole('option', { name: 'Mensuelle' }));

            expect(screen.getByText('Date de fin')).toBeInTheDocument();
        });

        test('opération existante en édition : la catégorie reste en lecture seule (non modifiable)', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'libelle');

            expect(categorie()).toBeNull();
            expect(screen.getByText('Alimentation / Courses')).toBeInTheDocument();
        });
    });

    describe('virement interne (intercompte)', () => {

        async function preparerVirement(user: UserEv) {
            renderPage({ operations: { nouvelle: createNewOperation() } });
            await choisirCategorie(user, 'Virement interne');
        }

        test('le sélecteur de compte de transfert exclut le compte courant et les comptes inactifs', async () => {
            const user = userEvent.setup();
            await preparerVirement(user);

            expect(screen.getByText('Compte de transfert')).toBeInTheDocument();
            await user.click(selectIntercompte());

            expect(await screen.findByRole('option', { name: /Livret A/ })).toBeInTheDocument();
            expect(screen.queryByRole('option', { name: /Compte courant/ })).not.toBeInTheDocument();
            expect(screen.queryByRole('option', { name: /Compte fermé/ })).not.toBeInTheDocument();
        });

        test('compte cible choisi : saveOperationIntercompte (et non saveOperation) est appelé avec le compte', async () => {
            const user = userEvent.setup();
            await preparerVirement(user);
            await saisirDescription(user, 'Epargne');
            await user.clear(montant());
            await user.type(montant(), '30');
            await user.click(selectIntercompte());
            await user.click(await screen.findByRole('option', { name: /Livret A/ }));
            await user.click(boutonValider());

            expect(saveOperation).not.toHaveBeenCalled();
            expect(saveOperationIntercompte).toHaveBeenCalledTimes(1);
            const [operation, budget, compteCible, callback] = vi.mocked(saveOperationIntercompte).mock.calls[0];
            expect(operation).toMatchObject({
                libelle: 'Epargne',
                valeur: -30,
                ssCategorie: { id: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE },
                intercompte: 'compte-2'
            });
            expect(budget.id).toBe('compte-1_2026_10');
            expect(compteCible).toBe('compte-2');
            expect(callback).toEqual(expect.any(Function));
        });

        test('sans compte cible choisi : erreur d\'intercompte, aucune sauvegarde', async () => {
            const user = userEvent.setup();
            await preparerVirement(user);
            await saisirDescription(user, 'Epargne');
            await user.click(boutonValider());

            expect(await screen.findByText('Le champ Intercompte est obligatoire')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
            expect(saveOperationIntercompte).not.toHaveBeenCalled();
        });

        test('succès (asynchrone) de l\'intercompte : formulaire refermé et onOperationChange appelé', async () => {
            const user = userEvent.setup();
            const budgetMaj = new BudgetMensuelModel('compte-1_2026_10', 'Après virement');
            vi.mocked(saveOperationIntercompte).mockImplementation((_op, _budget, _cible, onUpdate) => { void Promise.resolve().then(() => onUpdate(budgetMaj)); });
            const { onOperationChange } = renderPage({ operations: { nouvelle: createNewOperation() } });
            await choisirCategorie(user, 'Virement interne');
            await saisirDescription(user, 'Epargne');
            await user.click(selectIntercompte());
            await user.click(await screen.findByRole('option', { name: /Livret A/ }));
            await user.click(boutonValider());

            await waitFor(() => expect(onOperationChange).toHaveBeenCalledWith(budgetMaj));
            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
        });
    });

    describe('édition et sauvegarde d\'une opération existante', () => {

        test('modification du libellé et du montant : saveOperation reçoit l\'opération modifiée (id conservé)', async () => {
            const user = userEvent.setup();
            const { budget } = renderPage();

            await ouvrirEdition(user, 'valeur');
            await user.clear(montant());
            await user.type(montant(), '12,5');
            await ouvrirEdition(user, 'libelle');
            await saisirDescription(user, 'Loyer');
            await user.click(boutonValider());

            expect(saveOperation).toHaveBeenCalledTimes(1);
            const [operation, budgetSauve] = dernierSave();
            expect(operation).toMatchObject({ id: 'op-1', libelle: 'Loyer', valeur: -12.5, typeOperation: TYPES_OPERATION_ENUM.DEPENSE });
            expect(budgetSauve).toBe(budget);
        });

        test('un champ non ouvert n\'est pas validé : la valeur d\'origine est conservée', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'libelle');
            await saisirDescription(user, 'Loyer');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({ libelle: 'Loyer', valeur: -50 });
        });

        test('un crédit existant garde un montant positif après modification', async () => {
            const user = userEvent.setup();
            const credit = buildOperation({ typeOperation: TYPES_OPERATION_ENUM.CREDIT, valeur: 100, libelle: 'Courses Carrefour' });
            renderPage({ operations: { credit } });

            await ouvrirEdition(user, 'valeur');
            expect(montant()).toHaveValue('100');
            await user.clear(montant());
            await user.type(montant(), '10+5');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({ valeur: 15, typeOperation: TYPES_OPERATION_ENUM.CREDIT });
        });

        test('libellé effacé : erreur affichée et aucune sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'libelle');
            await user.clear(description());
            await user.tab();
            await user.click(boutonValider());

            expect(await screen.findByText('Le champ Description est obligatoire')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
        });

        test('la date d\'opération saisie est transmise à la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'dateOperation');
            await user.type(champDate(), '2026-04-20');
            await user.click(boutonValider());

            const date = dernierSave()[0].autresInfos.dateOperation as Date;
            expect(date.toISOString().startsWith('2026-04-20')).toBe(true);
        });

        test('la date d\'opération effacée est transmise comme absente (null)', async () => {
            const user = userEvent.setup();
            const avecDate = buildOperation();
            avecDate.autresInfos.dateOperation = new Date('2026-04-20T00:00:00.000Z');
            renderPage({ operations: { avecDate } });

            await user.click(screen.getByText(/\d/, { selector: '#OPERATION_DATE_OPERATION' }));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));
            expect(champDate()).toHaveValue('2026-04-20');
            await user.clear(champDate());
            await user.click(boutonValider());

            expect(dernierSave()[0].autresInfos.dateOperation).toBeNull();
        });

        test('période Mensuelle : la date de fin apparaît et un mois antérieur au budget est refusé', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'mensualite');
            await user.click(selectPeriode());
            await user.click(await screen.findByRole('option', { name: 'Mensuelle' }));
            expect(screen.getByText('Date de fin')).toBeInTheDocument();
            expect(screen.getByText('Jamais')).toBeInTheDocument();

            await user.click(screen.getByText('Jamais'));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));
            await user.type(parId('OPERATION_FORM_INPUT') as HTMLElement, '2026-01');
            await user.click(boutonValider());

            expect(await screen.findByText('La date de fin doit être supérieure ou égale au mois du budget')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
        });

        test('période Mensuelle avec date de fin valide : transmises à la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'mensualite');
            await user.click(selectPeriode());
            await user.click(await screen.findByRole('option', { name: 'Mensuelle' }));
            await user.click(screen.getByText('Jamais'));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));
            await user.type(parId('OPERATION_FORM_INPUT') as HTMLElement, '2027-03');
            await user.click(boutonValider());

            const [operation] = dernierSave();
            expect(operation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
            expect((operation.mensualite.dateFin as Date).toISOString().startsWith('2027-03')).toBe(true);
        });

        test('succès (asynchrone) : formulaire refermé, onOperationChange appelé, lecture seule rétablie', async () => {
            const user = userEvent.setup();
            const budgetMaj = new BudgetMensuelModel('compte-1_2026_10', 'Mis à jour');
            vi.mocked(saveOperation).mockImplementation((_op, _budget, onUpdate) => { void Promise.resolve().then(() => onUpdate(budgetMaj)); });
            const { onOperationChange } = renderPage();

            await ouvrirEdition(user, 'libelle');
            await saisirDescription(user, 'Loyer');
            await user.click(boutonValider());

            await waitFor(() => expect(onOperationChange).toHaveBeenCalledWith(budgetMaj));
            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
            expect(screen.queryByRole('combobox', { name: /description/i })).not.toBeInTheDocument();
        });

        // Quirk actuel : la validation clavier (Entrée) n'est active qu'après avoir quitté une autocomplétion
        // (`formValidationEnabled` initialisé à false et seulement basculé par focus/blur des autocomplétions / selects).
        test('Entrée dans le montant seul (aucune autocomplétion quittée) ne valide pas', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'valeur');
            await user.click(montant());
            await user.keyboard('{Enter}');

            expect(saveOperation).not.toHaveBeenCalled();
        });

        test('Entrée après avoir quitté l\'autocomplétion du libellé valide le formulaire', async () => {
            const user = userEvent.setup();
            renderPage();

            await ouvrirEdition(user, 'libelle');
            await ouvrirEdition(user, 'valeur');
            await saisirDescription(user, 'Loyer');
            await user.click(montant());
            await user.keyboard('{Enter}');

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(dernierSave()[0]).toMatchObject({ libelle: 'Loyer' });
        });
    });

    describe('actions sur l\'état de l\'opération', () => {

        test('Valider l\'opération : copie REALISEE avec date du jour sauvegardée ; au succès le parent est notifié et la copie devient l\'opération courante', async () => {
            const user = userEvent.setup();
            const initiale = buildOperation();
            const { onOperationChange } = renderPage({ operations: { initiale } });

            await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

            expect(saveOperation).toHaveBeenCalledTimes(1);
            const [operation, , callback] = dernierSave();
            expect(operation).toMatchObject({ id: 'op-1', etat: OPERATION_ETATS_ENUM.REALISEE });
            expect(operation.autresInfos.dateOperation).toBeInstanceOf(Date);
            // Copie : l'opération du contexte reste inchangée tant que la sauvegarde n'a pas réussi
            expect(operation).not.toBe(initiale);
            expect(initiale.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
            expect(screen.getByText('PREVUE')).toBeInTheDocument();
            expect(onOperationChange).not.toHaveBeenCalled();

            // Succès de la sauvegarde = appel du callback avec le budget mis à jour
            const budgetMaj = buildBudget();
            act(() => callback(budgetMaj));

            expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
            expect(screen.getByText('REALISEE')).toBeInTheDocument();
            expect(initiale.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        });

        test('Valider l\'opération : échec de la sauvegarde (callback jamais appelé) -> état affiché et contexte inchangés', async () => {
            const user = userEvent.setup();
            const initiale = buildOperation();
            const { onOperationChange } = renderPage({ operations: { initiale } });

            await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(onOperationChange).not.toHaveBeenCalled();
            expect(screen.getByText('PREVUE')).toBeInTheDocument();
            expect(screen.queryByText('REALISEE')).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Valider l\'opération' })).toBeInTheDocument();
            expect(initiale.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        });

        test('Reporter l\'opération : état REPORTEE, date inchangée', async () => {
            const user = userEvent.setup();
            renderPage();

            await user.click(screen.getByRole('button', { name: 'Reporter l\'opération' }));

            expect(dernierSave()[0]).toMatchObject({ etat: OPERATION_ETATS_ENUM.REPORTEE });
            expect(dernierSave()[0].autresInfos.dateOperation).toBeNull();
        });

        test('Annuler l\'opération : état ANNULEE', async () => {
            const user = userEvent.setup();
            renderPage();

            await user.click(screen.getByRole('button', { name: 'Annuler l\'opération' }));

            expect(dernierSave()[0]).toMatchObject({ etat: OPERATION_ETATS_ENUM.ANNULEE });
        });

        test('Prévoir l\'opération réalisée : état PREVUE et date effacée', async () => {
            const user = userEvent.setup();
            const realisee = buildOperation({ etat: OPERATION_ETATS_ENUM.REALISEE });
            realisee.autresInfos.dateOperation = new Date('2026-04-20T00:00:00.000Z');
            renderPage({ operations: { realisee } });

            await user.click(screen.getByRole('button', { name: 'Prévoir l\'opération' }));

            expect(dernierSave()[0]).toMatchObject({ etat: OPERATION_ETATS_ENUM.PREVUE });
            expect(dernierSave()[0].autresInfos.dateOperation).toBeNull();
        });

        test('Supprimer : une confirmation est demandée ; Annuler la ferme sans sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage();

            await user.click(screen.getByRole('button', { name: 'Supprimer l\'opération' }));
            expect(await screen.findByText('Voulez vous supprimer l\'opération ?')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: 'Annuler' }));

            await waitFor(() => expect(screen.queryByText('Voulez vous supprimer l\'opération ?')).not.toBeInTheDocument());
            expect(saveOperation).not.toHaveBeenCalled();
        });

        test('Supprimer puis Confirmer : état SUPPRIMEE sauvegardé', async () => {
            const user = userEvent.setup();
            renderPage();

            await user.click(screen.getByRole('button', { name: 'Supprimer l\'opération' }));
            await user.click(await screen.findByRole('button', { name: 'Confirmer' }));

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(dernierSave()[0]).toMatchObject({ id: 'op-1', etat: OPERATION_ETATS_ENUM.SUPPRIMEE });
        });

        test('création + Valider l\'opération : l\'état REALISEE est porté par l\'opération sans sauvegarde immédiate', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));

            expect(saveOperation).not.toHaveBeenCalled();
            expect(screen.getByText('REALISEE')).toBeInTheDocument();
        });

        // Régression corrigée (lot 3) : l'état choisi en création est porté par une nouvelle copie de la copie de travail
        test('création + Valider l\'opération : l\'état REALISEE est affiché immédiatement', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));

            expect(screen.getByText('REALISEE')).toBeInTheDocument();
        });
    });

    describe('changement d\'opération sélectionnée : pas de fuite d\'état', () => {

        const autre = () => buildOperation({ id: 'op-2', libelle: 'Loyer octobre', valeur: -700 });

        test('passer d\'une opération en cours d\'édition à une autre referme le formulaire et recharge ses valeurs', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { A: buildOperation(), B: autre() } });

            await ouvrirEdition(user, 'valeur');
            await user.clear(montant());
            await user.type(montant(), '999');
            await user.click(screen.getByRole('button', { name: 'select B' }));

            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
            expect(screen.getByText('Loyer octobre')).toBeInTheDocument();

            await user.click(screen.getByRole('heading', { level: 4 }));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));
            expect(montant()).toHaveValue('700');
        });

        test('le libellé saisi sur A n\'est pas repris sur B ; B est sauvegardée avec ses propres valeurs', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { A: buildOperation(), B: autre() } });

            await ouvrirEdition(user, 'libelle');
            await user.type(description(), ' en plus');
            await user.click(screen.getByRole('button', { name: 'select B' }));
            await user.click(screen.getByText('Loyer octobre', { selector: '#OPERATION_LIBELLE span' }));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));

            expect(description()).toHaveValue('Loyer octobre');
            await user.click(boutonValider());
            expect(dernierSave()[0]).toMatchObject({ id: 'op-2', libelle: 'Loyer octobre', valeur: -700 });
        });

        test('les erreurs de validation de A ne sont pas affichées sur B', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { A: buildOperation(), B: autre() } });

            await ouvrirEdition(user, 'libelle');
            await user.clear(description());
            await user.tab();
            await user.click(boutonValider());
            expect(await screen.findByText('Le champ Description est obligatoire')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'select B' }));
            await user.click(screen.getByText('Loyer octobre', { selector: '#OPERATION_LIBELLE span' }));
            await user.click(screen.getByRole('button', { name: 'forcer le rendu' }));

            expect(screen.queryByText('Le champ Description est obligatoire')).not.toBeInTheDocument();
        });

        test('création -> opération existante : le formulaire de création est refermé', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation(), B: autre() } });
            expect(boutonValider()).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'select B' }));

            expect(screen.queryByRole('button', { name: 'Valider' })).not.toBeInTheDocument();
            expect(screen.getByText('Loyer octobre')).toBeInTheDocument();
        });

        test('opération existante -> création : le formulaire de création est ouvert et vierge', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { B: autre(), nouvelle: createNewOperation() } });

            await user.click(screen.getByRole('button', { name: 'select nouvelle' }));

            expect(boutonValider()).toBeInTheDocument();
            expect(description()).toHaveValue('');
            expect(montant()).toHaveValue('0');
        });

        test('désélection (aucune opération) : la page se vide', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { A: buildOperation(), aucune: null } });
            expect(screen.getByText('Courses Carrefour')).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'select aucune' }));

            expect(screen.queryByText('Courses Carrefour')).not.toBeInTheDocument();
            expect(screen.queryByRole('heading', { level: 4 })).not.toBeInTheDocument();
        });

        test('nouvelle création après une création abandonnée : les valeurs de l\'opération précédente sont remises à zéro', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { n1: createNewOperation(), B: autre(), n2: createNewOperation() } });

            await saisirDescription(user, 'Brouillon');
            await user.click(screen.getByRole('button', { name: 'select B' }));
            await user.click(screen.getByRole('button', { name: 'select n2' }));

            expect(description()).toHaveValue('');
            await user.click(boutonValider());
            expect(await screen.findByText('Le champ Description est obligatoire')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
        });
    });

    describe('opération du contexte jamais mutée par la validation / la saisie', () => {

        // La validation travaille sur un brouillon : une tentative invalide ne « salit » plus l'opération partagée du contexte
        test('une validation en échec ne reporte pas le libellé saisi dans l\'opération du contexte', async () => {
            const user = userEvent.setup();
            const operation = buildOperation();
            renderPage({ operations: { operation } });

            await ouvrirEdition(user, 'libelle');
            await ouvrirEdition(user, 'valeur');
            await saisirDescription(user, 'Modifié');
            await user.clear(montant());
            await user.type(montant(), '-5');
            await user.click(boutonValider());

            expect(await screen.findByText('Le format est incorrect : 0000.00 €')).toBeInTheDocument();
            expect(saveOperation).not.toHaveBeenCalled();
            expect(operation.libelle).toBe('Courses Carrefour');
            expect(operation.valeur).toBe(-50);
        });

        test('le choix d\'une catégorie ne modifie pas l\'opération du contexte (copie de travail uniquement)', async () => {
            const user = userEvent.setup();
            const nouvelle = createNewOperation();
            const avant = JSON.stringify(nouvelle);
            renderPage({ operations: { nouvelle } });

            await choisirCategorie(user, 'Salaire');

            expect(JSON.stringify(nouvelle)).toBe(avant);
            // L'effet est visible dans la copie de travail : type Revenus affiché
            expect(screen.getByText('Revenus', { selector: '#OPERATION_TYPE_CATEGORIE_INPUT' })).toBeInTheDocument();
        });

        test('catégorie Salaire (Rentrées d\'argent) : l\'opération sauvegardée est un CREDIT de type Revenus, contexte inchangé', async () => {
            const user = userEvent.setup();
            const nouvelle = createNewOperation();
            renderPage({ operations: { nouvelle } });

            await user.clear(montant());
            await user.type(montant(), '1200');
            await saisirDescription(user, 'Paie');
            await choisirCategorie(user, 'Salaire');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({
                typeOperation: TYPES_OPERATION_ENUM.CREDIT,
                valeur: 1200,
                categorie: { id: BUSINESS_GUID.CAT_RENTREE_ARGENT },
                ssCategorie: { id: 'ss-salaire', type: TYPES_CATEGORIES_OPERATION_ENUM.REVENUS }
            });
            expect(nouvelle.typeOperation).not.toBe(TYPES_OPERATION_ENUM.CREDIT);
        });

        test('période Actifs / Investissements : forcée à Mensuelle dans l\'opération sauvegardée, contexte inchangé', async () => {
            const user = userEvent.setup();
            const nouvelle = createNewOperation();
            renderPage({ operations: { nouvelle } });

            await saisirDescription(user, 'Achat ETF');
            await choisirCategorie(user, 'Bourse');
            // Bloc « Période » masqué pour la catégorie Actifs / Investissements
            expect(screen.queryByText('Période')).not.toBeInTheDocument();
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({
                mensualite: { periode: PERIODES_MENSUALITE_ENUM.MENSUELLE },
                ssCategorie: { type: TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES }
            });
            expect(nouvelle.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.PONCTUELLE);
        });

    });

    describe('défauts historiques corrigés par le lot 3', () => {

        // L'ancien évaluateur (eval dynamique) avalait l'erreur de l'expression "abc" : le montant était accepté (enregistré à 0)
        test('montant non numérique "abc" : refusé avec une erreur de montant', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), 'abc');
            await saisirDescription(user, 'X');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(saveOperation).not.toHaveBeenCalled();
            expect(await screen.findByText('Le champ Montant est incorrect')).toBeInTheDocument();
        });

        // Sécurité (lot 4a) : le champ Montant n'exécute jamais la saisie
        test.each(['1);alert(1);(', 'alert(1)', 'constructor', '1%2', '2**3', '9'.repeat(101)])(
            'montant "%s" (injection / caractère interdit / trop long) : refusé, rien n\'est sauvegardé', async (saisie) => {
            const user = userEvent.setup();
            const alertMock = vi.fn();
            vi.stubGlobal('alert', alertMock);
            vi.spyOn(console, 'error').mockImplementation(() => undefined);
            try {
                renderPage({ operations: { nouvelle: createNewOperation() } });

                await user.clear(montant());
                // paste : évite d'interpréter les caractères spéciaux de la saisie par user-event
                await user.click(montant());
                await user.paste(saisie);
                await saisirDescription(user, 'X');
                await choisirCategorie(user, 'Courses');
                await user.click(boutonValider());

                expect(await screen.findByText('Le champ Montant est incorrect')).toBeInTheDocument();
                expect(saveOperation).not.toHaveBeenCalled();
                expect(alertMock).not.toHaveBeenCalled();
            } finally {
                vi.unstubAllGlobals();
            }
        });

        test('montant "10+5" : évalué à 15 et sauvegardé (dépense -> -15)', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '10+5');
            await saisirDescription(user, 'X');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(dernierSave()[0].valeur).toBe(-15);
        });

        test('montant "10/3" : résultat arrondi à 2 décimales avant sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '10/3');
            await saisirDescription(user, 'X');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(dernierSave()[0].valeur).toBe(-3.33);
        });

        // Le champ montant est non contrôlé (`defaultValue`) : il est remonté (key=resetKey) à chaque sélection d'opération
        test('création A -> création B : le montant affiché est remis à zéro', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { n1: createNewOperation(), n2: createNewOperation() } });

            await user.clear(montant());
            await user.type(montant(), '77');
            await user.click(screen.getByRole('button', { name: 'select n2' }));

            expect(montant()).toHaveValue('0');
        });

        // Un libellé purement numérique était remplacé par `event.target.textContent` (vide pour un <input>)
        test('libellé purement numérique ("2024") : conservé à la validation', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await saisirDescription(user, '2024');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(dernierSave()[0].libelle).toBe('2024');
        });

        // La date du jour choisie par « Valider l'opération » en création était réécrasée par validateForm
        test('création + Valider l\'opération : la date du jour est transmise à la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(screen.getByRole('button', { name: 'Valider l\'opération' }));
            await saisirDescription(user, 'X');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({ etat: OPERATION_ETATS_ENUM.REALISEE });
            expect(dernierSave()[0].autresInfos.dateOperation).toBeInstanceOf(Date);
        });

        test('création + Reporter : état REPORTEE sans date d\'opération transmis à la sauvegarde', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(screen.getByRole('button', { name: 'Reporter l\'opération' }));
            await saisirDescription(user, 'X');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(dernierSave()[0]).toMatchObject({ etat: OPERATION_ETATS_ENUM.REPORTEE });
            expect(dernierSave()[0].autresInfos.dateOperation).toBeNull();
        });

        test('erreurs de validation affichées puis formulaire corrigé : les erreurs disparaissent', async () => {
            const user = userEvent.setup();
            renderPage({ operations: { nouvelle: createNewOperation() } });

            await user.click(boutonValider());
            expect(await screen.findByText('Le champ Description est obligatoire')).toBeInTheDocument();

            await saisirDescription(user, 'Corrigé');
            await choisirCategorie(user, 'Courses');
            await user.click(boutonValider());

            expect(saveOperation).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(screen.queryByText('Le champ Description est obligatoire')).not.toBeInTheDocument());
        });
    });
});
