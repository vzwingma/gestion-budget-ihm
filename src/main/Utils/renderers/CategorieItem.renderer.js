"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategorieIcon = exports.getCategorieColor = void 0;
var icons_material_1 = require("@mui/icons-material");
var react_1 = __importDefault(require("react"));
/**
 * Couleur de la catégorie
 * @param operationCategorie catégorie de l'opération
 * @returns {string} color catégorie
 */
function getCategorieColor(operationCategorie) {
    if ((operationCategorie === null || operationCategorie === void 0 ? void 0 : operationCategorie.id) != null) {
        switch (operationCategorie.id) {
            case 'ea6dcc12-3349-4047-a1e5-cd1d7254f16e': // Virement
                return "#18c95d";
            case '504beea7-ed52-438a-aced-15e9603b82ab': // Prélèvement
                return "#fc5d6a";
            case '8557f0b1-be6d-4cb9-a0a0-815c64bf4696': // Economie
                return "#89d1ff";
            case 'c35fde2a-55ec-4a27-9519-5ef5daf46799': // Transport
                return "#00cbcb";
            case '270f314a-b3e5-4e05-bc96-4e2fadc4a9d3': // Frais
                return "#c294c2";
            case '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a': // Alimentation
                return "#ffb200";
            case 'b20a46a5-92ab-47a8-a70d-ecb64ddf02ce': // Frais remboursable
                return "#ff87c2";
            case '94669a73-2563-4a31-8d67-35a8d96d8686': // Divers
                return "#9fc3d3";
            default:
                console.warn("L'Opération " + operationCategorie.id + " n'a pas de couleur de fond définie");
        }
    }
    return "#808080";
}
exports.getCategorieColor = getCategorieColor;
/**
 * Icone par catégories et sous catégorie
 * @param operationCategorie : object catégprie
 * @returns {JSX.Element} icone MaterialUI
 */
