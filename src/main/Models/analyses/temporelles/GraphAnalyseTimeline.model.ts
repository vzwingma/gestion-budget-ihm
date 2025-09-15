import { GraphAnalyseTimelineItemModel } from "./GraphAnalyseMensuel.model.ts";

/**
 * Modèle représentant l'analyse temporelle d'un graphique.
 * 
 * @interface GraphAnalyseTimelineModel
 * 
 * @property {Object.<string, GraphAnalyseTimelineItem>} dataGraphTimelineItem - 
 * Un objet contenant les données temporelles par mois, où la clé est une chaîne de caractères représentant le mois 
 * et la valeur est un élément de type GraphAnalyseTimelineItem.
 */
export interface GraphAnalyseTimelineModel {
    dataGraphTimelineItem: { [month: string]: GraphAnalyseTimelineItemModel }
}