import {
    AccountBalanceRounded,
    AccountBalanceWalletRounded,
    AddCardRounded,
    AddShoppingCartRounded,
    AppShortcutRounded,
    AssuredWorkloadRounded,
    AtmRounded,
    AudiotrackRounded,
    AutorenewRounded,
    AutoStoriesRounded,
    BabyChangingStationRounded,
    BalanceRounded,
    BoyRounded,
    BrunchDiningRounded,
    CardGiftcardRounded,
    CarRentalRounded,
    CheckroomRounded,
    ChildCareRounded,
    ColorLensRounded,
    ConstructionRounded,
    ContactPhoneRounded,
    ContentCutRounded,
    CreditScoreRounded,
    CurrencyExchangeRounded,
    DirectionsBusRounded,
    DownhillSkiingRounded,
    DrawRounded,
    DriveEtaRounded,
    DynamicFeedRounded,
    ElectricBoltRounded,
    ElectricCarRounded,
    EmojiTransportationRounded,
    EngineeringRounded,
    EuroSymbolRounded,
    Face3Rounded,
    FaceRetouchingNaturalRounded,
    FaxRounded,
    FlightRounded,
    FlightTakeoffRounded,
    FormatPaintRounded,
    GasMeterRounded,
    HealthAndSafetyRounded,
    HomeRounded,
    HotelRounded,
    HouseRounded,
    LocalBarRounded,
    LocalCafeRounded,
    LocalGasStationRounded,
    LocalHospitalRounded,
    LocalParkingRounded,
    LocalTaxiRounded,
    MarkAsUnreadRounded,
    MedicalInformationRounded,
    MedicationLiquidRounded,
    MenuBookRounded,
    MoneyOffCsredRounded,
    MonitorHeartRounded,
    MuseumRounded,
    NoCrashRounded,
    PedalBikeRounded,
    PoolRounded,
    PrintRounded,
    QrCode2Rounded,
    QuestionMarkRounded,
    RestaurantMenuRounded,
    RestaurantRounded,
    SavingsRounded,
    SchoolRounded,
    ScubaDivingRounded,
    ShoppingCartCheckoutRounded,
    ShoppingCartRounded,
    SmartphoneRounded,
    SmartToyRounded,
    SportsEsportsRounded,
    SportsHandballRounded,
    TollRounded,
    TrainRounded,
    TravelExploreRounded,
    TvRounded,
    VaccinesRounded,
    VideogameAssetOffRounded,
    VolunteerActivismOutlined,
    WifiRounded
} from "@mui/icons-material";
import React, {JSX} from "react";
import CategorieOperationModel from "../../Models/budgets/CategorieOperation.model";

/**
 * Couleur de la catégorie
 * @returns {string} color catégorie
 * @param idCategorieOperation
 */
export function getCategorieColor(idCategorieOperation: string | null): string {
    type ColorMapKeys = keyof typeof colorMap;
    const colorMap = {
        'b4827cca-bbb4-43af-89e1-4f2ced806343': "#c294c2", // Abonnement
        '6b6ed140-1622-46b7-81e0-4dcfa2f8c48b': "#fe3366", // Achats et Shopping
        '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a': "#ffb200", // Alimentation & Restau
        'c35fde2a-55ec-4a27-9519-5ef5daf46799': "#00cbcb", // Transport
        '3c1659f7-1b7e-49d5-ad80-5d389086833d': "#b78667", // Banque
        '7dd33b1b-ca85-4b46-af6c-a21ef2d8e52a': "#717fc3", // Dépense Pro
        '94669a73-2563-4a31-8d67-35a8d96d8686': "#9fc3d3", // Divers
        '9752075d-41c9-4ea2-afa3-b20a00f3b1e0': "#ff87c2", // Esthétique et Soins
        '48dca53a-2860-464c-8c1a-a6b0586c4619': "#89d1ff", // Impôts et Taxes
        '6d9beb63-b751-4dd6-ad8b-2c32645b823c': "#677fe0", // Logement
        'f46ee1ac-ac11-48eb-add4-11fae30d8124': "#9b59b6", // Loisirs et Sorties
        'c98df97e-afc0-445e-8585-28d5ab2be429': "#18c95d", // Retraits et Virements
        'b20a46a5-92ab-47a8-a70d-ecb64ddf02ce': "#fc5d6a", // Santé
        '84d00049-bee6-47e9-b424-5246580b020a': "#f9b68b", // Scolarité et enfants
        'c4489fe2-8613-44c3-9eec-72febe6eb2e2': "#F98B97", // Enfants
        'ea6dcc12-3349-4047-a1e5-cd1d7254f16e': "#54de3d"  // Rentrées
    };

    return idCategorieOperation && colorMap[idCategorieOperation as ColorMapKeys]
        ? colorMap[idCategorieOperation as ColorMapKeys]
        : (console.warn("L'Opération " + idCategorieOperation + " n'a pas de couleur de fond définie"), "#808080");
}


