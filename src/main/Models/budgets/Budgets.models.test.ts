import BudgetMensuelModel, {Soldes, TotauxParTypeCategorie} from './BudgetMensuel.model.ts';
import OperationModel, {AutresInfos, createNewOperation} from './Operation.model.ts';
import OperationEditionModel, {cloneOperation, createNewOperationEdition} from './OperationEdition.model.ts';
import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM, TYPES_CATEGORIES_OPERATION_ENUM, TYPES_OPERATION_ENUM} from '../../Utils/AppBusinessEnums.constants.ts';

describe('Budget models', () => {

    test('initialise BudgetMensuelModel avec les valeurs par défaut', () => {
        const model = new BudgetMensuelModel('b1', 'Budget Test');

        expect(model.id).toBe('b1');
        expect(model.libelle).toBe('Budget Test');
        expect(model.actif).toBeTruthy();
        expect(model.soldes.soldeAtMaintenant).toBe(0);
        expect(model.listeOperations).toEqual([]);
    });

    test('initialise Soldes et TotauxParTypeCategorie', () => {
        const soldes = new Soldes();
        const total = new TotauxParTypeCategorie('Essentiel', 120, 200);

        expect(soldes.soldeAtFinMoisCourant).toBe(0);
        expect(total.libelleCategorie).toBe('Essentiel');
        expect(total.totalAtMaintenant).toBe(120);
        expect(total.totalAtFinMoisCourant).toBe(200);
    });

    test('initialise OperationModel et AutresInfos', () => {
        const operation = new OperationModel(
            'op1',
            'Courses',
            TYPES_OPERATION_ENUM.DEPENSE,
            OPERATION_ETATS_ENUM.PREVUE,
            35,
            {periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE, prochaineEcheance: -1}
        );
        const infos = new AutresInfos(new Date('2026-02-01'));

        expect(operation.id).toBe('op1');
        expect(operation.categorie.libelle).toBe('');
        expect(operation.ssCategorie.type).toBe(TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL);
        expect(infos.dateOperation).toEqual(new Date('2026-02-01'));
    });

    test('createNewOperation retourne une opération attendue', () => {
        const operation = createNewOperation();

        expect(operation.id).toBe('-1');
        expect(operation.typeOperation).toBe(TYPES_OPERATION_ENUM.DEPENSE);
        expect(operation.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
        expect(operation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.PONCTUELLE);
        expect(operation.autresInfos.dateOperation).toBeNull();
    });

    test('cloneOperation et createNewOperationEdition fonctionnent', () => {
        const source = new OperationModel(
            'op-credit',
            'Salaire',
            TYPES_OPERATION_ENUM.CREDIT,
            OPERATION_ETATS_ENUM.REALISEE,
            1500,
            {periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE, prochaineEcheance: -1}
        );
        source.categorie = {id: 'cat1', libelle: 'Revenus'};
        source.ssCategorie = {id: 'ss1', libelle: 'Salaire', type: TYPES_CATEGORIES_OPERATION_ENUM.REVENUS};
        source.autresInfos.dateOperation = new Date('2026-02-02');
        source.intercompte = 'c2';

        const cloned = cloneOperation(source);
        const created = createNewOperationEdition();
        const constructorInstance = new OperationEditionModel(
            'id1',
            'Lib',
            TYPES_OPERATION_ENUM.DEPENSE,
            OPERATION_ETATS_ENUM.PREVUE,
            '10',
            {periode: PERIODES_MENSUALITE_ENUM.PONCTUELLE}
        );

        expect(cloned.id).toBe('op-credit');
        expect(cloned.valeur).toBe('1500');
        expect(cloned.categorie.id).toBe('cat1');
        expect(created.id).toBe('-1');
        expect(constructorInstance.libelle).toBe('Lib');
    });
});
