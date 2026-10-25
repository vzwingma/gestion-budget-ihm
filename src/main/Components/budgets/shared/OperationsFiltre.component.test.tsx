import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OperationsFiltre from './OperationsFiltre.component.tsx';

describe('OperationsFiltre', () => {
    const onFilterChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche la valeur courante', () => {
        render(<OperationsFiltre filterValue="abc" onFilterChange={onFilterChange}/>);
        const input = screen.getByLabelText('Filtrage des opérations') as HTMLInputElement;
        expect(input.value).toBe('abc');
    });

    test('placeholder personnalisé', () => {
        render(<OperationsFiltre filterValue="" onFilterChange={onFilterChange} placeholder="Chercher"/>);
        expect(screen.getByLabelText('Chercher')).toBeInTheDocument();
    });

    test('la saisie appelle onFilterChange avec la valeur', async () => {
        render(<OperationsFiltre filterValue="" onFilterChange={onFilterChange}/>);
        await userEvent.type(screen.getByLabelText('Filtrage des opérations'), 'x');
        expect(onFilterChange).toHaveBeenCalledWith('x');
    });

    test('bouton effacer : accessible et de type button', () => {
        render(<OperationsFiltre filterValue="abc" onFilterChange={onFilterChange}/>);
        const btn = screen.getByRole('button', {name: 'Effacer le filtre'});
        expect(btn).toHaveAttribute('type', 'button');
    });

    test('clic effacer : onFilterChange("") et input refocusé', async () => {
        render(<OperationsFiltre filterValue="abc" onFilterChange={onFilterChange}/>);
        await userEvent.click(screen.getByRole('button', {name: 'Effacer le filtre'}));
        expect(onFilterChange).toHaveBeenCalledTimes(1);
        expect(onFilterChange).toHaveBeenCalledWith('');
        expect(document.activeElement).toBe(screen.getByLabelText('Filtrage des opérations'));
    });

    test('clic effacer : pas de bubbling vers le parent', async () => {
        const parentClick = vi.fn();
        render(<div onClick={parentClick}><OperationsFiltre filterValue="abc" onFilterChange={onFilterChange}/></div>);
        await userEvent.click(screen.getByRole('button', {name: 'Effacer le filtre'}));
        expect(parentClick).not.toHaveBeenCalled();
    });

    test('clic effacer ne soumet pas le formulaire', async () => {
        const onSubmit = vi.fn((e: Event) => e.preventDefault());
        const {container} = render(<OperationsFiltre filterValue="abc" onFilterChange={onFilterChange}/>);
        container.querySelector('form')!.addEventListener('submit', onSubmit);
        await userEvent.click(screen.getByRole('button', {name: 'Effacer le filtre'}));
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
