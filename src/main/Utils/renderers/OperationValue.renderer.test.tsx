import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import OperationValue, {getStyleOperation} from './OperationValue.renderer.tsx';
import {OPERATION_ETATS_ENUM} from '../AppBusinessEnums.constants.ts';
import OperationModel from '../../Models/budgets/Operation.model.ts';

describe('OperationValue - explicitPlus', () => {
    test('« + » devant une valeur positive', () => {
        render(<OperationValue id="v" valueOperation={12.5} showSign={true} explicitPlus={true}/>);
        expect(screen.getByText(/^\+12[,.]50 €$/)).toBeInTheDocument();
    });

    test('pas de « + » pour zéro', () => {
        render(<OperationValue id="v" valueOperation={0} showSign={true} explicitPlus={true}/>);
        expect(screen.getByText(/0[,.]00 €/).textContent).not.toContain('+');
    });

    test('pas de « + » pour une valeur négative (signe « - » conservé)', () => {
        render(<OperationValue id="v" valueOperation={-12.5} showSign={true} explicitPlus={true}/>);
        const el = screen.getByText(/12[,.]50 €/);
        expect(el.textContent).not.toContain('+');
        expect(el.textContent).toContain('-');
    });

    test('sans explicitPlus : pas de « + » sur un positif', () => {
        render(<OperationValue id="v" valueOperation={12.5} showSign={true}/>);
        expect(screen.getByText(/12[,.]50 €/).textContent).not.toContain('+');
    });

    test('explicitPlus ignoré si showSign=false (valeur absolue)', () => {
        render(<OperationValue id="v" valueOperation={12.5} showSign={false} explicitPlus={true}/>);
        expect(screen.getByText(/12[,.]50 €/).textContent).not.toContain('+');
    });

    test('showSign=false : valeur négative affichée en absolu', () => {
        render(<OperationValue id="v" valueOperation={-3} showSign={false}/>);
        expect(screen.getByText(/3[,.]00 €/).textContent).not.toContain('-');
    });

    test('chiffres tabulaires en style inline', () => {
        render(<OperationValue id="v" valueOperation={5} showSign={true}/>);
        expect(screen.getByText(/5[,.]00 €/).style.fontVariantNumeric).toBe('tabular-nums');
    });

    test('valeur null -> « Non initialisé »', () => {
        render(<OperationValue id="v" valueOperation={null} showSign={true} explicitPlus={true}/>);
        expect(screen.getByText('Non initialisé')).toBeInTheDocument();
    });
});

describe('getStyleOperation', () => {
    test('classes crédit / dépense / neutre / annulée', () => {
        expect(getStyleOperation(5)).toBe('text-CREDIT');
        expect(getStyleOperation(-5)).toBe('text-DEPENSE');
        expect(getStyleOperation(0)).toBe('');
        expect(getStyleOperation(null)).toBe('');
        expect(getStyleOperation(5, {etat: OPERATION_ETATS_ENUM.ANNULEE} as OperationModel)).toBe('text-ANNULEE ');
    });
});
