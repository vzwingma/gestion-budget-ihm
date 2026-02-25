import {UTILISATEUR_DROITS} from './AppBusinessEnums.constants.ts';
import {getCompteGroupByOwner, userHasPermission} from './UserData.utils.ts';

describe('UserData.utils', () => {

    test('vérifie les permissions utilisateur', () => {
        const droits = [UTILISATEUR_DROITS.DROIT_CLOTURE_BUDGET, UTILISATEUR_DROITS.DROIT_CREATE_OPERATION];

        expect(userHasPermission(droits, UTILISATEUR_DROITS.DROIT_CLOTURE_BUDGET)).toBeTruthy();
        expect(userHasPermission(droits, UTILISATEUR_DROITS.DROIT_RAZ_BUDGET)).toBeFalsy();
    });

    test('groupe les comptes actifs par propriétaire connecté', () => {
        const comptes = [
            {
                id: 'c1',
                actif: true,
                proprietaires: [{login: 'john.doe'}, {login: 'other.user'}]
            },
            {
                id: 'c2',
                actif: true,
                proprietaires: [{login: 'jane.doe'}]
            },
            {
                id: 'c3',
                actif: false,
                proprietaires: [{login: 'john.doe'}]
            }
        ] as any[];

        const groups = getCompteGroupByOwner(comptes as any, 'john.doe');

        expect(Object.keys(groups)).toEqual(['John']);
        expect(groups.John).toHaveLength(1);
        expect(groups.John[0].id).toBe('c1');
    });

    test('retourne Unknown si le propriétaire principal est vide', () => {
        const comptes = [
            {
                id: 'c1',
                actif: true,
                proprietaires: [{login: ''}]
            }
        ] as any[];

        const groups = getCompteGroupByOwner(comptes as any, '');

        expect(Object.keys(groups)).toEqual(['Unknown']);
        expect(groups.Unknown).toHaveLength(1);
    });
});
