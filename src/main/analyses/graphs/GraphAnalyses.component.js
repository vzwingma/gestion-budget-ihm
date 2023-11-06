import {Cell, LabelList, Pie, PieChart, ResponsiveContainer} from "recharts";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";
import React from "react";
import PropTypes from "prop-types";
import {sortLibellesCategories} from "../../Utils/DataUtils.utils";

/**
 * Graphique Analyses
 * @param typeAnalyse : string type d'analyse
 * @param analysesGroupedByCategories : array analyses graoupée par catégories
 * @param resumeSelectedCategorie : object résumé de la catégorie sélectionnée
 * @param resumeSelectedSsCategorie : object résumé de la sous catégorie sélectionnée
 * @returns {JSX.Element} graphiques
 * @constructor
 */
const GraphAnalyses = ({
                           typeAnalyse,
                           analysesGroupedByCategories,
                           resumeSelectedCategorie,
                           resumeSelectedSsCategorie
                       }) => {


    let dataCategories = [];
    let dataSsCategories = [];

    /**
     * Populate des data pour les graphs d'une catégorie
     * @param analysesGroupedByCategories : object analyses groupées des catégories
     * @param dataCategories : array tableau pour alimenter le graphique
     * @param parentCategorie : object catégorie parente
     */
    function populateGraphCategorie(analysesGroupedByCategories, dataCategories, parentCategorie) {
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
    populateGraphCategorie(analysesGroupedByCategories, dataCategories);

    return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width="90%" height="90%">

                    <Pie data={dataCategories} dataKey="value"
                         cx="50%" cy="50%" innerRadius="30%" outerRadius="65%"
                         isAnimationActive={false}>
                        {dataCategories.map((entry) => (
                            <Cell key={`cell-${entry.categorie}`}
                                      fill={Renderer.getCategorieColor(entry.categorie) + (resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === entry.id ? "" : "5A")}/>
                            ))
                        }
                        <LabelList data={dataSsCategories} dataKey="name" stroke={"white"} strokeWidth={0.1}
                                   fill={"white"}/>
                    </Pie>
                    <Pie data={dataSsCategories} dataKey="value"
                         cx="50%" cy="50%" innerRadius="70%" outerRadius="95%"
                         isAnimationActive={false}>
                        {dataSsCategories.map((entry) => (
                            <Cell key={`cell-${entry.categorie.id}`}
                                  fill={Renderer.getCategorieColor(entry.categorie) + (resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === entry.id ? "" : "5A")}
                            />
                            ))
                        }
                        <LabelList data={dataSsCategories} dataKey="name" stroke={"white"} strokeWidth={0.1}
                                   fill={"white"}/>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
    );
}
// Properties Types
GraphAnalyses.propTypes = {
    typeAnalyse: PropTypes.string.isRequired,
    analysesGroupedByCategories: PropTypes.object.isRequired,
    resumeSelectedCategorie: PropTypes.object,
    resumeSelectedSsCategorie: PropTypes.object,
}
export default GraphAnalyses
