import {afterEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {getOperationLibelle} from './OperationItem.renderer.tsx';
import SharedOperationItem from '../../Components/budgets/operations/courantes/OperationsListItem.shared.tsx';
import CompteBancaireModel from '../../Models/budgets/CompteBancaire.model.ts';
import OperationModel from '../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../AppBusinessEnums.constants.ts';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

const comptes = [{id: 'cpt1', libelle: 'Livret A', itemIcon: 'livret.png'}] as unknown as CompteBancaireModel[];

// Contexte budget : seule la liste des comptes est utilisée par la ligne
vi.mock('../../Models/contextProvider/BudgetContextProvider.tsx', () => ({
    useBudgetContext: () => ({
        comptes: [{id: 'cpt1', libelle: 'Livret A', itemIcon: 'livret.png'}],
    }),
}));

const setTouch = (touch: boolean) => {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches: touch && query === TOUCH_QUERY,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
    }));
};

const operation = (libelle: string): OperationModel => ({
    id: 'op1', libelle, valeur: -50, etat: OPERATION_ETATS_ENUM.REALISEE, statuts: [],
    categorie: {id: 'c1', libelle: 'Virements'}, ssCategorie: {id: 's1', libelle: 'Interne'},
} as unknown as OperationModel);

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('Libellé intercompte - infobulle', () => {
    test('hors tactile : le survol affiche « Transfert intercompte vers Livret A »', async () => {
        render(getOperationLibelle('[vers cpt1]Virement', comptes, false, false));
        await userEvent.hover(screen.getByText('Virement'));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Transfert intercompte vers Livret A');
    });

    test('hors tactile : « depuis » reflète la direction', async () => {
        render(getOperationLibelle('[depuis cpt1]Virement', comptes, false, false));
        await userEvent.hover(screen.getByText('Virement'));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Transfert intercompte depuis Livret A');
    });

    test('tactile : le tap ouvre l\'infobulle', async () => {
        setTouch(true);
        render(getOperationLibelle('[vers cpt1]Virement', comptes, false, false));
        await userEvent.click(screen.getByText('Virement'));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Transfert intercompte vers Livret A');
    });

    test('tactile : le tap ouvre l\'infobulle ET appelle le onClick de la ligne', async () => {
        setTouch(true);
        const onClick = vi.fn();
        render(<SharedOperationItem operation={operation('[vers cpt1]Virement')} onClick={onClick}
                                    getBorderColor={() => '#123456'}/>);
        await userEvent.click(screen.getByText('Virement'));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Transfert intercompte vers Livret A');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('compte inconnu : pas d\'infobulle, même au tap', async () => {
        setTouch(true);
        render(getOperationLibelle('[vers inconnu]Virement', comptes, false, false));
        await userEvent.click(screen.getByText(/Virement/));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('libellé sans intercompte : pas d\'infobulle, même au tap', async () => {
        setTouch(true);
        render(getOperationLibelle('Loyer', comptes, false, false));
        await userEvent.click(screen.getByText('Loyer'));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
