import MsInfoModel from './MsInfo.model.ts';

describe('MsInfo.model', () => {

    test('initialise le modèle avec nom et version', () => {
        const model = new MsInfoModel('API Comptes', '1.2.3');

        expect(model.nom).toBe('API Comptes');
        expect(model.version).toBe('1.2.3');
    });
});
