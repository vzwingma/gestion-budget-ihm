import React, { useEffect } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';

import { useOperationEditForm } from './useOperationEditForm.ts';
import { BudgetContextProvider, useBudgetContext } from '../../../../../Models/contextProvider/BudgetContextProvider.tsx';
import { toast } from 'react-toastify';
import { saveOperation, saveOperationIntercompte } from './OperationDetailPage.extservices.ts';
import {
    buildBudget,
    buildCategories,
    buildOperation
} from './OperationDetailPage.testutils.tsx';
import { OPERATION_EDITION_FORM } from './OperationDetailPage.constants.ts';
import { createNewOperation } from '../../../../../Models/budgets/Operation.model.ts';
import { BUSINESS_GUID, OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM, TYPES_OPERATION_ENUM } from '../../../../../Utils/AppBusinessEnums.constants.ts';

// Toast mocké : seul `warn` (repli de la résolution d'opération créée) est observé
vi.mock('react-toastify', () => ({ toast: { warn: vi.fn(), success: vi.fn(), error: vi.fn() } }));

/**
 * Tests du hook `useOperationEditForm` (AP 006 lot 3) avec le vrai `BudgetContextProvider` ;
 * seul le service de sauvegarde (HTTP) est mocké.
 */
vi.mock('./OperationDetailPage.extservices.ts', () => ({
    saveOperation: vi.fn(),
    saveOperationIntercompte: vi.fn()
}));

const categories = buildCategories();

function rendreHook() {
    const onOperationChange = vi.fn();
    /** Trace de chaque rendu committé : [id opération du contexte, id de la copie de travail] pour détecter un rendu « incohérent » */
    const rendus: Array<[string | undefined, string | null]> = [];
    const wrapper = ({ children }: { children: React.ReactNode }) => <BudgetContextProvider>{children}</BudgetContextProvider>;
    const { result } = renderHook(() => {
        const contexte = useBudgetContext();
        const formulaire = useOperationEditForm({ listeCategories: categories, onOperationChange });
        // useEffect : seuls les rendus validés (committés) sont tracés, pas le passage interrompu du rendu avec ajustement d'état
        const idContexte = contexte.currentOperation?.id;
        const idCopie = formulaire.editOperation.id;
        useEffect(() => { rendus.push([idContexte, idCopie]); });
        return { contexte, formulaire };
    }, { wrapper });
    const courant = () => result.current;
    const selectionner = (operation: ReturnType<typeof buildOperation> | null) => act(() => courant().contexte.setCurrentOperation(operation));
    return { courant, selectionner, onOperationChange, rendus };
}

const clic = (id: string) => ({ target: { id }, type: 'click', code: '' }) as unknown as React.SyntheticEvent;

