import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OperationItem from './courantes/OperationsListItem.component.tsx';
import OperationRecurrenteItem from './recurrentes/OperationsRecurrentesListItem.component.tsx';
import { createNewOperation } from '../../../Models/budgets/Operation.model.ts';

/**
 * AP 005 - T8 : React.memo sur OperationItem / OperationRecurrenteItem.
 * `SharedOperationItem` est mocké (compteur de rendus) : on vérifie que le rendu reste correct
 * et que memo évite le re-render à props identiques, mais re-rend si une prop change.
 */
const sharedRender = vi.fn();
vi.mock('./courantes/OperationsListItem.shared.tsx', () => ({
    default: (props: any) => {
        sharedRender(props);
        return <button data-testid="shared" data-border={props.getBorderColor(props.operation)}
            onClick={() => props.onClick(props.operation)}>{props.operation.libelle}</button>;
    }
}));

function buildOperation(id = 'op-1', libelle = 'Op test') {
    const op = createNewOperation();
    op.id = id;
    op.libelle = libelle;
    return op;
}

describe.each([
    ['OperationItem', OperationItem],
    ['OperationRecurrenteItem', OperationRecurrenteItem]
])('%s (React.memo)', (_name, Item: any) => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('rend l\'opération et propage le clic', async () => {
        const op = buildOperation();
        const onClick = vi.fn();
        render(<Item operation={op} onClick={onClick} />);

        const el = screen.getByTestId('shared');
        expect(el).toHaveTextContent('Op test');
        expect(el.getAttribute('data-border')).toBeTruthy();
        await userEvent.click(el);
        expect(onClick).toHaveBeenCalledWith(op);
    });

    test('ne re-rend pas avec les mêmes props', () => {
        const op = buildOperation();
        const onClick = vi.fn();
        const { rerender } = render(<Item operation={op} onClick={onClick} isSelected={false} />);
        rerender(<Item operation={op} onClick={onClick} isSelected={false} />);
        expect(sharedRender).toHaveBeenCalledTimes(1);
    });

    test('re-rend quand une prop change (isSelected)', () => {
        const op = buildOperation();
        const onClick = vi.fn();
        const { rerender } = render(<Item operation={op} onClick={onClick} isSelected={false} />);
        rerender(<Item operation={op} onClick={onClick} isSelected={true} />);
        expect(sharedRender).toHaveBeenCalledTimes(2);
        expect(sharedRender.mock.calls[1][0].isSelected).toBe(true);
    });

    test('re-rend quand l\'opération change', () => {
        const onClick = vi.fn();
        const { rerender } = render(<Item operation={buildOperation('a', 'Alpha')} onClick={onClick} />);
        rerender(<Item operation={buildOperation('b', 'Beta')} onClick={onClick} />);
        expect(screen.getByTestId('shared')).toHaveTextContent('Beta');
        expect(sharedRender).toHaveBeenCalledTimes(2);
    });
});
