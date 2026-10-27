import { describe, expect, test } from 'vitest';
import { getBanqueIconSrc } from './Banque.utils.ts';

const DEFAULT_ICON = '/img/icon.webp';

describe('getBanqueIconSrc', () => {

    test.each(['icone.png', 'caisse-epargne.webp', 'banque_1.svg', 'a.b.c', 'BNP'])(
        'nom de fichier sûr "%s" : chemin dans /img/banques/',
        (nom) => {
            expect(getBanqueIconSrc(nom)).toBe('/img/banques/' + nom);
        });

    test.each([
        ['remontée de répertoire', '../x'],
        ['remontée seule', '..'],
        ['.. au milieu du nom', 'a..b.png'],
        ['sous-répertoire', 'a/b'],
        ['antislash', 'a\b'],
        ['chemin absolu', '/etc/passwd'],
        ['chaîne vide', ''],
        ['espace', 'a b.png'],
        ['espace seul', ' '],
        ['.. encodé', '%2e%2e'],
        ['/ encodé', 'a%2fb'],
        ['deux-points (schéma)', 'javascript:alert(1)'],
        ['URL externe', 'https://evil.example/x.png'],
        ['retour à la ligne', 'a.png\n../x']
    ])('nom non sûr (%s) : icône par défaut', (_cas, nom) => {
        expect(getBanqueIconSrc(nom)).toBe(DEFAULT_ICON);
    });

    test('null et undefined : icône par défaut', () => {
        expect(getBanqueIconSrc(null)).toBe(DEFAULT_ICON);
        expect(getBanqueIconSrc(undefined)).toBe(DEFAULT_ICON);
    });

    test('valeur non textuelle (donnée API inattendue) : icône par défaut', () => {
        expect(getBanqueIconSrc(42 as any)).toBe(DEFAULT_ICON);
    });
});
