import ProfileUserModel from './ProfileUser.model.ts';

describe('ProfileUser.model', () => {

    test('initialise le profil utilisateur', () => {
        const model = new ProfileUserModel('u1', 'ADMIN', 'DARK_MODE', 1700000000);

        expect(model.idUtilisateur).toBe('u1');
        expect(model.droit).toBe('ADMIN');
        expect(model.preference).toBe('DARK_MODE');
        expect(model.lastAccessTime).toBe(1700000000);
    });
});
