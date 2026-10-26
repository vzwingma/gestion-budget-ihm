import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailValeur, validateFormMontant } from './OperationDetailValeur.component.tsx';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';
import { createEmptyEditForm, createEmptyErrors } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { TYPES_OPERATION_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

describe('OperationDetailValeur - composant', () => {

    const fill = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('aucune opération : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={false} errorValeur={null} fillOperationForm={fill} />, { operation: null });

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    test('lecture : le montant est affiché dans un titre éditable (le montant formaté dépend de la locale)', () => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={false} errorValeur={null} fillOperationForm={fill} />);

        const titre = screen.getByRole('heading', { level: 4 });
        expect(titre).toHaveClass('editableField');
        expect(titre).toHaveTextContent('€');
        expect(titre).toHaveTextContent('50');
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    // DÉFAUT CONNU : `budgetActif = currentBudget` (l'objet, toujours truthy) au lieu de `currentBudget.actif`
    // -> le montant reste marqué éditable même sur un budget clos.
    test.fails('lecture sur budget clos : le montant est marqué désactivé', () => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={false} errorValeur={null} fillOperationForm={fill} />, { budget: buildBudget(false) });

        expect(screen.getByRole('heading', { level: 4 })).toHaveClass('editableField--disabled');
    });

    test('édition : champ Montant pré-rempli avec la valeur absolue de l\'opération', () => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={true} errorValeur={null} fillOperationForm={fill} />);

        expect(screen.getByRole('textbox', { name: /montant/i })).toHaveValue('50');
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    test.each([
        [TYPES_OPERATION_ENUM.DEPENSE, 'RemoveRoundedIcon', 'AddRoundedIcon'],
        [TYPES_OPERATION_ENUM.CREDIT, 'AddRoundedIcon', 'RemoveRoundedIcon']
    ])('édition : opération %s -> icône de signe %s', (type, presente, absente) => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={true} errorValeur={null} fillOperationForm={fill} />, { operation: buildOperation({ typeOperation: type }) });

        expect(screen.getByTestId(presente)).toBeInTheDocument();
        expect(screen.queryByTestId(absente)).not.toBeInTheDocument();
        expect(screen.getByTestId('EuroRoundedIcon')).toBeInTheDocument();
    });

    test('édition : chaque frappe appelle fillOperationForm(OPERATION_VALUE, texte courant)', async () => {
        const user = userEvent.setup();
        renderWithContexts(<OperationDetailValeur formValueInEdition={true} errorValeur={null} fillOperationForm={fill} />);

        await user.clear(screen.getByRole('textbox', { name: /montant/i }));
        await user.type(screen.getByRole('textbox', { name: /montant/i }), '12');

        expect(fill).toHaveBeenCalledWith('OPERATION_VALUE', '');
        expect(fill).toHaveBeenCalledWith('OPERATION_VALUE', '1');
        expect(fill).toHaveBeenLastCalledWith('OPERATION_VALUE', '12');
    });

    test('édition avec erreur : message affiché et champ marqué invalide', () => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={true} errorValeur="Le champ Valeur est obligatoire" fillOperationForm={fill} />);

        expect(screen.getByText('Le champ Valeur est obligatoire')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /montant/i })).toBeInvalid();
    });

    test('édition sans erreur : champ valide', () => {
        renderWithContexts(<OperationDetailValeur formValueInEdition={true} errorValeur={null} fillOperationForm={fill} />);

        expect(screen.getByRole('textbox', { name: /montant/i })).toBeValid();
    });
});

describe('OperationDetailValeur - validateFormMontant', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    function valider(valeurSaisie: string | null, type = TYPES_OPERATION_ENUM.DEPENSE, formValueOuvert = true) {
        const operation = buildOperation({ valeur: -50 });
        const editOperation = cloneOperation(operation);
        editOperation.valeur = valeurSaisie;
        editOperation.typeOperation = type;
        const errors = createEmptyErrors();
        const editForm = { ...createEmptyEditForm(false), value: formValueOuvert };
        validateFormMontant(editOperation, operation, editForm, errors);
        return { operation, errors };
    }

    test('champ valeur non ouvert : aucune validation ni modification', () => {
        const { operation, errors } = valider('abc', TYPES_OPERATION_ENUM.DEPENSE, false);

        expect(errors.valeur).toBeNull();
        expect(operation.valeur).toBe(-50);
    });

    test.each([null, ''])('valeur vide (%s) : erreur "obligatoire"', (vide) => {
        const { operation, errors } = valider(vide);

        expect(errors.valeur).toBe('Le champ Valeur est obligatoire');
        expect(operation.valeur).toBe(-50);
    });

    test.each([
        ['12', TYPES_OPERATION_ENUM.DEPENSE, -12],
        ['12', TYPES_OPERATION_ENUM.CREDIT, 12],
        ['12,5', TYPES_OPERATION_ENUM.DEPENSE, -12.5],
        ['12.5', TYPES_OPERATION_ENUM.CREDIT, 12.5],
        ['10+5', TYPES_OPERATION_ENUM.DEPENSE, -15],
        ['2*3,5', TYPES_OPERATION_ENUM.CREDIT, 7],
        ['100/4', TYPES_OPERATION_ENUM.DEPENSE, -25],
        ['1.234', TYPES_OPERATION_ENUM.CREDIT, 1.23]
    ])('saisie "%s" (%s) : valeur enregistrée %d', (saisie, type, attendu) => {
        const { operation, errors } = valider(saisie, type);

        expect(errors.valeur).toBeNull();
        expect(operation.valeur).toBe(attendu);
    });

    test.each(['-5', '1/0'])('saisie "%s" : erreur de format et valeur inchangée', (saisie) => {
        const { operation, errors } = valider(saisie);

        expect(errors.valeur).toBe('Le format est incorrect : 0000.00 €');
        expect(operation.valeur).toBe(-50);
    });

    test('saisie de plus de 1000 caractères : non évaluée comme équation, rejetée au format', () => {
        const { operation, errors } = valider('9'.repeat(1001));

        expect(errors.valeur).toBe('Le format est incorrect : 0000.00 €');
        expect(operation.valeur).toBe(-50);
    });
});
