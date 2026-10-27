import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { OperationDetailDate } from './OperationDetailDateOperation.component.tsx';
import { getLabelISOFromDate } from '../../../../../../Utils/Date.utils.ts';
import { buildBudget, buildOperation, renderWithContexts } from '../OperationDetailPage.testutils.tsx';

describe('OperationDetailDate', () => {

    const fill = vi.fn();

    /** Champ date : TextField type=date sans label ni rôle ARIA -> accès par id (contrat DOM du formulaire) */
    function champDate(): HTMLInputElement {
        // eslint-disable-next-line testing-library/no-node-access -- input type=date sans label ni rôle ARIA
        return document.getElementById('OPERATION_DATE_OPERATION_INPUT') as HTMLInputElement;
    }

    function operationAvecDate() {
        const operation = buildOperation();
        operation.autresInfos.dateOperation = new Date('2026-03-15T00:00:00.000Z');
        return operation;
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('budget absent : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />, { budget: undefined });

        expect(screen.queryByText('jj/mm/aaaa')).not.toBeInTheDocument();
    });

    test('opération absente : rien n\'est rendu', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />, { operation: null });

        expect(champDate()).toBeNull();
    });

    test('lecture sans date : "jj/mm/aaaa", éditable', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />);

        const texte = screen.getByText('jj/mm/aaaa');
        expect(texte).toHaveClass('editableField');
        expect(texte).toHaveAttribute('id', 'OPERATION_DATE_OPERATION');
    });

    test('lecture avec date : date au format français jj/mm/aaaa', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />, { operation: operationAvecDate() });

        expect(screen.getByText('15/03/2026')).toBeInTheDocument();
    });

    test('lecture sur budget clos : marquée désactivée', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={false} errorDateOperation={null} fillOperationForm={fill} />, { budget: buildBudget(false) });

        expect(screen.getByText('jj/mm/aaaa')).toHaveClass('editableField--disabled');
    });

    test('édition sans date : champ date vide', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />);

        expect(champDate()).toHaveValue('');
    });

    test('édition avec date : champ pré-rempli au format ISO', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />, { operation: operationAvecDate() });

        expect(champDate()).toHaveValue('2026-03-15');
    });

    test('édition : saisir une date appelle fillOperationForm(OPERATION_DATE_OPERATION, date ISO)', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />);

        fireEvent.change(champDate(), { target: { value: '2026-05-01' } });

        expect(fill).toHaveBeenCalledWith('OPERATION_DATE_OPERATION', '2026-05-01');
    });

    test('édition : effacer la date transmet null', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />, { operation: operationAvecDate() });

        fireEvent.change(champDate(), { target: { value: '' } });

        expect(fill).toHaveBeenCalledWith('OPERATION_DATE_OPERATION', null);
    });

    test('édition avec erreur : message affiché et champ invalide', () => {
        renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation="Date invalide" fillOperationForm={fill} />);

        expect(screen.getByText('Date invalide')).toBeInTheDocument();
        expect(champDate()).toBeInvalid();
    });

    describe('champ contrôlé par la date du brouillon (prop dateEdition)', () => {

        /** Midi UTC : la date ISO (UTC) est la même quel que soit le fuseau du runtime */
        const midiUTC = (iso: string) => new Date(`${iso}T12:00:00.000Z`);

        test("dateEdition fournie : le champ affiche cette date (ISO), même si l'opération du contexte a une autre date", () => {
            renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} dateEdition={midiUTC('2026-07-04')} />,
                { operation: operationAvecDate() });

            expect(champDate()).toHaveValue('2026-07-04');
        });

        test('dateEdition = date du jour (midi local) : le champ affiche la date du jour au format ISO', () => {
            const aujourdhui = new Date();
            aujourdhui.setHours(12, 0, 0, 0);

            renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} dateEdition={aujourdhui} />);

            expect(champDate()).toHaveValue(getLabelISOFromDate(aujourdhui));
        });

        test("dateEdition = null : champ vide, même si l'opération du contexte a une date", () => {
            renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} dateEdition={null} />,
                { operation: operationAvecDate() });

            expect(champDate()).toHaveValue('');
        });

        test("dateEdition omise : repli sur la date de l'opération du contexte", () => {
            renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} />,
                { operation: operationAvecDate() });

            expect(champDate()).toHaveValue('2026-03-15');
        });

        test('saisie sans mise à jour du parent : la valeur affichée reste celle de dateEdition (champ contrôlé) mais fillOperationForm est appelé', () => {
            renderWithContexts(<OperationDetailDate formDateInEdition={true} errorDateOperation={null} fillOperationForm={fill} dateEdition={midiUTC('2026-07-04')} />);

            fireEvent.change(champDate(), { target: { value: '2026-08-09' } });

            expect(fill).toHaveBeenCalledWith('OPERATION_DATE_OPERATION', '2026-08-09');
            expect(champDate()).toHaveValue('2026-07-04');
        });

        /** Parent minimal : conserve la date saisie comme le fait le brouillon d'édition */
        function ParentAvecEtat({ initiale }: Readonly<{ initiale: Date | null }>) {
            const [date, setDate] = useState<Date | null>(initiale);
            return <OperationDetailDate formDateInEdition={true} errorDateOperation={null} dateEdition={date}
                fillOperationForm={(field, value) => {
                    fill(field, value);
                    setDate(value ? new Date(`${value}T12:00:00.000Z`) : null);
                }} />;
        }

        test('le champ reste modifiable : saisie puis effacement reflétés dans le champ (parent à état)', () => {
            renderWithContexts(<ParentAvecEtat initiale={midiUTC('2026-07-04')} />);
            expect(champDate()).toHaveValue('2026-07-04');

            fireEvent.change(champDate(), { target: { value: '2026-12-25' } });
            expect(champDate()).toHaveValue('2026-12-25');
            expect(fill).toHaveBeenLastCalledWith('OPERATION_DATE_OPERATION', '2026-12-25');

            fireEvent.change(champDate(), { target: { value: '' } });
            expect(champDate()).toHaveValue('');
            expect(fill).toHaveBeenLastCalledWith('OPERATION_DATE_OPERATION', null);
        });

        test("saisie partielle (valeur transitoire vide d'un input date) : null transmis sans erreur, saisie complète ensuite reprise", () => {
            renderWithContexts(<ParentAvecEtat initiale={midiUTC('2026-07-04')} />);

            fireEvent.change(champDate(), { target: { value: '' } });
            expect(fill).toHaveBeenLastCalledWith('OPERATION_DATE_OPERATION', null);
            expect(champDate()).toHaveValue('');

            fireEvent.change(champDate(), { target: { value: '2026-01-31' } });
            expect(fill).toHaveBeenLastCalledWith('OPERATION_DATE_OPERATION', '2026-01-31');
            expect(champDate()).toHaveValue('2026-01-31');
        });
    });
});
