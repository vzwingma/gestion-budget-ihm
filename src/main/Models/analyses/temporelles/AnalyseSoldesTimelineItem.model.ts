/**
 * Représente un élément de la timeline d'analyse des soldes
 * 
 * @property {number} soldeAtFinMoisPrecedent - Le solde à la fin du mois précédent.
 * @property {number} soldeAtMaintenant - Le solde actuel.
 */
export interface AnalyseSoldesTimelineItemModel {
    soldeAtFinMoisPrecedent : number,
    soldeAtMaintenant : number
}