import { describe, expect, test } from 'vitest';

import { resolveCreatedOperation } from './OperationDetailPage.controller.ts';
import { buildBudget, buildOperation } from './OperationDetailPage.testutils.tsx';
import BudgetMensuelModel from '../../../../../Models/budgets/BudgetMensuel.model.ts';
import OperationModel from '../../../../../Models/budgets/Operation.model.ts';

/**
 * AP 012 (issue #759) : `resolveCreatedOperation` retrouve l'opération créée (id attribué par le backend)
 * dans le budget retourné. Fonction pure : aucun argument muté.
 */
function budgetAvec(...operations: OperationModel[]): BudgetMensuelModel {
    const budget = buildBudget();
    budget.listeOperations = operations;
    return budget;
}

const existante = () => buildOperation({ id: 'op-existante', libelle: 'Loyer' });
const date = new Date(2026, 9, 5);
/** Brouillon : id client (uuid) inconnu du backend */
const brouillon = () => {
    const draft = buildOperation({ id: 'uuid-client', libelle: 'Cinéma', valeur: -12 });
    draft.autresInfos.dateOperation = date;
    return draft;
};
/** Opération telle que renvoyée par le backend (id différent) */
const cote_backend = (id: string, overrides: Partial<OperationModel> = {}) => {
    const operation = buildOperation({ id, libelle: 'Cinéma', valeur: -12, ...overrides });
    operation.autresInfos.dateOperation = date;
    return operation;
};

describe('resolveCreatedOperation', () => {

    test('un seul id nouveau : opération backend retenue (id backend, pas celui du brouillon)', () => {
        const avant = budgetAvec(existante());
        const maj = budgetAvec(existante(), cote_backend('id-backend'));

        const resultat = resolveCreatedOperation(avant, maj, brouillon());

        expect(resultat?.id).toBe('id-backend');
        expect(resultat?.libelle).toBe('Cinéma');
    });

    test('un seul id nouveau : retenu même si ses champs diffèrent du brouillon', () => {
        const avant = budgetAvec(existante());
        const maj = budgetAvec(existante(), cote_backend('id-backend', { libelle: 'Libellé normalisé' }));

        expect(resolveCreatedOperation(avant, maj, brouillon())?.id).toBe('id-backend');
    });

    test('résultat = copie : ni l\'opération du budget ni les arguments ne sont mutés', () => {
        const avant = budgetAvec(existante());
        const creee = cote_backend('id-backend');
        const maj = budgetAvec(existante(), creee);
        const draft = brouillon();
        const instantane = JSON.stringify([avant, maj, draft]);

        const resultat = resolveCreatedOperation(avant, maj, draft);

        expect(resultat).not.toBe(creee);
        expect(JSON.stringify([avant, maj, draft])).toBe(instantane);
    });

    test('plusieurs candidats : correspondance unique par libellé / montant / catégorie / date', () => {
        const avant = budgetAvec(existante());
        const autre = cote_backend('id-autre', { libelle: 'Autre libellé' });
        const maj = budgetAvec(existante(), autre, cote_backend('id-bon'));

        expect(resolveCreatedOperation(avant, maj, brouillon())?.id).toBe('id-bon');
    });

    test('plusieurs candidats : correspondance insensible au signe du montant et à l\'heure de la date', () => {
        const avant = budgetAvec();
        const bon = cote_backend('id-bon', { valeur: 12 });
        bon.autresInfos.dateOperation = new Date(2026, 9, 5, 18, 30);
        const maj = budgetAvec(cote_backend('id-autre', { libelle: 'X' }), bon);

        expect(resolveCreatedOperation(avant, maj, brouillon())?.id).toBe('id-bon');
    });

    test('plusieurs candidats : date au format ISO (chaîne) reconnue', () => {
        const avant = budgetAvec();
        const bon = cote_backend('id-bon');
        bon.autresInfos.dateOperation = new Date(2026, 9, 5, 12).toISOString() as unknown as Date;
        const maj = budgetAvec(cote_backend('id-autre', { libelle: 'X' }), bon);

        expect(resolveCreatedOperation(avant, maj, brouillon())?.id).toBe('id-bon');
    });

    test.each([
        ['montant', { valeur: -99 }],
        ['catégorie', { categorie: { id: 'cat-autre', libelle: 'Autre' } }],
        ['sous-catégorie', { ssCategorie: { id: 'ss-autre', libelle: 'Autre' } }]
    ])('plusieurs candidats dont un seul diffère par le %s : l\'autre est retenu', (_champ, override) => {
        const avant = budgetAvec();
        const maj = budgetAvec(cote_backend('id-different', override as Partial<OperationModel>), cote_backend('id-bon'));

        expect(resolveCreatedOperation(avant, maj, brouillon())?.id).toBe('id-bon');
    });

    test('plusieurs candidats dont la date diffère : l\'autre est retenu', () => {
        const different = cote_backend('id-different');
        different.autresInfos.dateOperation = new Date(2026, 9, 6);
        const maj = budgetAvec(different, cote_backend('id-bon'));

        expect(resolveCreatedOperation(budgetAvec(), maj, brouillon())?.id).toBe('id-bon');
    });

    test('plusieurs candidats, aucune correspondance : null', () => {
        const maj = budgetAvec(cote_backend('a', { libelle: 'A' }), cote_backend('b', { libelle: 'B' }));

        expect(resolveCreatedOperation(budgetAvec(), maj, brouillon())).toBeNull();
    });

    test('plusieurs candidats, correspondance ambiguë (doublons identiques) : null', () => {
        const maj = budgetAvec(cote_backend('a'), cote_backend('b'));

        expect(resolveCreatedOperation(budgetAvec(), maj, brouillon())).toBeNull();
    });

    test('plusieurs candidats : date invalide ou absente comparée comme absente', () => {
        const draft = brouillon();
        draft.autresInfos.dateOperation = null;
        const sansDate = cote_backend('id-sans-date');
        sansDate.autresInfos.dateOperation = 'pas une date' as unknown as Date;
        const avecDate = cote_backend('id-avec-date');
        const maj = budgetAvec(avecDate, sansDate);

        expect(resolveCreatedOperation(budgetAvec(), maj, draft)?.id).toBe('id-sans-date');
    });

    test('aucun id nouveau (budget inchangé) : null', () => {
        const avant = budgetAvec(existante());
        const maj = budgetAvec(existante());

        expect(resolveCreatedOperation(avant, maj, brouillon())).toBeNull();
    });

    test('budget retourné null / undefined : null', () => {
        expect(resolveCreatedOperation(budgetAvec(existante()), null, brouillon())).toBeNull();
        expect(resolveCreatedOperation(budgetAvec(existante()), undefined, brouillon())).toBeNull();
    });

    test('liste d\'opérations du budget retourné vide ou absente : null', () => {
        const sansListe = buildBudget();
        (sansListe as any).listeOperations = undefined;

        expect(resolveCreatedOperation(budgetAvec(existante()), budgetAvec(), brouillon())).toBeNull();
        expect(resolveCreatedOperation(budgetAvec(existante()), sansListe, brouillon())).toBeNull();
    });

    test('budget précédent null / sans liste : toutes les opérations retournées sont candidates', () => {
        const maj = budgetAvec(cote_backend('id-backend'));
        const sansListe = buildBudget();
        (sansListe as any).listeOperations = undefined;

        expect(resolveCreatedOperation(null, maj, brouillon())?.id).toBe('id-backend');
        expect(resolveCreatedOperation(sansListe, maj, brouillon())?.id).toBe('id-backend');
    });
});