describe('useOperationEditForm', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(saveOperation).mockReset();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    test('aucune opération sélectionnée : formulaire fermé, copie de travail vierge, aucune erreur', () => {
        const { courant } = rendreHook();

        expect(courant().formulaire.editForm).toMatchObject({ value: false, libelle: false, formValidationEnabled: false });
        expect(courant().formulaire.editOperation.id).toBe('-1');
        expect(courant().formulaire.errors).toEqual({ valeur: null, dateOperation: null, dateFin: null, libelle: null, categorie: null, compte: null, intercompte: null });
        expect(courant().formulaire.resetKey).toBe(0);
    });

    test('sélection d\'une opération existante : copie de travail initialisée dès le rendu, sans rendu intermédiaire incohérent', () => {
        const { courant, selectionner, rendus } = rendreHook();

        selectionner(buildOperation());

        expect(courant().formulaire.editOperation).toMatchObject({ id: 'op-1', libelle: 'Courses Carrefour', valeur: '50' });
        expect(courant().formulaire.editForm.value).toBe(false);
        expect(courant().formulaire.resetKey).toBe(1);
        // Jamais de rendu où le contexte porte déjà op-1 alors que la copie de travail est encore l'ancienne
        expect(rendus.filter(([contexte, copie]) => contexte === 'op-1' && copie !== 'op-1')).toEqual([]);
    });

    test('sélection d\'une opération en création (id -1) : tous les champs ouverts', () => {
        const { courant, selectionner } = rendreHook();

        selectionner(buildOperation());
        selectionner(createNewOperation());

        expect(courant().formulaire.editForm).toMatchObject({ value: true, libelle: true, dateOperation: true, mensualite: true, categorieType: true, formValidationEnabled: false });
        expect(courant().formulaire.resetKey).toBe(2);
    });

    test('changement d\'opération : saisies, ouvertures et erreurs de la précédente réinitialisées, resetKey incrémenté', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(buildOperation());
        act(() => courant().contexte.setCurrentBudget(buildBudget()));
        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, 'Saisie sur A'));
        act(() => courant().formulaire.handleClick(clic('OPERATION_LIBELLE')));
        expect(courant().formulaire.editOperation.libelle).toBe('Saisie sur A');
        expect(courant().formulaire.editForm.libelle).toBe(true);
        const cle = courant().formulaire.resetKey;

        selectionner(buildOperation({ id: 'op-2', libelle: 'Loyer', valeur: -700 }));

        expect(courant().formulaire.editOperation).toMatchObject({ id: 'op-2', libelle: 'Loyer', valeur: '700' });
        expect(courant().formulaire.editForm.libelle).toBe(false);
        expect(courant().formulaire.resetKey).toBe(cle + 1);
    });

    test('même opération re-fournie (même référence) : pas de réinitialisation', () => {
        const { courant, selectionner } = rendreHook();
        const operation = buildOperation();
        selectionner(operation);
        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, 'Saisie'));
        const cle = courant().formulaire.resetKey;

        selectionner(operation);

        expect(courant().formulaire.editOperation.libelle).toBe('Saisie');
        expect(courant().formulaire.resetKey).toBe(cle);
    });

    test('désélection (null) : la copie de travail est conservée, pas de réinitialisation', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(buildOperation());
        const cle = courant().formulaire.resetKey;

        selectionner(null);

        expect(courant().formulaire.resetKey).toBe(cle);
        expect(courant().contexte.currentOperation).toBeNull();
    });

    test('fillOperationForm : la saisie produit une nouvelle copie, l\'opération du contexte reste inchangée', () => {
        const { courant, selectionner } = rendreHook();
        const operation = buildOperation();
        selectionner(operation);
        const avant = courant().formulaire.editOperation;

        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.MENSUALITE, PERIODES_MENSUALITE_ENUM.ANNUELLE));

        expect(courant().formulaire.editOperation).not.toBe(avant);
        expect(courant().formulaire.editOperation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.ANNUELLE);
        expect(avant.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.PONCTUELLE);
        expect(operation.mensualite.periode).toBe(PERIODES_MENSUALITE_ENUM.PONCTUELLE);
    });

    test('fillOperationForm(FORM_VALIDATION) : active / désactive la validation clavier sans toucher à la copie', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(buildOperation());
        const copie = courant().formulaire.editOperation;

        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, 'true'));
        expect(courant().formulaire.editForm.formValidationEnabled).toBe(true);
        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, 'false'));

        expect(courant().formulaire.editForm.formValidationEnabled).toBe(false);
        expect(courant().formulaire.editOperation).toBe(copie);
    });

    test('handleClick : ouvre le champ cliqué en conservant formValidationEnabled basculé entre-temps', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(buildOperation());
        act(() => courant().contexte.setCurrentBudget(buildBudget()));
        // Le clic est traité avec le rendu courant, puis un focus active la validation clavier AVANT l'application de l'ouverture
        const gestionnaire = courant().formulaire.handleClick;

        act(() => {
            courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.FORM_VALIDATION, 'true');
            gestionnaire(clic('OPERATION_VALUE'));
        });

        expect(courant().formulaire.editForm.value).toBe(true);
        expect(courant().formulaire.editForm.formValidationEnabled).toBe(true);
    });

    test('handleClick : budget clos -> aucune ouverture ; sans opération -> sans effet', () => {
        const { courant, selectionner } = rendreHook();
        act(() => courant().formulaire.handleClick(clic('OPERATION_VALUE')));
        expect(courant().formulaire.editForm.value).toBe(false);

        selectionner(buildOperation());
        act(() => courant().contexte.setCurrentBudget(buildBudget(false)));
        act(() => courant().formulaire.handleClick(clic('OPERATION_VALUE')));

        expect(courant().formulaire.editForm.value).toBe(false);
    });

    test('validate : sans budget ou sans opération -> aucune sauvegarde', () => {
        const { courant, selectionner } = rendreHook();
        act(() => courant().formulaire.validate());
        selectionner(buildOperation());
        act(() => courant().formulaire.validate());

        expect(saveOperation).not.toHaveBeenCalled();
    });

    test('validate (erreurs) : erreurs affichées, pas de sauvegarde, opération du contexte inchangée', () => {
        const { courant, selectionner } = rendreHook();
        const operation = buildOperation();
        selectionner(operation);
        act(() => courant().contexte.setCurrentBudget(buildBudget()));
        act(() => courant().formulaire.handleClick(clic('OPERATION_LIBELLE')));
        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, ''));

        act(() => courant().formulaire.validate());

        expect(courant().formulaire.errors.libelle).toBe('Le champ Description est obligatoire');
        expect(saveOperation).not.toHaveBeenCalled();
        expect(operation.libelle).toBe('Courses Carrefour');
    });

    test('validate (valide) : le brouillon est sauvegardé ; au succès formulaire refermé, brouillon propagé, parent notifié, sans réinitialisation', () => {
        const { courant, selectionner, onOperationChange } = rendreHook();
        const operation = buildOperation();
        selectionner(operation);
        act(() => courant().contexte.setCurrentBudget(buildBudget()));
        act(() => courant().formulaire.handleClick(clic('OPERATION_LIBELLE')));
        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, 'Libellé modifié'));
        const cle = courant().formulaire.resetKey;

        act(() => courant().formulaire.validate());

        expect(saveOperation).toHaveBeenCalledTimes(1);
        const [brouillon, , callback] = (saveOperation as Mock).mock.calls[0];
        expect(brouillon).not.toBe(operation);
        expect(brouillon.libelle).toBe('Libellé modifié');
        // Avant le succès : contexte inchangé, formulaire toujours ouvert
        expect(courant().contexte.currentOperation).toBe(operation);
        expect(courant().formulaire.editForm.libelle).toBe(true);

        const budgetMaj = buildBudget();
        act(() => callback(budgetMaj));

        expect(courant().contexte.currentOperation).toBe(brouillon);
        expect(operation.libelle).toBe('Courses Carrefour');
        expect(courant().formulaire.editForm.libelle).toBe(false);
        expect(courant().formulaire.editOperation.libelle).toBe('Libellé modifié');
        expect(courant().formulaire.resetKey).toBe(cle);
        expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
    });

    test('validate (échec de sauvegarde, callback jamais appelé) : formulaire toujours ouvert, contexte inchangé', () => {
        const { courant, selectionner, onOperationChange } = rendreHook();
        const operation = buildOperation();
        selectionner(operation);
        act(() => courant().contexte.setCurrentBudget(buildBudget()));
        act(() => courant().formulaire.handleClick(clic('OPERATION_LIBELLE')));

        act(() => courant().formulaire.validate());

        expect(saveOperation).toHaveBeenCalledTimes(1);
        expect(courant().contexte.currentOperation).toBe(operation);
        expect(courant().formulaire.editForm.libelle).toBe(true);
        expect(onOperationChange).not.toHaveBeenCalled();
    });

    test('setEtatInCreation : état + date portés par une nouvelle copie de travail', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(createNewOperation());
        const avant = courant().formulaire.editOperation;
        const date = new Date('2026-10-05');

        act(() => courant().formulaire.setEtatInCreation(date, OPERATION_ETATS_ENUM.REALISEE));

        expect(courant().formulaire.editOperation).not.toBe(avant);
        expect(courant().formulaire.editOperation.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        expect(courant().formulaire.editOperation.autresInfos.dateOperation).toBe(date);
        expect(avant.etat).toBe(OPERATION_ETATS_ENUM.PREVUE);
    });

    test('commitOperation : la copie devient l\'opération courante, l\'état est repris, sans réinitialiser le formulaire', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(buildOperation());
        act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, 'Saisie en cours'));
        const cle = courant().formulaire.resetKey;
        const copie = buildOperation({ etat: OPERATION_ETATS_ENUM.REPORTEE });

        act(() => courant().formulaire.commitOperation(copie));

        expect(courant().contexte.currentOperation).toBe(copie);
        expect(courant().formulaire.editOperation.etat).toBe(OPERATION_ETATS_ENUM.REPORTEE);
        expect(courant().formulaire.editOperation.libelle).toBe('Saisie en cours');
        expect(courant().formulaire.resetKey).toBe(cle);
    });

    test('sélection d\'une opération non issue du hook après un commit : réinitialisation normale', () => {
        const { courant, selectionner } = rendreHook();
        selectionner(buildOperation());
        act(() => courant().formulaire.commitOperation(buildOperation({ etat: OPERATION_ETATS_ENUM.REPORTEE })));
        const cle = courant().formulaire.resetKey;

        selectionner(buildOperation({ id: 'op-3', typeOperation: TYPES_OPERATION_ENUM.CREDIT, valeur: 10 }));

        expect(courant().formulaire.resetKey).toBe(cle + 1);
        expect(courant().formulaire.editOperation.id).toBe('op-3');
    });

    /**
     * AP 012 (issue #759) : le backend écrase l'id client de la création et renvoie le budget complet.
     * Le mock de `saveOperation` reproduit ce comportement : id client posé sur le brouillon (comme le vrai service),
     * puis callback de succès appelé avec un budget contenant l'opération sous un id backend.
     */
    describe('création : promotion de l\'opération backend (issue #759)', () => {
        const ID_BACKEND = 'id-backend';
        const ID_CLIENT = 'uuid-client';

        const operationBackend = (id: string, overrides: Partial<ReturnType<typeof buildOperation>> = {}) =>
            buildOperation({ id, libelle: 'Cinéma', valeur: -12, ...overrides });

        /** Budget retourné par le backend : opérations existantes + opération(s) créée(s) */
        const budgetAvecOperations = (...operations: ReturnType<typeof buildOperation>[]) => {
            const budget = buildBudget();
            budget.listeOperations = operations;
            return budget;
        };

        /** Prépare une création valide (brouillon « Cinéma ») sur un budget contenant déjà `op-1` */
        function preparerCreation(options: { intercompte?: boolean } = {}) {
            const rendu = rendreHook();
            const budgetAvant = budgetAvecOperations(buildOperation());
            act(() => rendu.courant().contexte.setCurrentBudget(budgetAvant));
            rendu.selectionner(createNewOperation());
            act(() => {
                rendu.courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, 'Cinéma');
                rendu.courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.VALUE, '12');
                rendu.courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.CATEGORIE, options.intercompte ? BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE : 'ss-resto');
                if (options.intercompte) {
                    rendu.courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.INTERCOMPTES, 'compte-2');
                }
            });
            return { ...rendu, budgetAvant };
        }

        /** Ids portés par le brouillon à chaque appel de sauvegarde (relevés à l'appel : "-1" = CREATE, autre = UPDATE) */
        let idsAppel: string[];
        let callbackSucces: (budget: ReturnType<typeof buildBudget>) => void;

        beforeEach(() => {
            idsAppel = [];
            vi.mocked(saveOperation).mockImplementation((operation, _budget, callback) => {
                idsAppel.push(operation.id);
                if (operation.id === '-1') {
                    operation.id = ID_CLIENT; // comme le vrai service : id client, ensuite écrasé par le backend
                }
                callbackSucces = callback;
            });
            vi.mocked(saveOperationIntercompte).mockImplementation((operation, _budget, _cible, callback) => {
                idsAppel.push(operation.id);
                callbackSucces = callback;
            });
            vi.mocked(toast.warn).mockClear();
        });

        test('1 seul id nouveau : currentOperation et copie de travail portent l\'id backend, jamais l\'id client', () => {
            const { courant, budgetAvant } = preparerCreation();
            act(() => courant().formulaire.validate());
            expect(idsAppel).toEqual(['-1']);

            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations, operationBackend(ID_BACKEND))));

            expect(courant().contexte.currentOperation?.id).toBe(ID_BACKEND);
            expect(courant().formulaire.editOperation.id).toBe(ID_BACKEND);
            expect(courant().formulaire.editForm.libelle).toBe(false);
            expect(toast.warn).not.toHaveBeenCalled();
        });

        test('la résolution porte sur le budget retourné APRÈS sa propagation au parent (onOperationChange d\'abord)', () => {
            const { courant, onOperationChange, budgetAvant } = preparerCreation();
            const ordre: string[] = [];
            onOperationChange.mockImplementation(() => ordre.push('onOperationChange'));
            act(() => courant().formulaire.validate());
            const budgetMaj = budgetAvecOperations(...budgetAvant.listeOperations, operationBackend(ID_BACKEND));

            act(() => callbackSucces(budgetMaj));

            expect(onOperationChange).toHaveBeenCalledWith(budgetMaj);
            expect(ordre).toEqual(['onOperationChange']);
            expect(courant().contexte.currentOperation?.id).toBe(ID_BACKEND);
        });

        test('plusieurs candidats : l\'opération correspondant aux champs du brouillon est promue', () => {
            const { courant, budgetAvant } = preparerCreation();
            act(() => courant().formulaire.validate());
            const autre = operationBackend('id-autre', { libelle: 'Autre' });

            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations, autre, operationBackend(ID_BACKEND, { ssCategorie: { id: 'ss-resto', libelle: 'Restaurant' } }))));

            expect(courant().contexte.currentOperation?.id).toBe(ID_BACKEND);
        });

        test('création puis « réaliser » : 1 CREATE puis 1 UPDATE avec l\'id backend, aucun second CREATE', () => {
            const { courant, budgetAvant } = preparerCreation();
            act(() => courant().formulaire.validate());
            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations, operationBackend(ID_BACKEND))));

            // « Réaliser » sans changer d'écran : état réalisé sur la copie de travail puis validation
            act(() => courant().formulaire.handleClick(clic('OPERATION_LIBELLE')));
            act(() => courant().formulaire.setEtatInCreation(new Date(2026, 9, 5), OPERATION_ETATS_ENUM.REALISEE));
            act(() => courant().formulaire.validate());

            expect(saveOperation).toHaveBeenCalledTimes(2);
            expect(idsAppel).toEqual(['-1', ID_BACKEND]);
            expect(idsAppel.filter((id) => id === '-1')).toHaveLength(1);
            const [brouillonUpdate] = vi.mocked(saveOperation).mock.calls[1];
            expect(brouillonUpdate.id).toBe(ID_BACKEND);
            expect(brouillonUpdate.etat).toBe(OPERATION_ETATS_ENUM.REALISEE);
        });

        test('repli (0 candidat) : détail fermé (currentOperation null) + toast.warn, parent tout de même notifié', () => {
            const { courant, onOperationChange, budgetAvant } = preparerCreation();
            act(() => courant().formulaire.validate());
            const budgetSansNouveau = budgetAvecOperations(...budgetAvant.listeOperations);

            act(() => callbackSucces(budgetSansNouveau));

            expect(courant().contexte.currentOperation).toBeNull();
            expect(toast.warn).toHaveBeenCalledTimes(1);
            expect(onOperationChange).toHaveBeenCalledWith(budgetSansNouveau);
            expect(courant().formulaire.editForm.libelle).toBe(false);
        });

        test('repli (plusieurs candidats ambigus) : détail fermé + toast, l\'id client n\'est jamais promu', () => {
            const { courant, budgetAvant } = preparerCreation();
            act(() => courant().formulaire.validate());

            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations,
                operationBackend('a', { libelle: 'A' }), operationBackend('b', { libelle: 'B' }))));

            expect(courant().contexte.currentOperation).toBeNull();
            expect(toast.warn).toHaveBeenCalledTimes(1);
            expect(courant().contexte.currentOperation?.id).not.toBe(ID_CLIENT);
        });

        test('repli : après fermeture, la sélection d\'une autre opération réinitialise normalement le formulaire', () => {
            const { courant, selectionner, budgetAvant } = preparerCreation();
            act(() => courant().formulaire.validate());
            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations)));
            const cle = courant().formulaire.resetKey;

            selectionner(buildOperation({ id: 'op-1' }));

            expect(courant().formulaire.resetKey).toBe(cle + 1);
            expect(courant().formulaire.editOperation.id).toBe('op-1');
        });

        test('échec de sauvegarde (callback jamais appelé) : currentOperation inchangé, aucun toast', () => {
            const { courant } = preparerCreation();
            const avant = courant().contexte.currentOperation;

            act(() => courant().formulaire.validate());

            expect(saveOperation).toHaveBeenCalledTimes(1);
            expect(courant().contexte.currentOperation).toBe(avant);
            expect(courant().contexte.currentOperation?.id).toBe('-1');
            expect(toast.warn).not.toHaveBeenCalled();
        });

        test('flux non-création : le brouillon est promu tel quel (id inchangé), sans résolution ni toast', () => {
            const { courant, selectionner } = rendreHook();
            const operation = buildOperation();
            selectionner(operation);
            // Le budget retourné ne contient aucune opération « nouvelle » : une résolution échouerait en repli
            const budgetMaj = budgetAvecOperations();
            act(() => courant().contexte.setCurrentBudget(budgetAvecOperations(operation)));
            act(() => courant().formulaire.handleClick(clic('OPERATION_LIBELLE')));
            act(() => courant().formulaire.fillOperationForm(OPERATION_EDITION_FORM.LIBELLE, 'Modifié'));
            act(() => courant().formulaire.validate());

            act(() => callbackSucces(budgetMaj));

            expect(idsAppel).toEqual(['op-1']);
            expect(courant().contexte.currentOperation?.id).toBe('op-1');
            expect(courant().contexte.currentOperation?.libelle).toBe('Modifié');
            expect(toast.warn).not.toHaveBeenCalled();
        });

        test('intercompte : virement créé via saveOperationIntercompte, opération backend promue', () => {
            const { courant, budgetAvant } = preparerCreation({ intercompte: true });
            act(() => courant().formulaire.validate());
            expect(saveOperationIntercompte).toHaveBeenCalledTimes(1);
            expect(saveOperation).not.toHaveBeenCalled();
            expect(vi.mocked(saveOperationIntercompte).mock.calls[0][2]).toBe('compte-2');

            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations, operationBackend(ID_BACKEND))));

            expect(courant().contexte.currentOperation?.id).toBe(ID_BACKEND);
            expect(toast.warn).not.toHaveBeenCalled();
        });

        test('intercompte : opération source introuvable -> même repli (détail fermé + toast)', () => {
            const { courant, budgetAvant } = preparerCreation({ intercompte: true });
            act(() => courant().formulaire.validate());

            act(() => callbackSucces(budgetAvecOperations(...budgetAvant.listeOperations)));

            expect(courant().contexte.currentOperation).toBeNull();
            expect(toast.warn).toHaveBeenCalledTimes(1);
        });
    });
});
