import {beforeEach, describe, expect, test, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SharedOperationItem, {OPERATION_ROW_HEIGHT} from './OperationsListItem.shared.tsx';
import OperationModel from '../../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../../Utils/AppBusinessEnums.constants.ts';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

// jsdom n'évalue pas le CSS : lecture brute de la feuille de style
const css = readFileSync(resolve(process.cwd(), 'public/styles/application.css'), 'utf-8');

const mocks = vi.hoisted(() => ({isMobile: false}));

// Responsive : useMediaQuery piloté par le test ; le reste de @mui/material est réel
vi.mock('@mui/material', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@mui/material')>()),
    useMediaQuery: () => mocks.isMobile,
}));

// Contexte budget : seule la liste des comptes est utilisée par le composant
vi.mock('../../../../Models/contextProvider/BudgetContextProvider.tsx', () => ({
    useBudgetContext: () => ({
        comptes: [{id: 'cpt1', libelle: 'Livret A', itemIcon: 'livret.png'}],
    }),
}));

const buildOperation = (over: Partial<OperationModel> = {}): OperationModel => ({
    id: 'op1',
    libelle: 'Loyer',
    valeur: -500,
    etat: OPERATION_ETATS_ENUM.REALISEE,
    statuts: [],
    categorie: {id: 'c1', libelle: 'Logement'},
    ssCategorie: {id: 's1', libelle: 'Loyer'},
    ...over,
} as unknown as OperationModel);

interface ItemProps {
    isSelected?: boolean,
    isOneSelected?: boolean,
    onClick?: () => void
}

const renderItem = (operation: OperationModel, props: ItemProps = {}) =>
    render(<SharedOperationItem operation={operation} onClick={props.onClick ?? vi.fn()}
                                getBorderColor={() => '#123456'}
                                isSelected={props.isSelected} isOneSelected={props.isOneSelected}/>);

/** La ligne n'a ni rôle ni texte propre : accès par sélecteur CSS (texte propre vide). */
const getRow = () => screen.getByText('', {selector: '.operation-list-item'});

beforeEach(() => {
    mocks.isMobile = false;
});

describe('OperationsListItem - hauteur de ligne', () => {
    test('OPERATION_ROW_HEIGHT vaut 64', () => {
        expect(OPERATION_ROW_HEIGHT).toBe(64);
    });

    test.each([
        ['desktop sans commentaire', false, 'Loyer'],
        ['desktop avec commentaire', false, 'Loyer-janvier'],
        ['mobile sans commentaire', true, 'Loyer'],
        ['mobile avec commentaire', true, 'Loyer-janvier'],
    ])('hauteur 64px : %s', (_nom, isMobile, libelle) => {
        mocks.isMobile = isMobile;
        renderItem(buildOperation({libelle}));
        expect(getRow()).toHaveStyle({height: '64px', overflow: 'hidden'});
    });
});