/**
 * Icone par catégories et sous catégorie
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element} icone MaterialUI
 */
export function getCategorieIcon(categorieOperation: CategorieOperationModel): JSX.Element {
    if (!categorieOperation) return <QuestionMarkRounded/>;

    const iconFunctions = [
        getCategorieIconRentree,
        getCategorieIconDivers,
        getCategorieIconRetraitsVirements,
        getCategorieIconSante,
        getCategorieIconTransport,
        getCategorieIconAlimentation,
        getCategorieIconEsthetiqueSoins,
        getCategorieIconAbonnement,
        getCategorieIconAchatShopping,
        getCategorieIconBanque,
        getCategorieIconDepensesPro,
        getCategorieIconImpotsTaxes,
        getCategorieIconLogement,
        getCategorieIconLoisirsSorties,
        getCategorieIconScolariteEnfants,
        getCategorieIconEnfants
    ];

    for (const fn of iconFunctions) {
        const icon = fn(categorieOperation);
        if (icon) return icon;
    }

    return <QuestionMarkRounded/>;
}
/**
 * Catégorie Virement
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconRentree(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        'ea6dcc12-3349-4047-a1e5-cd1d7254f16e': <AccountBalanceRounded/>, // RENTREES
        'acd54ec1-efea-494f-90d9-7d14ec6c7d91': <AccountBalanceWalletRounded/>, // Autres
        '8225729d-a5ef-432c-95f0-491960a8cd7c': <AccountBalanceWalletRounded/>, // Dépot
        '0ac9b429-cf83-4115-8585-2e935e1c4c01': <SavingsRounded/>, // Economie
        '1db554f3-89a8-48e5-84b6-5e5b81b8ef3a': <EuroSymbolRounded/>, // Intérêts
        '885e0d9a-6f3c-4002-b521-30169baf7123': <AddCardRounded/>, // Remboursement
        'd005de34-f768-4e96-8ccd-70399792c48f': <EuroSymbolRounded/>, // Virement

        '5ab06ee0-356c-49fb-b47b-7dc5508fc777': <AccountBalanceWalletRounded/>, // Subventions
        '2ac80be1-2ec6-4bc2-b9d0-0e5019a086f2': <EuroSymbolRounded/>, // Ventes
        
        'ed3f6100-5dbd-4b68-860e-0c97ae1bbc74': <CurrencyExchangeRounded/>, // --> Virements internes
        
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Divers
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconDivers(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '94669a73-2563-4a31-8d67-35a8d96d8686': <SportsEsportsRounded/>, // DIVERS
        '76c99cbf-babb-40e6-ac13-0ac08661c9a7': <AddShoppingCartRounded/>, // Dépense
        '1da29b11-3100-446e-a257-0d0a240e3f8e': <VolunteerActivismOutlined/>, // Don
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Prelevement
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconRetraitsVirements(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '504beea7-ed52-438a-aced-15e9603b82ab': <CreditScoreRounded/>, // PRELEVEMENTS
        '430a455b-e5ba-4b13-b031-bcf0e63f102e': <AtmRounded/>, // Retrait
        'ed3f6100-5dbd-4b68-860e-0c97ae1bbc63': <CurrencyExchangeRounded/>, // Virements Intercomptes ->
        '0ab7aeba-d954-41f4-a424-f523050528b4': <EuroSymbolRounded/> // Virements
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Frais Remboursable
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconSante(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        'b20a46a5-92ab-47a8-a70d-ecb64ddf02ce': <MonitorHeartRounded/>, // Santé
        '6e96b0c3-ecc5-4be8-8087-0087b5e46baf': <HealthAndSafetyRounded/>, // Medecin
        'a705ff05-3589-4b9f-8884-ff0716342309': <HealthAndSafetyRounded/>, // Dentiste
        '40fab2c5-b6dd-4834-ba09-7c2fe93bbc81': <MedicalInformationRounded/>, // Mutuelle
        '347c8e22-b021-4bd6-bffc-0d683925cf29': <HealthAndSafetyRounded/>, // Opticien
        'eeb2f9a5-49b4-4c44-86bf-3bd626412d8e': <LocalHospitalRounded/>, // Pharmacie
        'f2536d64-e2fc-47cd-bae3-f5813b3a4b3a': <MedicationLiquidRounded/> // Autres
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Transport
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconTransport(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        'c35fde2a-55ec-4a27-9519-5ef5daf46799': <EmojiTransportationRounded/>, // TRANSPORTS
        'e9dadc12-73d2-4956-8936-044115de7723': <LocalTaxiRounded/>, // Taxi
        'cdd8dbcf-1475-4bd7-b69c-20467f844d91': <LocalParkingRounded/>, // Stationnement
        'a692bb6c-d7d4-4e67-b7a9-96551dea03c0': <TollRounded/>, // Péages
        'f6dd5c41-6ba6-4297-9455-66567ab4556d': <CarRentalRounded/>, // Location
        '7e8b606e-02d4-4555-9852-307ce9927ce4': <LocalGasStationRounded/>, // Carburant
        'ad8e07f0-cb0a-4bf2-9a8b-ccd7d69d17cd': <EngineeringRounded/>, // Entretien
        '2dbd8add-4a8d-4d05-a325-08b7e85d6ac9': <ElectricCarRounded/>, // Recharge
        'bbc1f327-35cb-4db6-8134-61af30d3246c': <NoCrashRounded/>, // Assurance
        'd67224cd-a2d1-429f-8e6c-2fb957109afa': <FlightRounded/>, // Billets d'avion
        '973f3410-a3af-4107-98f2-518169898a93': <TrainRounded/>, // Billets de train
        '80698e57-4f34-42f8-b3ee-0487df01f0a1': <DirectionsBusRounded/> // Transport en commun
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}


/**
 * Catégorie Alimentation
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconAlimentation(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a': <RestaurantMenuRounded/>, // ALIMENTATION
        '62607c4a-b32d-4abf-85c7-ac0c10cdb65c': <LocalCafeRounded/>, // Cantine
        '84022f20-f31a-4369-a4bb-de62ab778fd0': <BrunchDiningRounded/>, // Restaurant
        '467496e4-9059-4b9b-8773-21f230c8c5c6': <ShoppingCartCheckoutRounded/>, // Courses
        '35dc6566-f481-434d-90f7-dc9c18a26b45': <MenuBookRounded/> // Autres
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Esthetique & Soins
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconEsthetiqueSoins(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '9752075d-41c9-4ea2-afa3-b20a00f3b1e0': <FaceRetouchingNaturalRounded/>, // ESTHETIQUE & SOINS
        'a369c994-16da-4b4e-9c2d-22c7c72f2de4': <ContentCutRounded/>, // Coiffeur
        '07ddb8a0-17e2-4920-9855-ce35cff33893': <Face3Rounded/>, // Cosmétiques
        'e7832ce3-a38e-4857-8e7d-ce6126b8e65f': <Face3Rounded/>, // Esthetique
        '0cd7662e-e1cc-4c77-af90-054eb41e296a': <FaceRetouchingNaturalRounded/>, // Autres
        'a17fcbb2-dd69-4dea-a0c7-a9a63fccf857': <Face3Rounded/>, // Massage
    };        
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}


/**
 * Catégorie Abonnements
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconAbonnement(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        'b4827cca-bbb4-43af-89e1-4f2ced806343': <SmartphoneRounded/>, // ABONNEMENTS
        '546c2719-2d3f-458d-a257-8a4778c79a2c': <AutorenewRounded/>, // Autres
        '19815379-2a25-436d-b0af-e43f8dd35bb3': <WifiRounded/>, // Internet
        '7fdcef02-97d4-46e0-a240-93753d5adea6': <SmartphoneRounded/>, // Telephonie Mobile
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Achat Shopping
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconAchatShopping(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '6b6ed140-1622-46b7-81e0-4dcfa2f8c48b': <ShoppingCartRounded/>, // ACHATS SHOPPING
        '3ce6541a-65a6-437b-9e93-13adb636f0ec': <DynamicFeedRounded/>, // Autres
        '4f2ff046-cb2d-49bd-be93-091cf24e11c8': <PoolRounded/>, // Articles de sport
        'cd0e6a50-c997-4265-9478-dce7e7fd4fb6': <CardGiftcardRounded/>, // Cadeaux
        'cfaa6f24-728f-43d6-9b81-80820fff2f85': <AppShortcutRounded/>, // High-Tech
        '9fe1a799-dc42-4623-8d9e-03a8d70b06f1': <QrCode2Rounded/>, // Licences
        '0767cbc4-b7f1-46a4-94e7-1e5be51b7a47': <AutoStoriesRounded/>, // Livres
        '3aa7de90-e628-4936-8d1b-f00fcdcc05d8': <AudiotrackRounded/>, // Musiques
        'd26c4b59-bec6-46fe-8348-e2bfdbfcf711': <CheckroomRounded/>, // Vêtements
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Banque
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconBanque(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '3c1659f7-1b7e-49d5-ad80-5d389086833d': <AccountBalanceRounded/>, // BANQUE
        '9cad2a31-14c8-45b2-949f-f8cbb4e888d9': <AccountBalanceRounded/>, // Autres
        'b8b59891-1d6b-4b9c-8b29-7d034b6f8816': <SavingsRounded/>, // Epargne
        'f9cbdc91-73d2-4956-8936-044115de7723': <AccountBalanceWalletRounded/>, // Frais bancaire
        'df1f6d16-1ce6-4952-af74-d557d917eb5c': <MoneyOffCsredRounded/>, // Incident de paiement
        '11f405f8-7301-4663-8c99-23d1f99598bb': <AccountBalanceRounded/>, // Remboursement crédit
        '2963fc0d-d923-4580-bc8c-ed742f4f7df4': <AssuredWorkloadRounded/>, // Services bancaires
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Dépenses Pro
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconDepensesPro(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '7dd33b1b-ca85-4b46-af6c-a21ef2d8e52a': <PrintRounded/>, // DEPENSES PRO
        '49f4089c-bef8-4d9d-92fe-3cf86a67290a': <PrintRounded/>, // Autres
        '9d020007-1b0e-4a8e-b881-f6867d55001e': <ShoppingCartRounded/>, // Services en ligne
        '9dcbe0a0-b0f8-4c4f-8bb7-2d6512d6df8a': <MarkAsUnreadRounded/>, // Frais d'expédition
        'f73410e6-57b5-4eee-ab93-a7748cfc7d69': <FaxRounded/>, // Fourniture de bureau
        'bd28c498-a774-4a67-b6ec-a135d39fca46': <ContactPhoneRounded/>, // Notes de frais
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Impots Taxes
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconImpotsTaxes(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '48dca53a-2860-464c-8c1a-a6b0586c4619': <BalanceRounded/>, // IMPOTS TAXES
        'a82c8928-88bc-4a6b-bdb7-11a5117df4f1': <DriveEtaRounded/>, // Amendes
        '07a9f803-5716-4eb6-871f-b93ceffea5df': <BalanceRounded/>, // Autres
        '0f19a626-98ab-418c-8e94-865e6ea0d4a3': <BalanceRounded/>, // Impots
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Logements
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconLogement(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '6d9beb63-b751-4dd6-ad8b-2c32645b823c': <HouseRounded/>, // LOGEMENT        
        '6ae3d4c2-f0cc-4abc-b0ce-da39c1a06846': <AssuredWorkloadRounded/>, // Assurance
        'db0b202a-0c90-44e5-8e34-7caa609e07fb': <HomeRounded/>, // Charges Appartement
        'dc5a2d65-19f5-4f3d-a44a-e63e9abe3ac6': <HomeRounded/>, // Loyer
        '1da40127-af16-4245-9ea8-6eca974905c6': <ElectricBoltRounded/>, // Electricite
        'ccac974b-52c7-4b0b-94d4-8831b13800d1': <GasMeterRounded/>, // Gaz
        'b07ef285-d59c-424c-8fcf-087caf2f8a60': <FormatPaintRounded/>, // Décoration
        '603072b2-2bfc-43ad-b2de-028c9f28ba0a': <ConstructionRounded/>, // Travaux,
        'ed41ea02-6201-48cc-9648-103a10b8e5cd': <HouseRounded/>, // Autres
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}

/**
 * Catégorie Loisirs Sorties
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconLoisirsSorties(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        'f46ee1ac-ac11-48eb-add4-11fae30d8124': <TravelExploreRounded/>, // Loisirs et Sorties        
        '6b005af6-90e0-402e-8472-1eac0b6b476d': <LocalBarRounded/>, // Bar
        '6974d65e-ad75-4725-823a-a421a2dcbe20': <TvRounded/>, // Divertissement
        'a2cfdd06-3730-4ffd-8a28-11cca8902d1b': <VideogameAssetOffRounded/>, // Hobbies
        '69e7baa5-faa5-4416-872e-29481cacdb4a': <HotelRounded/>, // Hotels
        'f389aeb7-8581-4fd9-882a-823ced95b998': <TravelExploreRounded/>, // Autres
        'e1b4e34a-f388-40b1-a051-1df7ef602ac3': <RestaurantMenuRounded/>, // Sortie restaurant
        '925517d7-ae98-48ee-b755-ae03e24fd760': <MuseumRounded/>, // Sortie culturelle
        '4269692d-7eec-4569-9443-5f77dc2e4cbc': <TravelExploreRounded/>, // Loisir
        'cc945dbe-1277-40aa-8758-10d94aafb8b7': <DownhillSkiingRounded/>, // Sport d'hiver
        '922b9e16-ba25-4ac2-9f3d-34cfc94280aa': <FlightTakeoffRounded/>, // Voyage / Vacances
        '80b535f6-539d-40be-9f5e-ef17806eada5': <ScubaDivingRounded/>, // Plongées
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}
/**
 * Catégorie Scolarité Enfants
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconScolariteEnfants(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        '84d00049-bee6-47e9-b424-5246580b020a': <SchoolRounded/>, // SCOLARITE ENFANTS
        '93a90f35-a125-4962-a784-cb9ff85be60f': <ChildCareRounded/>, // Crèche
        '5d00df44-c8d9-4a22-99fe-bd5dcde2a7d1': <SchoolRounded/>, // Ecole
        '8f81f7aa-f0f1-4e50-9eaf-dd9ceb502925': <DrawRounded/>, // Fourniture scolaire
    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}
/**
 * Catégorie Enfants
 * @param {CategorieOperationModel} categorieOperation : catégorie d'opération
 * @returns {JSX.Element|null}
 */
