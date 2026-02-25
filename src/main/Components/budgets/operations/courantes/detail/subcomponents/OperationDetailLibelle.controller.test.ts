import {
    evaluatePendingLibelle,
    getOperationLibelleInEdition,
    prioritySort,
    validateDescription
} from './OperationDetailLibelle.controller.ts';

describe('OperationDetailLibelle.controller', () => {

    test('valide la description obligatoire', () => {
        const errors = {libelle: null} as any;
        const operation = {libelle: 'Ancien'} as any;

        validateDescription({libelle: ''} as any, operation, errors);
        expect(errors.libelle).toBeTruthy();

        validateDescription({libelle: 'Nouveau'} as any, operation, errors);
        expect(errors.libelle).toBeNull();
        expect(operation.libelle).toBe('Nouveau');
    });

    test('extrait le libellé en mode intercompte', () => {
        expect(getOperationLibelleInEdition({libelle: '[vers Compte B]Virement'} as any)).toBe('Virement');
        expect(getOperationLibelleInEdition({libelle: 'Restaurant'} as any)).toBe('Restaurant');
    });

    test('évalue la saisie du libellé selon la touche', () => {
        let pending = 'Abc';
        pending = evaluatePendingLibelle({key: 'Backspace'}, pending);
        expect(pending).toBe('Ab');

        pending = evaluatePendingLibelle({key: ' '}, pending);
        expect(pending).toBe('Ab ');

        pending = evaluatePendingLibelle({key: 'x'}, pending);
        expect(pending).toBe('Ab x');

        pending = evaluatePendingLibelle({key: 'Escape'}, pending);
        expect(pending).toBe('');

        pending = evaluatePendingLibelle({key: 'Delete'}, 'abc');
        expect(pending).toBe('');

        expect(evaluatePendingLibelle({key: 'Enter'}, 'abc')).toBe('abc');
    });

    test('priorise le tri sur le préfixe saisi', () => {
        const a = {libelle: 'abricot'} as any;
        const b = {libelle: 'banane'} as any;
        const c = {libelle: 'abc'} as any;

        expect(prioritySort(a, b, 'ab')).toBe(-1);
        expect(prioritySort(a, c, 'a')).toBeGreaterThan(0);
        expect(prioritySort(b, a, 'z')).toBeGreaterThan(0);
    });
});
