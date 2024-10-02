/**
 * Interface pour SoldesTimelineItem.
 * Cette interface représente un résumé des soldes dans l'application. Elle comprend les totaux des soldes.
 * @typedef {Object} SoldesTimelineItem
 * @property {number[]} totaux - Les totaux des soldes.
 *
 */
export interface SoldesTimelineItem {
    soldeAtFinMoisPrecedent : number,
    soldeAtMaintenant : number
}