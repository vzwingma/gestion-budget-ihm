import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OperationStatus from './OperationStatus.renderer.tsx';
import { OPERATION_STATUS_ENUM } from '../AppBusinessEnums.constants.ts';

/** Simule `matchMedia` : `matches` pilote `useMediaQuery(down('lg'))` (true = mobile) */
function stubMatchMedia(matches: boolean) {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches, media: query, onchange: null,
        addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn()
    }));
}

describe('OperationStatus', () => {

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test.each([null, undefined])('statuts %s : rien n est rendu', (statuts) => {
        const { container } = render(<OperationStatus statutsOperation={statuts as any} />);

        expect(container).toBeEmptyDOMElement();
    });

    test('EN_RETARD : icône avec info-bulle "En retard"', () => {
        render(<OperationStatus statutsOperation={[OPERATION_STATUS_ENUM.EN_RETARD]} />);

        expect(screen.getByLabelText('En retard')).toBeInTheDocument();
        expect(screen.getByTestId('WatchLaterRoundedIcon')).toBeInTheDocument();
    });

    test('DERNIERE_ECHEANCE : icône avec info-bulle', () => {
        render(<OperationStatus statutsOperation={[OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE]} />);

        expect(screen.getByLabelText('Dernière échéance ce mois')).toBeInTheDocument();
        expect(screen.getByTestId('FlagCircleRoundedIcon')).toBeInTheDocument();
    });

    test('EN_RETARD prioritaire sur DERNIERE_ECHEANCE', () => {
        render(<OperationStatus statutsOperation={[OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE, OPERATION_STATUS_ENUM.EN_RETARD]} />);

        expect(screen.getByTestId('WatchLaterRoundedIcon')).toBeInTheDocument();
        expect(screen.queryByTestId('FlagCircleRoundedIcon')).not.toBeInTheDocument();
    });

    test('statut non géré : affichage brut séparé par ||', () => {
        render(<OperationStatus statutsOperation={[OPERATION_STATUS_ENUM.EN_RETARD_LEGACY, 'AUTRE' as any]} />);

        expect(screen.getByText('[En Retard]||AUTRE')).toBeInTheDocument();
    });

    test.each([
        ['mobile', true, '20px'],
        ['desktop', false, '26px']
    ])('taille des icônes sur %s : %s', (_ecran, mobile, taille) => {
        stubMatchMedia(mobile);
        render(<OperationStatus statutsOperation={[OPERATION_STATUS_ENUM.EN_RETARD]} />);
        render(<OperationStatus statutsOperation={[OPERATION_STATUS_ENUM.DERNIERE_ECHEANCE]} />);

        expect(screen.getByTestId('WatchLaterRoundedIcon')).toHaveStyle({ width: taille, height: taille });
        expect(screen.getByTestId('FlagCircleRoundedIcon')).toHaveStyle({ width: taille, height: taille });
    });
});
