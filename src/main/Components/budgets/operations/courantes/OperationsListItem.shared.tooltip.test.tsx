import {afterEach, describe, expect, test, vi} from 'vitest';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SharedOperationItem, {OPERATION_ROW_HEIGHT} from './OperationsListItem.shared.tsx';
import OperationModel from '../../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM} from '../../../../Utils/AppBusinessEnums.constants.ts';

/**
 * B1 : infobulle de l'icône d'opération (catégorie, sous-catégorie, statut/périodicité, légende).
 * MUI est réel (pas de mock de useMediaQuery) : le mode tactile est piloté par un stub de matchMedia.
 */

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

// Contexte budget scindé (AP 006) : seule la sélection (liste des comptes) est utilisée
vi.mock('../../../../hooks/useBudgetContext.ts', () => ({
    useBudgetSelection: () => ({
        comptes: [{id: 'cpt1', libelle: 'Livret A', itemIcon: 'livret.png'}],
    }),
}));

/** jsdom n'implémente pas matchMedia : simule un appareil tactile sans survol. */
const setTouch = () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query === TOUCH_QUERY,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
    }));
};

afterEach(() => {
    vi.unstubAllGlobals();
});

// Catégorie "Alimentation & Restau" -> #ffb200 = rgb(255, 178, 0) (couleur connue, sans avertissement console)
const RING_COLOR = '#123456'; // = rgb(18, 52, 86)

const buildOperation = (over: Partial<OperationModel> = {}): OperationModel => ({
    id: 'op1',
    libelle: 'Courses',
    valeur: -50,
    etat: OPERATION_ETATS_ENUM.PREVUE,
    statuts: [],
    categorie: {id: '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a', libelle: 'Alimentation'},
    ssCategorie: {id: 's1', libelle: 'Supermarché'},
    mensualite: {periode: PERIODES_MENSUALITE_ENUM.TRIMESTRIELLE},
    ...over,
} as unknown as OperationModel);

const mountItem = (operation: OperationModel, onClick = vi.fn(), ringMeaning?: 'etat' | 'periode') => {
    render(<SharedOperationItem operation={operation} onClick={onClick}
                                getBorderColor={() => RING_COLOR} ringMeaning={ringMeaning}/>);
    return onClick;
};

/** La ligne n'a ni rôle ni texte propre : accès par sélecteur CSS (texte propre vide). */
const getRow = () => screen.getByText('', {selector: '.operation-list-item'});

/** Attend que les infobulles soient retirées (transition de fermeture). */
const expectNoTooltip = () => waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());

/** Pastilles décoratives de l'infobulle (aria-hidden, sans texte). */
const getSwatches = (tooltip: HTMLElement) => within(tooltip).queryAllByText('', {selector: 'span[aria-hidden="true"]'});
const bg = (el: HTMLElement) => getComputedStyle(el).backgroundColor;

