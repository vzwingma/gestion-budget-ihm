import { Cell, LabelList, Pie, PieChart, ResponsiveContainer } from "recharts";
import React from "react";
import { getCategorieColor } from "../../../Utils/renderers/CategorieItem.renderer";
import { sortLibellesCategories } from "../../../Utils/OperationData.utils";
import AnalyseCategoriesModel from "../../../Models/analyses/AnalyseCategories.model";
import { renderLabelCategorie, renderLabelSsCategorie } from "./GraphAnalyses.controller";


interface GraphAnalysesProps {
    typeAnalyse: string,
    analysesGroupedByCategories: { [key: string]: AnalyseCategoriesModel },
    resumeSelectedCategorie: AnalyseCategoriesModel | null,
    resumeSelectedSsCategorie: AnalyseCategoriesModel | null
}

/**
 * Graphique Analyses
 * @param typeAnalyse : string type d'analyse
 * @param analysesGroupedByCategories : array analyses graoupée par catégories
 * @param resumeSelectedCategorie : object résumé de la catégorie sélectionnée
 * @param resumeSelectedSsCategorie : object résumé de la sous catégorie sélectionnée
 * @returns {JSX.Element} graphiques
 * @constructor
 */
const GraphAnalyses: React.FC<GraphAnalysesProps> = ({
    typeAnalyse,
    analysesGroupedByCategories,
    resumeSelectedCategorie,
    resumeSelectedSsCategorie
}: GraphAnalysesProps): JSX.Element => {


    let dataCategories: any[] = [];
    let dataSsCategories: any[] = [];

    /**
     * Populate des data pour les graphs d'une catégorie
     * @param analysesGroupedByCategories : object analyses groupées des catégories
     * @param dataCategories : array tableau pour alimenter le graphique
     * @param parentCategorie : object catégorie parente
     */
    function populateGraphCategorie(analysesGroupedByCategories: { [key: string]: AnalyseCategoriesModel }, dataCategories: any[], parentCategorie: any) {
        const arrayAnalysesGroupedByCategories = []
        // transform en array
        for (let categorieId in analysesGroupedByCategories) {
            arrayAnalysesGroupedByCategories.push(analysesGroupedByCategories[categorieId]);
        }

        // Populate datagategories
        arrayAnalysesGroupedByCategories
            .filter(analysesOfCategorie => analysesOfCategorie.nbTransactions[typeAnalyse] > 0)
            .sort((analysesOfCategorie1, analysesOfCategorie2) => sortLibellesCategories(analysesOfCategorie1.categorie, analysesOfCategorie2.categorie))
            .forEach((analysesOfCategorie) => {

                dataCategories.push({
                    id: analysesOfCategorie.categorie.id,
                    categorie: parentCategorie != null ? parentCategorie : analysesOfCategorie.categorie,
                    name: analysesOfCategorie.categorie.libelle + " : " + analysesOfCategorie.pourcentage[typeAnalyse] + "%",
                    value: Math.abs(analysesOfCategorie.total[typeAnalyse])
                })
                // Populate pour les sous catégories
                if (analysesOfCategorie.resumesSsCategories !== undefined && analysesOfCategorie.resumesSsCategories !== null) {
                    populateGraphCategorie(analysesOfCategorie.resumesSsCategories, dataSsCategories, analysesOfCategorie.categorie);
                }
            })
    }


    /** Init du tableau pour l'affichage du graphique **/
    populateGraphCategorie(analysesGroupedByCategories, dataCategories, null);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                { /** Affichage du graphique CATEGORIE  */}
                <Pie data={dataCategories} dataKey="value"
                    cx="50%" cy="50%" innerRadius="30%" outerRadius="65%"
                    isAnimationActive={false}>
                    {dataCategories.map((entry) => (
                        <Cell key={`cell-${entry.categorie}`}
                            fill={getCategorieColor(entry.categorie) + (resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === entry.id ? "" : "5A")} />
                    ))
                    }
                    <LabelList data={dataSsCategories} dataKey="name"
                        content={(props) => renderLabelCategorie(props, resumeSelectedCategorie)} />
                </Pie>
                { /** Affichage du graphique SOUS CATEGORIE */}
                <Pie data={dataSsCategories} dataKey="value"
                    cx="50%" cy="50%" innerRadius="70%" outerRadius="95%"
                    isAnimationActive={false}>
                    {dataSsCategories.map((entry) => (
                        <Cell key={`cell-${entry.categorie.id}`}
                            fill={getCategorieColor(entry.categorie) + (resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === entry.id ? "" : "5A")}
                        />
                    ))
                    }
                    <LabelList data={dataSsCategories} dataKey="name"
                        content={(props) => renderLabelSsCategorie(props, resumeSelectedSsCategorie)} />
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
export default GraphAnalyses
