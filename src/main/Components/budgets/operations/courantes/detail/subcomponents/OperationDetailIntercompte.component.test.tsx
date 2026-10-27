import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
    getAffichageIntercompteRO,
    OperationDetailIntercompte,
    validateFormTransfertIntercompte
} from './OperationDetailIntercompte.component.tsx';
import { buildComptes, buildOperation } from '../OperationDetailPage.testutils.tsx';
import { createEmptyErrors } from '../OperationDetailPage.constants.ts';
import { cloneOperation } from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { BUSINESS_GUID } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

// Utilisateur connecté : vincent@test.fr (les comptes d'un autre propriétaire sont préfixés par son prénom)
vi.mock('react-oidc-context', () => ({ useAuth: () => ({ user: { profile: { email: 'vincent@test.fr' } } }) }));

describe('OperationDetailIntercompte - composant', () => {

    const fill = vi.fn();
    const selecteur = () => screen.getByRole('combobox');

    function comptesAvecProprietaires() {
        const [courant, livret, ferme] = buildComptes();
        return [
            courant,
            { ...livret, proprietaires: [{ id: 'p2', login: 'caro.z' }] },
            ferme,
            { ...livret, id: 'compte-9', libelle: 'Sans propriétaire', proprietaires: [] }
        ] as any[];
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('affiche le compte sélectionné', () => {
        render(<OperationDetailIntercompte intercompte="compte-1" listeAutresComptes={buildComptes()} errorIntercompte={null} fillOperationForm={fill} />);

        expect(selecteur()).toHaveTextContent('Compte courant');
    });

    test('ne propose que les comptes actifs', async () => {
        const user = userEvent.setup();
        render(<OperationDetailIntercompte intercompte="" listeAutresComptes={buildComptes()} errorIntercompte={null} fillOperationForm={fill} />);

        await user.click(selecteur());

        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(['Compte courant', 'Livret A']);
    });

    test('un compte d\'un autre propriétaire est préfixé par son prénom ; un compte à soi ou sans propriétaire ne l\'est pas', async () => {
        const user = userEvent.setup();
        render(<OperationDetailIntercompte intercompte="" listeAutresComptes={comptesAvecProprietaires()} errorIntercompte={null} fillOperationForm={fill} />);

        await user.click(selecteur());

        const options = await screen.findAllByRole('option');
        expect(options.map((option) => option.textContent)).toEqual(['Compte courant', 'Caro | Livret A', 'Sans propriétaire']);
    });

    test('choisir un compte appelle fillOperationForm(OPERATION_INTERCOMPTES, id du compte)', async () => {
        const user = userEvent.setup();
        render(<OperationDetailIntercompte intercompte="" listeAutresComptes={buildComptes()} errorIntercompte={null} fillOperationForm={fill} />);

        await user.click(selecteur());
        await user.click(await screen.findByRole('option', { name: /Livret A/ }));

        expect(fill).toHaveBeenCalledWith('OPERATION_INTERCOMPTES', 'compte-2');
    });

    test('avec erreur : message affiché et champ invalide', () => {
        render(<OperationDetailIntercompte intercompte="" listeAutresComptes={buildComptes()} errorIntercompte="Le champ Intercompte est obligatoire" fillOperationForm={fill} />);

        expect(screen.getByText('Le champ Intercompte est obligatoire')).toBeInTheDocument();
        expect(selecteur()).toHaveAttribute('aria-invalid', 'true');
    });
});

describe('OperationDetailIntercompte - icônes des comptes', () => {

    test('options : icône de banque sûre utilisée, nom non sûr remplacé par l icône par défaut', async () => {
        const [courant, livret] = buildComptes();
        const comptes = [{ ...courant, itemIcon: 'banque.png' }, { ...livret, itemIcon: '../../x.png' }] as any[];
        render(<OperationDetailIntercompte intercompte="compte-1" listeAutresComptes={comptes} errorIntercompte={null} fillOperationForm={vi.fn()} />);

        await userEvent.click(screen.getByRole('combobox'));

        expect(screen.getByRole('img', { name: 'Compte courant' })).toHaveAttribute('src', '/img/banques/banque.png');
        expect(screen.getByRole('img', { name: 'Livret A' })).toHaveAttribute('src', '/img/icon.webp');
    });
});

describe('OperationDetailIntercompte - affichage en lecture seule', () => {

    test('libellé sans balise de virement : rien n\'est affiché', () => {
        const { container } = render(<>{getAffichageIntercompteRO('Courses', buildComptes(), false)}</>);

        expect(container).toBeEmptyDOMElement();
    });

    test('libellé de virement vers un compte connu : icône et nom du compte', () => {
        render(<>{getAffichageIntercompteRO('[vers compte-2] Epargne', buildComptes(), false)}</>);

        expect(screen.getByRole('img', { name: 'Livret A' })).toBeInTheDocument();
        expect(screen.getByText('vers Livret A')).toBeInTheDocument();
    });

    test('libellé de virement vers un compte inconnu : libellé brut sans icône', () => {
        render(<>{getAffichageIntercompteRO('[vers compte-inconnu] Epargne', buildComptes(), false)}</>);

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});

describe('OperationDetailIntercompte - validateFormTransfertIntercompte', () => {

    test('virement interne sans compte cible : erreur et opération inchangée', () => {
        const operation = buildOperation({ ssCategorie: { id: BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE, libelle: 'Virement', type: undefined as any } });
        const edition = cloneOperation(operation);
        const errors = createEmptyErrors();

        validateFormTransfertIntercompte(edition, null, operation, errors);

        expect(errors.intercompte).toBe('Le champ Intercompte est obligatoire');
        expect(operation.intercompte).toBeNull();
    });

    test('virement interne avec compte cible : compte recopié sur l\'opération', () => {
        const operation = buildOperation();
        const edition = cloneOperation(operation);
        edition.ssCategorie.id = BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE;
        const errors = createEmptyErrors();

        validateFormTransfertIntercompte(edition, 'compte-2', operation, errors);

        expect(errors.intercompte).toBeNull();
        expect(operation.intercompte).toBe('compte-2');
    });

    test('opération ordinaire sans compte cible : aucune erreur', () => {
        const operation = buildOperation();
        const errors = createEmptyErrors();

        validateFormTransfertIntercompte(cloneOperation(operation), null, operation, errors);

        expect(errors.intercompte).toBeNull();
        expect(operation.intercompte).toBeNull();
    });
});