describe('Infobulle icône - courante, hors tactile (survol)', () => {
    test('aucune infobulle sans survol', () => {
        mountItem(buildOperation());
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('le survol affiche catégorie, sous-catégorie, statut et légende des 4 états', async () => {
        mountItem(buildOperation());
        await userEvent.hover(screen.getByRole('img', {name: 'Prévue'}));
        const tooltip = await screen.findByRole('tooltip');

        expect(within(tooltip).getByText('Alimentation')).toBeInTheDocument();
        expect(within(tooltip).getByText('Supermarché')).toBeInTheDocument();
        expect(within(tooltip).getByText('Statut : Prévue')).toBeInTheDocument();
        expect(within(tooltip).getByText("Anneau : état de l'opération")).toBeInTheDocument();
        // Match exact : « Statut : Prévue » n'entre pas en conflit avec l'entrée de légende « Prévue »
        for (const etat of ['Prévue', 'Reportée', 'Réalisée', 'Annulée']) {
            expect(within(tooltip).getByText(etat)).toBeInTheDocument();
        }
        expect(within(tooltip).queryByText(/Périodicité/)).not.toBeInTheDocument();
    });

    test('role="img" et aria-label d\'état inchangés par l\'infobulle (avant et après ouverture)', async () => {
        mountItem(buildOperation({etat: OPERATION_ETATS_ENUM.REALISEE}));
        const icone = screen.getByRole('img', {name: 'Réalisée'});
        expect(icone).toHaveAttribute('aria-label', 'Réalisée');
        await userEvent.hover(icone);
        await screen.findByRole('tooltip');
        // Ouverte, MUI relie l'infobulle par aria-labelledby (nom accessible = contenu) : l'attribut aria-label reste, lui, inchangé
        expect(icone).toHaveAttribute('role', 'img');
        expect(icone).toHaveAttribute('aria-label', 'Réalisée');
    });

    test('la fin du survol ferme l\'infobulle', async () => {
        mountItem(buildOperation());
        const icone = screen.getByRole('img', {name: 'Prévue'});
        await userEvent.hover(icone);
        await screen.findByRole('tooltip');
        await userEvent.unhover(icone);
        await expectNoTooltip();
    });

    test('le clic seul (sans survol) n\'ouvre pas l\'infobulle mais appelle onClick', async () => {
        const operation = buildOperation();
        const onClick = mountItem(operation);
        // fireEvent : userEvent.click survolerait d'abord l'icône
        fireEvent.click(screen.getByRole('img', {name: 'Prévue'}));
        await new Promise((r) => setTimeout(r, 300));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        expect(onClick).toHaveBeenCalledWith(operation);
    });

    test('curseur d\'aide sur l\'icône', () => {
        mountItem(buildOperation());
        expect(getComputedStyle(screen.getByRole('img', {name: 'Prévue'})).cursor).toBe('help');
    });
});

describe('Infobulle icône - pastilles de couleur', () => {
    test('pastille de catégorie = couleur de catégorie, pastille de statut = couleur de l\'anneau', async () => {
        mountItem(buildOperation());
        await userEvent.hover(screen.getByRole('img', {name: 'Prévue'}));
        const swatches = getSwatches(await screen.findByRole('tooltip'));
        // Ordre : catégorie, statut, puis 4 pastilles de légende
        expect(swatches).toHaveLength(6);
        expect(bg(swatches[0])).toBe('rgb(255, 178, 0)');
        expect(bg(swatches[1])).toBe('rgb(18, 52, 86)');
        // Légende : prévue #ed6c02, reportée #9c27b0, réalisée #2e7d32, annulée #ebebeb
        expect(bg(swatches[2])).toBe('rgb(237, 108, 2)');
        expect(bg(swatches[3])).toBe('rgb(156, 39, 176)');
        expect(bg(swatches[4])).toBe('rgb(46, 125, 50)');
        expect(bg(swatches[5])).toBe('rgb(235, 235, 235)');
    });
});

describe('Infobulle icône - etat absent', () => {
    test.each([[undefined], [null]])('etat=%s : ni role/aria-label, ni ligne Statut', async (etat) => {
        mountItem(buildOperation({etat: etat as unknown as OPERATION_ETATS_ENUM}));
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        // L'anneau n'a plus de rôle : on survole l'icône de catégorie qu'il contient
        await userEvent.hover(screen.getAllByTestId(/Icon$/)[0]);
        const tooltip = await screen.findByRole('tooltip');
        expect(within(tooltip).getByText('Alimentation')).toBeInTheDocument();
        expect(within(tooltip).queryByText(/Statut/)).not.toBeInTheDocument();
        // pastilles : catégorie + 4 de légende, pas de pastille de statut
        expect(getSwatches(tooltip)).toHaveLength(5);
    });
});

describe('Infobulle icône - récurrente (ringMeaning="periode")', () => {
    test('affiche « Périodicité : <texte> » sans légende des 4 états', async () => {
        mountItem(buildOperation(), vi.fn(), 'periode');
        await userEvent.hover(screen.getByRole('img', {name: 'Prévue'}));
        const tooltip = await screen.findByRole('tooltip');

        expect(within(tooltip).getByText('Périodicité : Trimestrielle')).toBeInTheDocument();
        expect(within(tooltip).getByText("Anneau : périodicité de l'opération")).toBeInTheDocument();
        expect(within(tooltip).queryByText(/Statut/)).not.toBeInTheDocument();
        for (const etat of ['Prévue', 'Reportée', 'Réalisée', 'Annulée']) {
            expect(within(tooltip).queryByText(etat)).not.toBeInTheDocument();
        }
        // pastilles : catégorie + périodicité uniquement
        expect(getSwatches(tooltip)).toHaveLength(2);
    });

    test('périodicité inconnue -> « N/D »', async () => {
        mountItem(buildOperation({mensualite: {periode: undefined} as never}), vi.fn(), 'periode');
        await userEvent.hover(screen.getByRole('img', {name: 'Prévue'}));
        expect(within(await screen.findByRole('tooltip')).getByText('Périodicité : N/D')).toBeInTheDocument();
    });
});

describe('Infobulle icône - tactile', () => {
    test('le tap ouvre l\'infobulle ET appelle onClick de la ligne ; le second tap ferme', async () => {
        setTouch();
        const operation = buildOperation();
        const onClick = mountItem(operation);

        // Référence prise avant ouverture : ouverte, le nom accessible devient le contenu de l'infobulle (aria-labelledby)
        const icone = screen.getByRole('img', {name: 'Prévue'});
        await userEvent.click(icone);
        const tooltip = await screen.findByRole('tooltip');
        expect(within(tooltip).getByText('Statut : Prévue')).toBeInTheDocument();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith(operation);

        await userEvent.click(icone);
        await expectNoTooltip();
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    test('le survol seul n\'ouvre pas', async () => {
        setTouch();
        mountItem(buildOperation());
        await userEvent.hover(screen.getByRole('img', {name: 'Prévue'}));
        await new Promise((r) => setTimeout(r, 300));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('un tap ailleurs ferme l\'infobulle', async () => {
        setTouch();
        render(<div><p>ailleurs</p>
            <SharedOperationItem operation={buildOperation()} onClick={vi.fn()} getBorderColor={() => RING_COLOR}/></div>);
        await userEvent.click(screen.getByRole('img', {name: 'Prévue'}));
        await screen.findByRole('tooltip');
        await userEvent.click(screen.getByText('ailleurs'));
        await expectNoTooltip();
    });

    test('ligne intercompte : une seule infobulle ouverte (icône <-> logo)', async () => {
        setTouch();
        mountItem(buildOperation({libelle: '[vers cpt1]Virement'}));

        const icone = screen.getByRole('img', {name: 'Prévue'});
        const logo = screen.getByRole('img', {name: 'Livret A'});

        // 1) infobulle de l'icône
        await userEvent.click(icone);
        expect(await screen.findByText('Statut : Prévue')).toBeInTheDocument();

        // 2) ouvrir celle du logo ferme celle de l'icône
        await userEvent.click(logo);
        expect(await screen.findByText(/Transfert intercompte/)).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText('Statut : Prévue')).not.toBeInTheDocument());
        expect(screen.getAllByRole('tooltip')).toHaveLength(1);

        // 3) et inversement
        await userEvent.click(icone);
        expect(await screen.findByText('Statut : Prévue')).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText(/Transfert intercompte/)).not.toBeInTheDocument());
        expect(screen.getAllByRole('tooltip')).toHaveLength(1);
    });
});

describe('Infobulle icône - non-régression', () => {
    test('ligne : hauteur 64px et flex-shrink 0', () => {
        mountItem(buildOperation());
        expect(OPERATION_ROW_HEIGHT).toBe(64);
        expect(getRow()).toHaveStyle({height: '64px', minHeight: '64px', flexShrink: '0'});
    });

    test('anneau : couleur issue de getBorderColor, 46px', () => {
        mountItem(buildOperation());
        expect(screen.getByRole('img', {name: 'Prévue'})).toHaveStyle({borderColor: RING_COLOR, width: '46px', height: '46px'});
    });
});
