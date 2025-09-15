import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import React, {JSX} from "react";
import {getCategorieColor} from "../../../../Utils/renderers/CategorieItem.renderer";
import {
    populateGraphAnalyseCategories,
    renderLabelCategorie, renderLabelSsCategorie,
} from "./GraphAnalyses.controller";
import GraphAnalyseCategoriesModel from "../../../../Models/analyses/categories/GraphAnalyseCategories.model";
import {GraphAnalysesProps} from "../../../Components.props";



/**
 * Graphique Analyses
 * @param typeAnalyse : string type d'analyse
 * @param analysesGroupedByCategories : array analyses graoupée par catégories
 * @param resumeSelectedCategorie : object résumé de la catégorie sélectionnée
 * @param resumeSelectedSsCategorie : object résumé de la sous catégorie sélectionnée
 * @returns {JSX.Element} graphiques
 * @constructor
 */
const GraphAnalyses: React.FC<GraphAnalysesProps> = ({ typeAnalyse,
                                                         analysesGroupedByCategories,
                                                         resumeSelectedCategorie,
                                                         resumeSelectedSsCategorie
                                                     }: GraphAnalysesProps): JSX.Element => {


    let dataGraphCategories: GraphAnalyseCategoriesModel[] = [];
    let dataGraphSsCategories: GraphAnalyseCategoriesModel[] = [];

    /** Init du tableau pour l'affichage du graphique **/
    populateGraphAnalyseCategories(analysesGroupedByCategories, typeAnalyse, dataGraphCategories, dataGraphSsCategories);



    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                { /** Affichage du graphique CATEGORIE  */}
                <Pie data={dataGraphCategories} dataKey="value"
                    cx="50%" cy="50%" innerRadius="30%" outerRadius="65%"
                    isAnimationActive={false}
                    labelLine={true}
                    label={(props) => renderLabelCategorie(props, resumeSelectedCategorie)} >
                    {dataGraphCategories.map((entry) => (
                        <Cell key={`cell-categorie-${entry.categorie.id}`}
                            fill={getCategorieColor(entry.categorie.id) + (resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === entry.id ? "" : "5A")} />
                    )) }
                </Pie>
                { /** Affichage du graphique SOUS CATEGORIE */}
                <Pie data={dataGraphSsCategories} dataKey="value"
                    cx="50%" cy="50%" innerRadius="70%" outerRadius="95%"
                    isAnimationActive={false}
                    labelLine={true}
                    label={(props) => renderLabelSsCategorie(props, resumeSelectedSsCategorie)} >
                    {dataGraphSsCategories.map((entry, index) => (
                        <Cell key={`cell-sscategorie-${entry.categorie.id}-${index}`}
                            fill={getCategorieColor(entry.categorie.id) + (resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === entry.id ? "" : "5A")}/>
                    )) }
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
export default GraphAnalyses
