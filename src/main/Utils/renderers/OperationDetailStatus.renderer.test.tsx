import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OperationDetailStatus from './OperationDetailStatus.renderer.tsx';
import { OPERATION_STATUS_ENUM } from '../AppBusinessEnums.constants.ts';

/** Simule `matchMedia` : `matches` pilote `useMediaQuery(down('lg'))` (true = mobile) */
function stubMatchMedia(matches: boolean) {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn()
    }));
}

describe('OperationDetailStatus', () => {

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('statuts null : rien n\'est rendu', () => {
        const { container } = render(<OperationDetailStatus statutsOperation={null as any} />);

        expect(container).toBeEmptyDOMElement();
    });

    test('statuts undefined : rien n\'est rendu', () => {
        const { container } = render(<OperationDetailStatus statutsOperation={undefined as any} />);

        expect(container).toBeEmptyDOMElement();
    });

    test('EN_RETARD : badge "EN RETARD" avec info-bulle', () => {
        render(<OperationDetailStatus statutsOperation={[OPERATION_STATUS_ENUM.EN_RETARD]} />);

        expect(screen.getByText('EN RETARD')).toBeInTheDocument();
        expect(screen.getByLabelText('En retard')).toBeInTheDocument();
        expect(screen.getByTestId('WatchLaterRoundedIcon')).toBeInTheDocument();
    });

    test('DERNIERE_ECHEANCE : badge "DERNIÈRE ÉCHÉANCE" avec info-bulle', () => {
        render(<OperationDetailStatus statutsOperation={[OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE]} />);

        expect(screen.getByText('DERNIÈRE ÉCHÉANCE')).toBeInTheDocument();
        expect(screen.getByLabelText('Dernière échéance ce mois')).toBeInTheDocument();
        expect(screen.getByTestId('FlagCircleRoundedIcon')).toBeInTheDocument();
    });

    test('EN_RETARD prioritaire sur DERNIERE_ECHEANCE quand les deux sont présents', () => {
        render(<OperationDetailStatus statutsOperation={[OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE, OPERATION_STATUS_ENUM.EN_RETARD]} />);

        expect(screen.getByText('EN RETARD')).toBeInTheDocument();
        expect(screen.queryByText('DERNIÈRE ÉCHÉANCE')).not.toBeInTheDocument();
    });

    test('statut non géré (ex. legacy) : affichage brut des statuts, séparés par ||', () => {
        render(<OperationDetailStatus statutsOperation={[OPERATION_STATUS_ENUM.EN_RETARD_LEGACY, 'AUTRE' as any]} />);

        expect(screen.getByText('[En Retard]||AUTRE')).toBeInTheDocument();
        expect(screen.queryByText('EN RETARD')).not.toBeInTheDocument();
    });

    test('liste vide : aucun badge', () => {
        render(<OperationDetailStatus statutsOperation={[]} />);

        expect(screen.queryByText('EN RETARD')).not.toBeInTheDocument();
        expect(screen.queryByText('DERNIÈRE ÉCHÉANCE')).not.toBeInTheDocument();
    });

    test.each([
        ['mobile', true, '22px'],
        ['desktop', false, '30px']
    ])('taille des icônes sur %s : %s', (_ecran, mobile, taille) => {
        stubMatchMedia(mobile);
        render(<OperationDetailStatus statutsOperation={[OPERATION_STATUS_ENUM.EN_RETARD]} />);
        render(<OperationDetailStatus statutsOperation={[OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE]} />);

        expect(screen.getByTestId('WatchLaterRoundedIcon')).toHaveStyle({ width: taille, height: taille });
        expect(screen.getByTestId('FlagCircleRoundedIcon')).toHaveStyle({ width: taille, height: taille });
    });
});
