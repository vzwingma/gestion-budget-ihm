import ProprietaireModel from "./Proprietaire.model.js";

/**
 * CompteBancaire model
 */
export default interface CompteBancaireModel {

    readonly id: string;
    readonly libelle: string;
    readonly itemIcon: string;
    readonly ordre: number;
    readonly actif: boolean;
    readonly proprietaires: ProprietaireModel[];
}
