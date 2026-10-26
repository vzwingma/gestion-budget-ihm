import { describe, expect, test } from 'vitest';

import {
    applyActifInvest,
    applyCategorieParente,
    applyDefaut,
    applyEtatInCreation,
    applyRentreeArgent,
    fillCategorieForm,
    fillOperationField,
    openField
} from './OperationDetailPage.controller.ts';
import { createEmptyEditForm, OPERATION_EDITION_FORM } from './OperationDetailPage.constants.ts';
import { buildCategories, buildOperation } from './OperationDetailPage.testutils.tsx';
import OperationEditionModel, { cloneOperation } from '../../../../../Models/budgets/OperationEdition.model.ts';
import {
    BUSINESS_GUID,
    OPERATION_ETATS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from '../../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Fonctions pures du controller (AP 006 lot 3) : chacune renvoie une NOUVELLE copie de l'opération en édition
 * et ne modifie jamais son argument.
 */
function edition(): OperationEditionModel {
    return cloneOperation(buildOperation());
}

/** Fige une copie pour vérifier ensuite que l'original n'a pas été modifié */
const instantane = (e: OperationEditionModel) => JSON.stringify(e);

describe('applyEtatInCreation', () => {
    test('copie avec état + date d\'opération, original inchangé', () => {
        const original = edition();
        const avant = instantane(original);
        const date = new Date('2026-10-01');

        const copie = applyEtatInCreation(original, OPERATION_ETATS_ENUM.REALISEE, date);

        expect(copie).not.toBe(original);
        expect(copie.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(copie.autresInfos.dateOperation).toBe(date);
        expect(instantane(original)).toBe(avant);
    });

    test('date nulle (état prévu / reporté) : date effacée', () => {
        const original = edition();
        original.autresInfos.dateOperation = new Date('2026-10-01');

        const copie = applyEtatInCreation(original, OPERATION_ETATS_ENUM.REPORTEE, null);

        expect(copie.autresInfos.dateOperation).toBeNull();
        expect(original.autresInfos.dateOperation).not.toBeNull();
    });
});

describe('applyCategorieParente', () => {
    test('avec catégorie parente : catégorie + sous-catégorie mises à jour sur une copie', () => {
        const original = edition();
        const avant = instantane(original);
        const ssCat = { id: 'ss-salaire', libelle: 'Salaire', type: TYPES_CATEGORIES_OPERATION_ENUM.REVENUS, categorieParente: { id: 'cat-x', libelle: 'Rentrées' } };

        const copie = applyCategorieParente(original, ssCat);

        expect(copie.categorie).toEqual({ id: 'cat-x', libelle: 'Rentrées' });
        expect(copie.ssCategorie).toEqual({ id: 'ss-salaire', libelle: 'Salaire', type: TYPES_CATEGORIES_OPERATION_ENUM.REVENUS });
        expect(instantane(original)).toBe(avant);
    });

    test('sans catégorie parente : catégorie inchangée, sous-catégorie mise à jour', () => {
        const original = edition();

        const copie = applyCategorieParente(original, { id: 'ss-orpheline', libelle: 'Orpheline' });

        expect(copie.categorie).toEqual(original.categorie);
        expect(copie.ssCategorie).toMatchObject({ id: 'ss-orpheline', libelle: 'Orpheline' });
    });
});

describe('applyRentreeArgent / applyActifInvest / applyDefaut', () => {
    test('applyRentreeArgent : CREDIT + REVENUS, période inchangée', () => {
        const original = edition();
        const avant = instantane(original);

        const copie = applyRentreeArgent(original);

        expect(copie.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
        expect(copie.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.REVENUS);
        expect(copie.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.PONCTUELLE);
        expect(instantane(original)).toBe(avant);
    });

    test('applyActifInvest : CREDIT + ECONOMIES + période MENSUELLE forcée sur la copie uniquement', () => {
        const original = edition();
        const avant = instantane(original);

        const copie = applyActifInvest(original);

        expect(copie.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
        expect(copie.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES);
        expect(copie.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
        expect(original.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.PONCTUELLE);
        expect(instantane(original)).toBe(avant);
    });

    test('applyDefaut : DEPENSE', () => {
        const original = edition();
        original.typeOperation = TYPES_OPERATION_ENUM.CREDIT;

        const copie = applyDefaut(original);

        expect(copie.typeOperation).toBe(TYPES_OPERATION_ENUM.DEPENSE);
        expect(original.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
    });
});

describe('fillCategorieForm', () => {
    const categories = buildCategories();

    test('sous-catégorie inconnue : même référence renvoyée (aucun changement)', () => {
        const original = edition();

        expect(fillCategorieForm(original, 'id-inconnu', categories)).toBe(original);
    });

    test('catégories sans sous-catégories : sous-catégorie introuvable', () => {
        const original = edition();

        expect(fillCategorieForm(original, 'ss-courses', [{ id: 'vide', libelle: 'Vide' }])).toBe(original);
    });

    test('Rentrées d\'argent : crédit / revenus', () => {
        const copie = fillCategorieForm(edition(), 'ss-salaire', categories);

        expect(copie.categorie.id).toBe(BUSINESS_GUID.CAT_RENTREE_ARGENT);
        expect(copie.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
        expect(copie.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.REVENUS);
    });

    test('Actifs / Investissements : crédit / économies / mensuel', () => {
        const copie = fillCategorieForm(edition(), 'ss-bourse', categories);

        expect(copie.categorie.id).toBe(BUSINESS_GUID.CAT_ACTIFS_INVEST);
        expect(copie.typeOperation).toBe(TYPES_OPERATION_ENUM.CREDIT);
        expect(copie.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES);
        expect(copie.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
    });

    test('autre catégorie : dépense, type de la sous-catégorie conservé', () => {
        const original = edition();
        original.typeOperation = TYPES_OPERATION_ENUM.CREDIT;

        const copie = fillCategorieForm(original, 'ss-resto', categories);

        expect(copie.typeOperation).toBe(TYPES_OPERATION_ENUM.DEPENSE);
        expect(copie.ssCategorie).toMatchObject({ id: 'ss-resto', type: TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR });
    });
});

describe('fillOperationField', () => {
    const categories = buildCategories();

    test('CATEGORIE avec valeur vide : même référence', () => {
        const original = edition();

        expect(fillOperationField(original, OPERATION_EDITION_FORM.CATEGORIE, '', categories)).toBe(original);
    });

    test('CATEGORIE : délègue à fillCategorieForm', () => {
        const copie = fillOperationField(edition(), OPERATION_EDITION_FORM.CATEGORIE, 'ss-salaire', categories);

        expect(copie.ssCategorie.id).toBe('ss-salaire');
    });

    test.each([
        [OPERATION_EDITION_FORM.LIBELLE, 'Nouveau', (e: OperationEditionModel) => e.libelle, 'Nouveau'],
        [OPERATION_EDITION_FORM.VALUE, '12.5', (e: OperationEditionModel) => e.valeur, '12.5'],
        [OPERATION_EDITION_FORM.INTERCOMPTES, 'compte-2', (e: OperationEditionModel) => e.intercompte, 'compte-2'],
        [OPERATION_EDITION_FORM.MENSUALITE, PERIODES_MENSUALITE_ENUM.ANNUELLE, (e: OperationEditionModel) => e.mensualite.periode, PERIODES_MENSUALITE_ENUM.ANNUELLE],
        [OPERATION_EDITION_FORM.CATEGORIE_TYPE, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR, (e: OperationEditionModel) => e.ssCategorie.type, TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR]
    ] as const)('champ %s : valeur "%s" appliquée sur une copie', (champ, valeur, lire, attendu) => {
        const original = edition();
        const avant = instantane(original);

        const copie = fillOperationField(original, champ, valeur, categories);

        expect(copie).not.toBe(original);
        expect(lire(copie)).toBe(attendu);
        expect(instantane(original)).toBe(avant);
    });

    test('MENSUALITE inconnue : première période de l\'énumération', () => {
        const copie = fillOperationField(edition(), OPERATION_EDITION_FORM.MENSUALITE, 'inconnue', categories);

        expect(copie.mensualite.periode).toBe(Object.values(PERIODES_MENSUALITE_ENUM)[0]);
    });

    test('CATEGORIE_TYPE inconnu : type indéfini', () => {
        const copie = fillOperationField(edition(), OPERATION_EDITION_FORM.CATEGORIE_TYPE, 'inconnu', categories);

        expect(copie.ssCategorie.type).toBeUndefined();
    });

    test.each([
        [OPERATION_EDITION_FORM.DATE_OPERATION, 'dateOperation'],
        [OPERATION_EDITION_FORM.DATE_FIN, 'dateFin']
    ] as const)('%s : date analysée, vide -> null, sans modifier l\'original', (champ, cible) => {
        const original = edition();
        original.autresInfos.dateOperation = new Date('2020-01-01');
        original.mensualite.dateFin = new Date('2020-01-01');
        const lire = (e: OperationEditionModel) => cible === 'dateOperation' ? e.autresInfos.dateOperation : e.mensualite.dateFin;

        const avecDate = fillOperationField(original, champ, '2026-10-05', categories);
        const sansDate = fillOperationField(original, champ, '', categories);

        expect(lire(avecDate)).toEqual(new Date(Date.parse('2026-10-05')));
        expect(lire(sansDate)).toBeNull();
        expect(lire(original)).toEqual(new Date('2020-01-01'));
    });

    test('champ non géré : copie identique en valeur', () => {
        const original = edition();

        const copie = fillOperationField(original, OPERATION_EDITION_FORM.FORM, 'x', categories);

        expect(copie).toEqual(original);
        expect(copie).not.toBe(original);
    });
});

describe('openField', () => {
    test.each([
        [OPERATION_EDITION_FORM.VALUE, 'value'],
        [OPERATION_EDITION_FORM.LIBELLE, 'libelle'],
        [OPERATION_EDITION_FORM.CATEGORIE_TYPE, 'categorieType'],
        [OPERATION_EDITION_FORM.DATE_OPERATION, 'dateOperation'],
        [OPERATION_EDITION_FORM.MENSUALITE, 'mensualite'],
        [OPERATION_EDITION_FORM.DATE_FIN, 'dateFin']
    ] as const)('id %s : ouvre le champ %s sans modifier le formulaire reçu', (id, champ) => {
        const original = createEmptyEditForm(false);

        const ouvert = openField(original, id);

        expect(ouvert).toEqual({ ...original, [champ]: true });
        expect(original[champ]).toBe(false);
    });

    test('id inconnu : copie sans changement', () => {
        const original = createEmptyEditForm(false);

        const ouvert = openField(original, 'AUTRE');

        expect(ouvert).toEqual(original);
        expect(ouvert).not.toBe(original);
    });
});
