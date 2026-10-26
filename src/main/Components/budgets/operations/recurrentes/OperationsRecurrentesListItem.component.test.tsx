import {describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import OperationRecurrenteItem from './OperationsRecurrentesListItem.component.tsx';
import {createNewOperation} from '../../../../Models/budgets/Operation.model.ts';

// SharedOperationItem mocké : on vérifie uniquement les props transmises par la tuile récurrente
const sharedProps = vi.hoisted(() => ({last: undefined as undefined | Record<string, unknown>}));
vi.mock('../courantes/OperationsListItem.shared.tsx', () => ({
    default: (props: Record<string, unknown>) => {
        sharedProps.last = props;
        return <div>shared</div>;
    }
}));

describe('OperationRecurrenteItem', () => {
    test('transmet ringMeaning="periode" à SharedOperationItem', () => {
        render(<OperationRecurrenteItem operation={createNewOperation()} onClick={vi.fn()}/>);
        expect(screen.getByText('shared')).toBeInTheDocument();
        expect(sharedProps.last?.ringMeaning).toBe('periode');
    });
});