function getCategorieIcon(operationCategorie) {
    if (operationCategorie != null) {
        var icon = getCategorieIconVirement(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
        icon = getCategorieIconPrelevement(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
        icon = getCategorieIconFrais(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
        icon = getCategorieIconFraisRemboursable(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
        icon = getCategorieIconAlimentation(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
        icon = getCategorieIconDivers(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
        icon = getCategorieIconTransport(operationCategorie.id);
        if (icon != null) {
            return icon;
        }
    }
    return <icons_material_1.QuestionMarkRounded />;
}
exports.getCategorieIcon = getCategorieIcon;
/**
 * Catégorie Virement
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconVirement(idCategorie) {
    switch (idCategorie) {
        case 'ea6dcc12-3349-4047-a1e5-cd1d7254f16e': // VIREMENTS
            return <icons_material_1.AccountBalanceRounded />;
        case '885e0d9a-6f3c-4002-b521-30169baf7123': // Remboursement
            return <icons_material_1.AddCardRounded />;
        case 'ed3f6100-5dbd-4b68-860e-0c97ae1bbc63': // Intercomptes
            return <icons_material_1.CurrencyExchangeRounded />;
        case 'd005de34-f768-4e96-8ccd-70399792c48f': // Salaires
            return <icons_material_1.EuroSymbolRounded />;
        default:
            return null;
    }
}
/**
 * Catégorie Divers
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconDivers(idCategorie) {
    switch (idCategorie) {
        // DIVERS
        case '94669a73-2563-4a31-8d67-35a8d96d8686': // DIVERS
            return <icons_material_1.SportsEsportsRounded />;
        case '76c99cbf-babb-40e6-ac13-0ac08661c9a7': // Dépense
            return <icons_material_1.AddShoppingCartRounded />;
        case '430a455b-e5ba-4b13-b031-bcf0e63f102e': // Retrait
            return <icons_material_1.AtmRounded />;
        case '4269692d-7eec-4569-9443-5f77dc2e4cbc': // Loisir
            return <icons_material_1.TravelExploreRounded />;
        case '603072b2-2bfc-43ad-b2de-028c9f28ba0a': // Travaux
            return <icons_material_1.ConstructionRounded />;
        default:
            return null;
    }
}
/**
 * Catégorie Prelevement
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconPrelevement(idCategorie) {
    switch (idCategorie) {
        case '504beea7-ed52-438a-aced-15e9603b82ab': // PRELEVEMENTS
            return <icons_material_1.CreditScoreRounded />;
        case '6ae3d4c2-f0cc-4abc-b0ce-da39c1a06846': // Assurance
            return <icons_material_1.AssuredWorkloadRounded />;
        case 'dc5a2d65-19f5-4f3d-a44a-e63e9abe3ac6': // Loyer
            return <icons_material_1.HomeRounded />;
        case '55fc700b-24c6-4d95-9005-667af949537d': // Telecom
            return <icons_material_1.PhoneAndroidRounded />;
        case '0f19a626-98ab-418c-8e94-865e6ea0d4a3': // Impots
            return <icons_material_1.BalanceRounded />;
        case '1da40127-af16-4245-9ea8-6eca974905c6': // Electricite
            return <icons_material_1.ElectricBoltRounded />;
        case '1da29b11-3100-446e-a257-0d0a240e3f8e': // Don
            return <icons_material_1.VolunteerActivismOutlined />;
        case 'ccac974b-52c7-4b0b-94d4-8831b13800d1': // Gaz
            return <icons_material_1.GasMeterRounded />;
        case 'db0b202a-0c90-44e5-8e34-7caa609e07fb': // Charges Appartement
            return <icons_material_1.HomeRounded />;
        case '11f405f8-7301-4663-8c99-23d1f99598bb': // Remboursement crédit
            return <icons_material_1.AccountBalanceRounded />;
        default:
            return null;
    }
}
/**
 * Catégorie Frais Remboursable
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconFraisRemboursable(idCategorie) {
    switch (idCategorie) {
        case 'b20a46a5-92ab-47a8-a70d-ecb64ddf02ce': // FRAIS REMBOURSABLES
            return <icons_material_1.MedicationLiquidRounded />;
        case '6e96b0c3-ecc5-4be8-8087-0087b5e46baf': // Santé
            return <icons_material_1.HealthAndSafetyRounded />;
        case 'bd28c498-a774-4a67-b6ec-a135d39fca46': // Pro
            return <icons_material_1.ContactPhoneRounded />;
        default:
            return null;
    }
}
/**
 * Catégorie Transport
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconTransport(idCategorie) {
    switch (idCategorie) {
        // TRANSPORT
        case 'c35fde2a-55ec-4a27-9519-5ef5daf46799': // TRANSPORTS
            return <icons_material_1.EmojiTransportationRounded />;
        case 'e9dadc12-73d2-4956-8936-044115de7723': // Taxi
            return <icons_material_1.LocalTaxiRounded />;
        case 'cdd8dbcf-1475-4bd7-b69c-20467f844d91': // Parking
            return <icons_material_1.LocalParkingRounded />;
        case 'a692bb6c-d7d4-4e67-b7a9-96551dea03c0': // Péages
            return <icons_material_1.TollRounded />;
        case 'f6dd5c41-6ba6-4297-9455-66567ab4556d': // Location
            return <icons_material_1.CarRentalRounded />;
        case '7e8b606e-02d4-4555-9852-307ce9927ce4': // Carburant
            return <icons_material_1.LocalGasStationRounded />;
        case 'ad8e07f0-cb0a-4bf2-9a8b-ccd7d69d17cd': // Entretien
            return <icons_material_1.EngineeringRounded />;
        case '2dbd8add-4a8d-4d05-a325-08b7e85d6ac9': // Recharge
            return <icons_material_1.ElectricCarRounded />;
        case 'bbc1f327-35cb-4db6-8134-61af30d3246c': // Assurance
            return <icons_material_1.NoCrashRounded />;
        case '80698e57-4f34-42f8-b3ee-0487df01f0a1': // Transport en commun
            return <icons_material_1.DirectionsBusRounded />;
        default:
            return null;
    }
}
/**
 * Catégorie Frais
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconFrais(idCategorie) {
    switch (idCategorie) {
        // FRAIS
        case '270f314a-b3e5-4e05-bc96-4e2fadc4a9d3': // FRAIS
            return <icons_material_1.DescriptionRounded />;
        case 'eeb2f9a5-49b4-4c44-86bf-3bd626412d8e': // Santé
            return <icons_material_1.LocalHospitalRounded />;
        case 'f9cbdc91-73d2-4956-8936-044115de7723': // Banque
            return <icons_material_1.AccountBalanceWalletRounded />;
        default:
            return null;
    }
}
/**
 * Catégorie Alimentation
 * @param idCategorie : string idCatégorie
 * @returns {JSX.Element|null}
 */
function getCategorieIconAlimentation(idCategorie) {
    switch (idCategorie) {
        // ALIMENTATION
        case '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a': // ALIMENTATION
            return <icons_material_1.RestaurantMenuRounded />;
        case '62607c4a-b32d-4abf-85c7-ac0c10cdb65c': // Cantine
            return <icons_material_1.LocalCafeRounded />;
        case '84022f20-f31a-4369-a4bb-de62ab778fd0': // Restaurant
            return <icons_material_1.BrunchDiningRounded />;
        case '467496e4-9059-4b9b-8773-21f230c8c5c6': // Courses
            return <icons_material_1.ShoppingCartCheckoutRounded />;
        default:
            return null;
    }
}