function getCategorieIconEnfants(categorieOperation: CategorieOperationModel): JSX.Element | null {
    const iconMap = {
        'c4489fe2-8613-44c3-9eec-72febe6eb2e2': <BoyRounded/>, // ENFANTS
        'e7fce0e5-b462-4026-b8af-d129f09d6f47': <BoyRounded/>, // Vêtements
        '7fa68dec-b0bc-4f2a-b669-7f11971215c5': <BoyRounded/>, // Chaussures
        '0ad986c2-008a-4d10-be21-3af2341e4420': <SmartToyRounded/>, // Jouets
        '395e3fb6-08bd-437a-92ed-85956aa04cfc': <MenuBookRounded/>, // Livres magazine
        '751c9c3c-9df2-4c6f-bc6f-307207f31923': <SportsHandballRounded/>, // Activités
        '8b85fb57-4825-4400-b9f0-cdbd12cdc59e': <VaccinesRounded/>, // Soins
        '48b57cf7-dc07-401e-8257-8f3566129a15': <BoyRounded/>, // Cosmétiques
        '762e2a44-ea29-4e17-ae1b-96e069d8050a': <RestaurantRounded/>, // Alimentation
        '63cbfb69-46e9-480c-bb42-6d84daf18243': <BabyChangingStationRounded/>, // Couche
        'b6484fd0-f00e-44c4-b241-a428237d01d9': <PedalBikeRounded/>, // Equipements
        '50512d9c-0c5f-4552-b772-b5ac27f9d82c': <HotelRounded/>, // Linge
        '93ce1e4d-86eb-4f8f-9673-b86eb47a012c': <ColorLensRounded/>, // Décoration

    };
    return (categorieOperation.id && iconMap[categorieOperation.id as keyof typeof iconMap]) || null;
}
