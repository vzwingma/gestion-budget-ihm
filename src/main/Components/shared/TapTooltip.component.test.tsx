import {afterEach, describe, expect, test, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TapTooltip from './TapTooltip.component.tsx';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

/** jsdom n'implémente pas matchMedia : on simule un appareil tactile (ou non). */
const setTouch = (touch: boolean) => {
    vi.stubGlobal('matchMedia', (query: string) => ({
        matches: touch && query === TOUCH_QUERY,
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

describe('TapTooltip - hors tactile (survol)', () => {
    test('le survol ouvre l\'infobulle avec le titre', async () => {
        render(<TapTooltip title="Mon titre"><button>cible</button></TapTooltip>);
        await userEvent.hover(screen.getByRole('button', {name: 'Mon titre'}));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Mon titre');
    });

    test('le clic seul n\'ouvre pas l\'infobulle', async () => {
        render(<TapTooltip title="Mon titre"><button>cible</button></TapTooltip>);
        const cible = screen.getByRole('button', {name: 'Mon titre'});
        // fireEvent : un clic sans survol préalable (userEvent.click déplace d'abord le pointeur = survol)
        fireEvent.click(cible);
        await new Promise((r) => setTimeout(r, 300));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});

describe('TapTooltip - tactile (tap)', () => {
    test('le survol seul n\'ouvre pas', async () => {
        setTouch(true);
        render(<TapTooltip title="Mon titre"><button>cible</button></TapTooltip>);
        await userEvent.hover(screen.getByRole('button', {name: 'Mon titre'}));
        // laisse passer le délai d'ouverture (enterDelay) d'une infobulle de survol
        await new Promise((r) => setTimeout(r, 300));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('le tap ouvre, le second tap ferme', async () => {
        setTouch(true);
        render(<TapTooltip title="Mon titre"><button>cible</button></TapTooltip>);
        await userEvent.click(screen.getByRole('button'));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Mon titre');

        await userEvent.click(screen.getByRole('button'));
        // fermeture animée (transition) : le popper est retiré après le fondu
        await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    });

    test('un clic extérieur ferme l\'infobulle (ClickAwayListener)', async () => {
        setTouch(true);
        render(<div><p>ailleurs</p><TapTooltip title="Mon titre"><button>cible</button></TapTooltip></div>);
        await userEvent.click(screen.getByRole('button'));
        expect(await screen.findByRole('tooltip')).toBeInTheDocument();

        await userEvent.click(screen.getByText('ailleurs'));
        await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    });

    test('le clic n\'est pas stoppé : le onClick d\'un parent est appelé', async () => {
        setTouch(true);
        const onParentClick = vi.fn();
        render(
            <div onClick={onParentClick}>
                <TapTooltip title="Mon titre"><button>cible</button></TapTooltip>
            </div>
        );
        await userEvent.click(screen.getByRole('button'));
        expect(onParentClick).toHaveBeenCalledTimes(1);
        expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    });

    test('plusieurs instances : le tap sur la seconde ferme la première', async () => {
        setTouch(true);
        render(
            <div>
                <TapTooltip title="Titre A"><button>A</button></TapTooltip>
                <TapTooltip title="Titre B"><button>B</button></TapTooltip>
            </div>
        );
        await userEvent.click(screen.getByRole('button', {name: 'Titre A'}));
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Titre A');

        await userEvent.click(screen.getByRole('button', {name: 'Titre B'}));
        expect(await screen.findByText('Titre B')).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText('Titre A')).not.toBeInTheDocument());
        expect(screen.getAllByRole('tooltip')).toHaveLength(1);
    });
});
