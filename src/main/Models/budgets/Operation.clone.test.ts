import { describe, expect, test } from 'vitest';

import { cloneOperationModel, createNewOperation } from './Operation.model.ts';
import { cloneOperation, cloneOperationEdition, createNewOperationEdition } from './OperationEdition.model.ts';
import {
    OPERATION_ETATS_ENUM,
    OPERATION_STATUS_ENUM,
    PERIODES_MENSUALITE_ENUM,
    TYPES_CATEGORIES_OPERATION_ENUM,
    TYPES_OPERATION_ENUM
} from '../../Utils/AppBusinessEnums.constants.ts';

/**
 * Copies d'opérations (AP 006 lot 3) : l'opération du contexte ne doit jamais être aliasée par une copie de travail
 * ou un brouillon (les `Date` sont partagées par référence : remplacées, jamais modifiées en place).
 */
function operationComplete() {
    const operation = createNewOperation();
    operation.id = 'op-1';
    operation.libelle = 'Loyer';
    operation.typeOperation = TYPES_OPERATION_ENUM.DEPENSE;
    operation.valeur = -700;
    operation.categorie = { id: 'cat-1', libelle: 'Logement' };
    operation.ssCategorie = { id: 'ss-1', libelle: 'Loyer', type: undefined };
    operation.mensualite = { periode: PERIODES_MENSUALITE_ENUM.MENSUELLE, prochaineEcheance: 3, dateFin: new Date('2027-01-01') };
    operation.autresInfos.dateOperation = new Date('2026-10-05');
    operation.statuts = [OPERATION_STATUS_ENUM.EN_RETARD];
    return operation;
}

describe('cloneOperation (OperationModel -> OperationEditionModel)', () => {

    test('copie les champs, la valeur est signée selon le type puis exprimée en chaîne', () => {
        const edition = cloneOperation(operationComplete());

        expect(edition).toMatchObject({ id: 'op-1', libelle: 'Loyer', typeOperation: TYPES_OPERATION_ENUM.DEPENSE, etat: OPERATION_ETATS_ENUM.PREVUE, valeur: '700' });
        expect(edition.categorie).toEqual({ id: 'cat-1', libelle: 'Logement' });
        expect(edition.ssCategorie).toMatchObject({ id: 'ss-1', libelle: 'Loyer' });
    });

    test('copie profonde de mensualite : modifier la copie ne modifie pas l\'opération d\'origine', () => {
        const operation = operationComplete();
        const edition = cloneOperation(operation);

        expect(edition.mensualite).not.toBe(operation.mensualite);
        expect(edition.mensualite).toMatchObject({ periode: PERIODES_MENSUALITE_ENUM.MENSUELLE, dateFin: operation.mensualite.dateFin });
        edition.mensualite.periode = PERIODES_MENSUALITE_ENUM.ANNUELLE;
        edition.mensualite.dateFin = null;

        expect(operation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
        expect(operation.mensualite.dateFin).toEqual(new Date('2027-01-01'));
    });

    test('pas d\'aliasing des sous-objets categorie / ssCategorie / autresInfos', () => {
        const operation = operationComplete();
        const edition = cloneOperation(operation);

        expect(edition.categorie).not.toBe(operation.categorie);
        expect(edition.ssCategorie).not.toBe(operation.ssCategorie);
        expect(edition.autresInfos).not.toBe(operation.autresInfos);
        edition.categorie.libelle = 'Autre';
        edition.autresInfos.dateOperation = null;
        expect(operation.categorie.libelle).toBe('Logement');
        expect(operation.autresInfos.dateOperation).toEqual(new Date('2026-10-05'));
    });

    test('ssCategorie sans type : type par défaut ESSENTIEL ; crédit : valeur positive', () => {
        const operation = operationComplete();
        operation.typeOperation = TYPES_OPERATION_ENUM.CREDIT;
        operation.valeur = 12;

        const edition = cloneOperation(operation);

        expect(edition.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL);
        expect(edition.valeur).toBe('12');
    });

    test('createNewOperationEdition : opération vierge, en création', () => {
        const edition = createNewOperationEdition();

        expect(edition.id).toBe('-1');
        expect(edition.libelle).toBe('');
        expect(edition.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
    });
});

describe('cloneOperationEdition', () => {

    test('copie profonde de categorie, ssCategorie, mensualite, autresInfos ; dates partagées', () => {
        const edition = cloneOperation(operationComplete());
        const copie = cloneOperationEdition(edition);

        expect(copie).toEqual(edition);
        expect(copie).not.toBe(edition);
        expect(copie.categorie).not.toBe(edition.categorie);
        expect(copie.ssCategorie).not.toBe(edition.ssCategorie);
        expect(copie.mensualite).not.toBe(edition.mensualite);
        expect(copie.autresInfos).not.toBe(edition.autresInfos);
        expect(copie.autresInfos.dateOperation).toBe(edition.autresInfos.dateOperation);

        copie.mensualite.periode = PERIODES_MENSUALITE_ENUM.ANNUELLE;
        copie.ssCategorie.libelle = 'Autre';
        expect(edition.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
        expect(edition.ssCategorie.libelle).toBe('Loyer');
    });
});

describe('cloneOperationModel (brouillon)', () => {

    test('copie profonde : aucune propriété imbriquée partagée avec l\'opération d\'origine', () => {
        const operation = operationComplete();
        const brouillon = cloneOperationModel(operation);

        expect(brouillon).toEqual(operation);
        expect(brouillon).not.toBe(operation);
        expect(brouillon.categorie).not.toBe(operation.categorie);
        expect(brouillon.ssCategorie).not.toBe(operation.ssCategorie);
        expect(brouillon.mensualite).not.toBe(operation.mensualite);
        expect(brouillon.autresInfos).not.toBe(operation.autresInfos);
        expect(brouillon.statuts).not.toBe(operation.statuts);

        brouillon.libelle = 'Autre';
        brouillon.mensualite.periode = PERIODES_MENSUALITE_ENUM.ANNUELLE;
        brouillon.autresInfos.dateOperation = null;
        brouillon.statuts?.push(OPERATION_STATUS_ENUM.EN_RETARD);

        expect(operation.libelle).toBe('Loyer');
        expect(operation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.MENSUELLE);
        expect(operation.autresInfos.dateOperation).toEqual(new Date('2026-10-05'));
        expect(operation.statuts).toHaveLength(1);
    });

    test('statuts absents : conservés tels quels (undefined / null)', () => {
        const operation = createNewOperation();

        expect(cloneOperationModel(operation).statuts).toBeUndefined();
        operation.statuts = null;
        expect(cloneOperationModel(operation).statuts).toBeNull();
    });
});