describe('OperationsListItem - libellé et sous-texte sur une ligne', () => {
    test('sous-texte catégorie : nowrap + ellipsis', () => {
        renderItem(buildOperation());
        expect(screen.getByText('Logement / Loyer')).toHaveStyle({
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
        });
    });

    test('libellé : nowrap + ellipsis', () => {
        renderItem(buildOperation({libelle: 'Loyer-janvier'}));
        // Conteneur du libellé : premier Typography subtitle1 (sans texte propre)
        const [libelleBox] = screen.getAllByText('', {selector: '.MuiTypography-subtitle1'});
        expect(libelleBox).toHaveStyle({whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'});
        expect(screen.getByText('Loyer')).toBeInTheDocument();
    });

    test('libellé sans commentaire visible dans la ligne', () => {
        renderItem(buildOperation({libelle: 'Courses'}));
        expect(screen.getByText('Courses')).toBeInTheDocument();
    });
});

describe('OperationsListItem - montant', () => {
    test('crédit : « + » explicite', () => {
        renderItem(buildOperation({valeur: 42}));
        expect(screen.getByText(/^\+42[,.]00 €$/)).toBeInTheDocument();
    });

    test('dépense : pas de « + »', () => {
        renderItem(buildOperation({valeur: -42}));
        expect(screen.getByText(/42[,.]00 €/).textContent).not.toContain('+');
    });

    test('valeur null -> « Non initialisé »', () => {
        renderItem(buildOperation({valeur: null as unknown as number}));
        expect(screen.getByText('Non initialisé')).toBeInTheDocument();
    });
});

describe('OperationsListItem - anneau d\'état', () => {
    test.each([
        [OPERATION_ETATS_ENUM.REALISEE, 'Réalisée'],
        [OPERATION_ETATS_ENUM.PREVUE, 'Prévue'],
        [OPERATION_ETATS_ENUM.ANNULEE, 'Annulée'],
    ])('role="img" + aria-label pour %s', (etat, label) => {
        renderItem(buildOperation({etat}));
        expect(screen.getByRole('img', {name: label})).toBeInTheDocument();
    });

    test('couleur de bordure issue de getBorderColor', () => {
        renderItem(buildOperation());
        expect(screen.getByRole('img', {name: 'Réalisée'})).toHaveStyle({borderColor: '#123456'});
    });

    test('pas de role ni aria-label si etat non défini', () => {
        renderItem(buildOperation({etat: undefined}));
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/Réalisée|Prévue|État inconnu/)).not.toBeInTheDocument();
    });

    test('pas de role ni aria-label si etat null', () => {
        renderItem(buildOperation({etat: null as unknown as OPERATION_ETATS_ENUM}));
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
});

describe('OperationsListItem - sélection', () => {
    test('classe --selected quand isSelected, sans opacité réduite', () => {
        renderItem(buildOperation(), {isSelected: true, isOneSelected: true});
        const row = getRow();
        expect(row).toHaveClass('operation-list-item', 'operation-list-item--selected');
        expect(row).not.toHaveStyle({opacity: '0.75'});
    });

    test('autre ligne sélectionnée : opacité 0.75, pas de classe --selected', () => {
        renderItem(buildOperation(), {isSelected: false, isOneSelected: true});
        const row = getRow();
        expect(row).toHaveStyle({opacity: '0.75'});
        expect(row).not.toHaveClass('operation-list-item--selected');
    });

    test('aucune sélection : ni classe --selected ni opacité', () => {
        renderItem(buildOperation());
        const row = getRow();
        expect(row).toHaveClass('operation-list-item');
        expect(row).not.toHaveClass('operation-list-item--selected');
        expect(row).not.toHaveStyle({opacity: '0.75'});
    });

    test('clic sur la ligne -> onClick(operation)', async () => {
        const onClick = vi.fn();
        const operation = buildOperation();
        renderItem(operation, {onClick});
        await userEvent.click(getRow());
        expect(onClick).toHaveBeenCalledWith(operation);
    });

    test('CSS : survol sous media (hover:hover), sélection avec barre gauche', () => {
        // jsdom n'évalue pas :hover / @media : assertion textuelle sur la feuille de style
        expect(css).toMatch(/@media \(hover: hover\)\s*\{\s*\.operation-list-item:hover/);
        expect(css).toMatch(/\.operation-list-item--selected:hover\s*\{[^}]*box-shadow: inset 4px 0 0/);
    });
});

describe('OperationsListItem - logo intercompte', () => {
    test('liste : logo en 1.4em', () => {
        renderItem(buildOperation({libelle: '[vers cpt1]Virement'}));
        expect(screen.getByRole('img', {name: 'Livret A'}).style.width).toBe('1.4em');
    });

    test('ligne conserve 64px avec logo intercompte (mobile)', () => {
        mocks.isMobile = true;
        renderItem(buildOperation({libelle: '[vers cpt1]Virement-x'}));
        expect(getRow()).toHaveStyle({height: '64px'});
    });
});
