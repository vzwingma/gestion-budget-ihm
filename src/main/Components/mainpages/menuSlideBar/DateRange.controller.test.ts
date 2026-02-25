import {handleModalClick, handleSelect} from './DateRange.controller.ts';

describe('DateRange.controller', () => {

    test('confirme via la modale et met à jour les mois', () => {
        const updateMonths = jest.fn();

        handleModalClick({target: {id: 'CONFIRMER'}}, new Date('2026-01-01'), new Date('2026-02-01'), updateMonths);

        expect(updateMonths).toHaveBeenCalledTimes(1);
    });

    test('sélection previous met à jour les dates', () => {
        const updateMonths = jest.fn();
        const setShowModale = jest.fn();

        handleSelect(
            {target: {id: 'previous'}},
            new Date('2026-01-01'),
            new Date('2026-02-01'),
            new Date('2026-03-01'),
            setShowModale as any,
            updateMonths
        );

        expect(updateMonths).toHaveBeenCalledTimes(1);
    });

    test('sélection next ouvre la modale si mois courant atteint', () => {
        const updateMonths = jest.fn();
        const setShowModale = jest.fn();

        handleSelect(
            {target: {id: 'next'}},
            new Date('2025-12-01'),
            new Date(),
            new Date('2026-03-01'),
            setShowModale as any,
            updateMonths
        );

        expect(setShowModale).toHaveBeenCalledWith(true);
    });

    test('sélection next confirme directement pour un ancien mois', () => {
        const updateMonths = jest.fn();
        const setShowModale = jest.fn();

        handleSelect(
            {target: {id: 'next'}},
            new Date('2025-09-01'),
            new Date('2025-10-01'),
            new Date('2025-11-01'),
            setShowModale as any,
            updateMonths
        );

        expect(updateMonths).toHaveBeenCalledTimes(1);
    });
});
