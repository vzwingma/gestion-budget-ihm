import {
    AccountBalanceRounded,
    AccountBalanceWalletRounded,
    AddCardRounded,
    AddShoppingCartRounded,
    AssuredWorkloadRounded,
    AtmRounded,
    BalanceRounded,
    BrunchDiningRounded,
    CarRentalRounded,
    ConstructionRounded,
    ContactPhoneRounded,
    CreditScoreRounded,
    CurrencyExchangeRounded,
    DescriptionRounded,
    DirectionsBusRounded,
    ElectricBoltRounded,
    ElectricCarRounded,
    EmojiTransportationRounded,
    EuroSymbolRounded,
    GasMeterRounded,
    HealthAndSafetyRounded,
    HomeRounded,
    LocalCafeRounded,
    LocalGasStationRounded,
    LocalHospitalRounded,
    LocalParkingRounded,
    LocalTaxiRounded,
    MedicationLiquidRounded,
    NoCrashRounded,
    PhoneAndroidRounded,
    QuestionMarkRounded,
    RestaurantMenuRounded,
    ShoppingCartCheckoutRounded,
    SportsEsportsRounded,
    TollRounded,
    TravelExploreRounded,
    VolunteerActivismOutlined,
    WatchLaterRounded
} from "@mui/icons-material";
import {OPERATION_ETATS_ENUM} from "../../../Utils/AppBusinessEnums.constants";
import {Tooltip} from "@mui/material";
import React from "react";

/**
 * Couleur de la catégorie
 * @param operationCategorie catégorie de l'opération
 * @returns {string} color catégorie
 */
export function getCategorieColor(operationCategorie) {
    if (operationCategorie?.id != null) {
        switch (operationCategorie.id) {
            case 'ea6dcc12-3349-4047-a1e5-cd1d7254f16e': // Virement
                return "#18c95d"
            case '504beea7-ed52-438a-aced-15e9603b82ab': // Prélèvement
                return "#fc5d6a"
            case '8557f0b1-be6d-4cb9-a0a0-815c64bf4696': // Economie
                return "#89d1ff"
            case 'c35fde2a-55ec-4a27-9519-5ef5daf46799': // Transport
                return "#00cbcb"
            case '270f314a-b3e5-4e05-bc96-4e2fadc4a9d3': // Frais
                return "#c294c2"
            case '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a': // Alimentation
                return "#ffb200"
            case 'b20a46a5-92ab-47a8-a70d-ecb64ddf02ce': // Frais remboursable
                return "#ff87c2"
            case '94669a73-2563-4a31-8d67-35a8d96d8686': // Divers
                return "#9fc3d3"
            default:
                console.warn("L'Opération " + operationCategorie.id + " n'a pas de couleur de fond définie")
        }
    }
    return "#808080"
}

// Icone Sous catégories
export function getSousCategorieIcon(operationSsCategorie) {
    if (operationSsCategorie != null) {
        switch (operationSsCategorie.id) {
            // VIREMENTS
            case 'ea6dcc12-3349-4047-a1e5-cd1d7254f16e': // VIREMENTS
                return <AccountBalanceRounded/>

            case '885e0d9a-6f3c-4002-b521-30169baf7123': // Remboursement
                return <AddCardRounded/>
            case 'ed3f6100-5dbd-4b68-860e-0c97ae1bbc63': // Intercomptes
                return <CurrencyExchangeRounded/>
            case 'd005de34-f768-4e96-8ccd-70399792c48f': // Salaires
                return <EuroSymbolRounded/>

            // DIVERS
            case '94669a73-2563-4a31-8d67-35a8d96d8686': // DIVERS
                return <SportsEsportsRounded/>

            case '76c99cbf-babb-40e6-ac13-0ac08661c9a7': // Dépense
                return <AddShoppingCartRounded/>
            case '430a455b-e5ba-4b13-b031-bcf0e63f102e': // Retrait
                return <AtmRounded/>
            case '4269692d-7eec-4569-9443-5f77dc2e4cbc': // Loisir
                return <TravelExploreRounded/>
            case '603072b2-2bfc-43ad-b2de-028c9f28ba0a': // Travaux
                return <ConstructionRounded/>

            // PRELEVEMENTS
            case '504beea7-ed52-438a-aced-15e9603b82ab': // PRELEVEMENTS
                return <CreditScoreRounded/>

            case '6ae3d4c2-f0cc-4abc-b0ce-da39c1a06846': // Assurance
                return <AssuredWorkloadRounded/>
            case 'dc5a2d65-19f5-4f3d-a44a-e63e9abe3ac6': // Loyer
                return <HomeRounded/>
            case '55fc700b-24c6-4d95-9005-667af949537d': // Telecom
                return <PhoneAndroidRounded/>
            case '0f19a626-98ab-418c-8e94-865e6ea0d4a3': // Impots
                return <BalanceRounded/>
            case '1da40127-af16-4245-9ea8-6eca974905c6': // Electricite
                return <ElectricBoltRounded/>
            case '1da29b11-3100-446e-a257-0d0a240e3f8e': // Don
                return <VolunteerActivismOutlined/>
            case 'ccac974b-52c7-4b0b-94d4-8831b13800d1': // Gaz
                return <GasMeterRounded/>
            case 'db0b202a-0c90-44e5-8e34-7caa609e07fb': // Charges Appartement
                return <HomeRounded/>
            case '11f405f8-7301-4663-8c99-23d1f99598bb': // Remboursement crédit
                return <AccountBalanceRounded/>

            // FRAIS REMBOURSABLES
            case 'b20a46a5-92ab-47a8-a70d-ecb64ddf02ce': // FRAIS REMBOURSABLES
                return <MedicationLiquidRounded/>

            case '6e96b0c3-ecc5-4be8-8087-0087b5e46baf': // Santé
                return <HealthAndSafetyRounded/>
            case 'bd28c498-a774-4a67-b6ec-a135d39fca46': // Pro
                return <ContactPhoneRounded/>

            // TRANSPORT
            case 'c35fde2a-55ec-4a27-9519-5ef5daf46799': // TRANSPORTS
                return <EmojiTransportationRounded/>

            case 'e9dadc12-73d2-4956-8936-044115de7723': // Taxi
                return <LocalTaxiRounded/>
            case 'cdd8dbcf-1475-4bd7-b69c-20467f844d91': // Parking
                return <LocalParkingRounded/>
            case 'a692bb6c-d7d4-4e67-b7a9-96551dea03c0': // Péages
                return <TollRounded/>
            case 'f6dd5c41-6ba6-4297-9455-66567ab4556d': // Location
                return <CarRentalRounded/>
            case '7e8b606e-02d4-4555-9852-307ce9927ce4': // Carburant
                return <LocalGasStationRounded/>
            case '2dbd8add-4a8d-4d05-a325-08b7e85d6ac9': // Recharge
                return <ElectricCarRounded/>
            case 'bbc1f327-35cb-4db6-8134-61af30d3246c': // Assurance
                return <NoCrashRounded/>
            case '80698e57-4f34-42f8-b3ee-0487df01f0a1': // Transport en commun
                return <DirectionsBusRounded/>

            // FRAIS
            case '270f314a-b3e5-4e05-bc96-4e2fadc4a9d3': // FRAIS
                return <DescriptionRounded/>

            case 'eeb2f9a5-49b4-4c44-86bf-3bd626412d8e': // Santé
                return <LocalHospitalRounded/>
            case 'f9cbdc91-73d2-4956-8936-044115de7723': // Banque
                return <AccountBalanceWalletRounded/>

            // ALIMENTATION
            case '8f1614c9-503c-4e7d-8cb5-0c9a9218b84a': // ALIMENTATION
                return <RestaurantMenuRounded/>

            case '62607c4a-b32d-4abf-85c7-ac0c10cdb65c': // Cantine
                return <LocalCafeRounded/>
            case '84022f20-f31a-4369-a4bb-de62ab778fd0': // Restaurant
                return <BrunchDiningRounded/>
            case '467496e4-9059-4b9b-8773-21f230c8c5c6': // Courses
                return <ShoppingCartCheckoutRounded/>

            default:
                // console.warn("L'opération " + operationSsCategorie.id + " n'a pas d'icone définie")
                return <QuestionMarkRounded/>
        }
    }
    return <QuestionMarkRounded/>
}


