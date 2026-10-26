import { afterEach, describe, expect, test, vi } from 'vitest';

import { EQUATION_MAX_DEPTH, EQUATION_MAX_LENGTH, evaluateEquation } from './Equation.utils.ts';

describe('evaluateEquation - expressions valides', () => {

    test.each([
        ['12,5', 12.5],
        ['12.5', 12.5],
        ['.5', 0.5],
        [',5', 0.5],
        ['5.', 5],
        ['5,', 5],
        ['42', 42],
        ['1+2*3', 7],
        ['(1+2)*3', 9],
        ['10 - -3', 13],
        ['-5', -5],
        ['+5', 5],
        ['--5', 5],
        ['10/4', 2.5],
        ['2*3,5', 7],
        ['((2))', 2],
        ['  1 + 2  ', 3],
        ['10-4-3', 3],
        ['100/10/2', 5],
        ['-(2+3)', -5],
        ['2*-3', -6]
    ])('"%s" = %d', (saisie, attendu) => {
        expect(evaluateEquation(saisie)).toBeCloseTo(attendu, 10);
    });

    test('espaces insécables (U+00A0) et tabulations ignorés', () => {
        expect(evaluateEquation('1 + 2')).toBe(3);
        expect(evaluateEquation('\t1\t+\t2\t')).toBe(3);
        expect(evaluateEquation('1 + 2')).toBe(3);
    });

    test('priorité des opérateurs et associativité gauche', () => {
        expect(evaluateEquation('2+3*4-6/2')).toBe(11);
        expect(evaluateEquation('8-2-1')).toBe(5);
    });
});

describe('evaluateEquation - expressions malformées', () => {

    test.each([
        ['vide', ''],
        ['espaces seuls', '   '],
        ['opérateur final', '1+'],
        ['parenthèse non fermée', '(1'],
        ['parenthèse fermante orpheline', '1)'],
        ['deux nombres sans opérateur', '1 2'],
        ['parenthèses vides', '()'],
        ['lettres', 'abc'],
        ['notation exponentielle', '1e5'],
        ['modulo', '1%2'],
        ['puissance', '2**3'],
        ['séparateur de milliers (espace)', '1 000'],
        ['opérateur initial binaire', '*5'],
        ['point seul', '.'],
        ['deux séparateurs décimaux', '1.2.3'],
        ['séparateurs mixtes', '1,2,3'],
        ['opérateurs consécutifs', '1**2'],
        ['division consécutive', '1//2']
    ])('%s ("%s") : lève une erreur', (_libelle, saisie) => {
        expect(() => evaluateEquation(saisie)).toThrow();
    });

    test('entrée non chaîne : lève une erreur', () => {
        expect(() => evaluateEquation(undefined as unknown as string)).toThrow();
        expect(() => evaluateEquation(null as unknown as string)).toThrow();
        expect(() => evaluateEquation(12 as unknown as string)).toThrow();
    });
});

describe('evaluateEquation - injection de code', () => {

    const injections = [
        '1);alert(1);(',
        'constructor',
        'window',
        'this',
        'alert(1)',
        '1;2',
        '"1"',
        '`1`',
        '__proto__',
        'globalThis',
        "import('x')",
        '1+constructor.constructor("return 1")()',
        '${1}',
        '1//comment',
        '1/*c*/'
    ];

    afterEach(() => {
        vi.unstubAllGlobals();
        delete (globalThis as Record<string, unknown>).__equationPwned;
    });

    test.each(injections)('"%s" est refusé', (saisie) => {
        expect(() => evaluateEquation(saisie)).toThrow();
    });

    test('aucune injection n\'a d\'effet de bord (global posé non modifié, alert non appelé)', () => {
        const alertMock = vi.fn();
        vi.stubGlobal('alert', alertMock);
        (globalThis as Record<string, unknown>).__equationPwned = 'intact';

        for (const saisie of [
            ...injections,
            '__equationPwned',
            '__equationPwned=1',
            'globalThis.__equationPwned=1',
            '1);globalThis.__equationPwned=1;('
        ]) {
            expect(() => evaluateEquation(saisie)).toThrow();
        }

        expect(alertMock).not.toHaveBeenCalled();
        expect((globalThis as Record<string, unknown>).__equationPwned).toBe('intact');
    });
});

describe('evaluateEquation - limites', () => {

    test('constantes de limite', () => {
        expect(EQUATION_MAX_LENGTH).toBe(100);
        expect(EQUATION_MAX_DEPTH).toBe(10);
    });

    test('100 caractères accepté, 101 refusé', () => {
        expect(evaluateEquation('1' + ' '.repeat(EQUATION_MAX_LENGTH - 1))).toBe(1);
        expect(() => evaluateEquation('1' + ' '.repeat(EQUATION_MAX_LENGTH))).toThrow(/longue/);
    });

    test('très longue saisie refusée sans parcours', () => {
        expect(() => evaluateEquation('9'.repeat(10_000))).toThrow(/longue/);
    });

    test('10 niveaux de parenthèses acceptés, 11 refusés', () => {
        const imbriquee = (n: number) => '('.repeat(n) + '1' + ')'.repeat(n);
        expect(evaluateEquation(imbriquee(EQUATION_MAX_DEPTH))).toBe(1);
        expect(() => evaluateEquation(imbriquee(EQUATION_MAX_DEPTH + 1))).toThrow(/imbriqu/);
    });

    test('signes unaires répétés : 10 acceptés, 11 refusés', () => {
        expect(evaluateEquation('-'.repeat(EQUATION_MAX_DEPTH) + '5')).toBe(5);
        expect(() => evaluateEquation('-'.repeat(EQUATION_MAX_DEPTH + 1) + '5')).toThrow(/imbriqu/);
        expect(() => evaluateEquation('+'.repeat(EQUATION_MAX_DEPTH + 1) + '5')).toThrow(/imbriqu/);
    });

    test('profondeur mixte parenthèses + unaires cumulée', () => {
        expect(() => evaluateEquation('-'.repeat(6) + '('.repeat(6) + '1' + ')'.repeat(6))).toThrow(/imbriqu/);
    });
});

describe('evaluateEquation - cas mathématiques', () => {

    test.each(['1/0', '0/0', '1/(1-1)', '5/0.0', '-1/0'])('"%s" : division par zéro refusée', (saisie) => {
        expect(() => evaluateEquation(saisie)).toThrow();
    });

    // La garde `Number.isFinite` finale est défensive : avec 100 caractères max le résultat ne peut pas dépasser ~1e100
    test('très grand résultat reste fini et accepté dans la limite de 100 caractères', () => {
        const resultat = evaluateEquation(Array(9).fill('9'.repeat(10)).join('*'));
        expect(Number.isFinite(resultat)).toBe(true);
        expect(resultat).toBeGreaterThan(1e80);
    });
});

describe('evaluateEquation - Unicode', () => {

    test.each([
        ['chiffres arabes-indiens', '١٢'],
        ['chiffres pleine largeur', '１２'],
        ['signe multiplication ×', '2×3'],
        ['signe division ÷', '6÷2'],
        ['moins typographique −', '5−3'],
        ['plus pleine largeur', '1＋2'],
        ['chiffres devanagari', '१२']
    ])('%s refusé', (_libelle, saisie) => {
        expect(() => evaluateEquation(saisie)).toThrow();
    });
});