export function getOperationStateColor(operationState) {
    if (operationState != null) {
        switch (operationState) {
            case OPERATION_ETATS_ENUM.REALISEE:
                return "#2e7d32"
            case OPERATION_ETATS_ENUM.PREVUE:
                return "#ed6c02"
            case OPERATION_ETATS_ENUM.ANNULEE:
                return "#ebebeb"
            case OPERATION_ETATS_ENUM.SUPPRIMEE:
                return "#ed1b24"
            case OPERATION_ETATS_ENUM.REPORTEE:
                return "#9c27b0"
            case OPERATION_ETATS_ENUM.PLANIFIEE:
                return "#0288d1"
            default:
                return "grey";
        }
    }
    return "grey";
}


/** Libellé & Couleur du background de l'attribut Mensualité
 * @param periodeKey : string enum période
 * */
export function getPeriodeRenderer(periodeKey) {

    switch (periodeKey) {
        case "PONCTUELLE":
            return {value: periodeKey, text: "Ponctuelle", color: "#616161"}
        case "MENSUELLE":
            return {value: periodeKey, text: "Mensuelle", color: "#616161"}
        case "TRIMESTRIELLE":
            return {value: periodeKey, text: "Trimestrielle", color: "#3498db"}
        case "SEMESTRIELLE":
            return {value: periodeKey, text: "Semestrielle", color: "#f1c40f"}
        case "ANNUELLE":
            return {value: periodeKey, text: "Annuelle", color: "#e74c3c"}
        default:
            return {value: periodeKey, text: "N/D", color: "#616161"}
    }
}


/**
 * Render du libellé de l'opération
 * @param operationLibelle libellé de l'opération
 * @param listeComptes liste des comptes
 * @param maxVue vue élargie pour max
 * @returns {null}
 */
export function getOperationLibelle(operationLibelle, listeComptes, maxVue) {
    if (operationLibelle != null) {
        const operationLibelleParts = (operationLibelle.match("(.*\\[vers |.*\\[depuis )(.*)(\\])(.*)"));
        if (operationLibelleParts != null) {
            const operationLibelleParts = (operationLibelle.match("(.*\\[vers |.*\\[depuis )(.*)(\\])(.*)"));
            const compte = (listeComptes.filter((compte) => compte.libelle === operationLibelleParts[2]))
            return <Tooltip title={"Transfert intercompte vers " + compte[0].libelle}>
                {operationLibelleParts[1].startsWith("[En Retard]") ?
                    <WatchLaterRounded sx={{color: "#A0A0A0"}}/> : <></>}
                <img src={"/img/banques/" + compte[0].icon}
                     width={maxVue ? 30 : 20} height={maxVue ? 30 : 20}
                     alt={compte[0].libelle}
                     style={{marginRight: "5px"}}/>
                <span>
                        {operationLibelleParts[4]}
                    </span>
            </Tooltip>
        } else if (operationLibelle.startsWith("[En Retard]")) {
            return <><WatchLaterRounded sx={{color: "#A0A0A0"}}/>{operationLibelle.replaceAll("[En Retard]", "")}</>
        } else {
            return operationLibelle;
        }

    }
    return null;
}
