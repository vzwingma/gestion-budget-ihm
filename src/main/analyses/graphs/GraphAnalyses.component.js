import {Cell, LabelList, Pie, PieChart, ResponsiveContainer} from "recharts";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";
import React from "react";
import {Tooltip} from "@mui/material";

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


    /** Init du tableau pour l'affichage du graphique **/
    function populatesGraph() {

        for (let categorieId in analysesGroupedByCategories) {

            if (analysesGroupedByCategories[categorieId].nbTransactions[typeAnalyse] > 0) {

                let resume = analysesGroupedByCategories[categorieId];
                dataCategories.push({
                    id: resume.categorie.id,
                    categorie: resume.categorie,
                    name: resume.categorie.libelle,
                    value: Math.abs(resume.total[typeAnalyse])
                })

                for (let idSsCategorie in resume.resumesSsCategories) {
                    let ssResume = resume.resumesSsCategories[idSsCategorie]

                    if (ssResume.nbTransactions[typeAnalyse] > 0) {
                        dataSsCategories.push({
                            id: ssResume.categorie.id,
                            categorie: resume.categorie,
                            name: ssResume.categorie.libelle,
                            value: Math.abs(ssResume.total[typeAnalyse])
                        })
                    }
                }

            }
        }
    }

    // Alimentation du graphique
    populatesGraph();

    return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={800} height={800}>

                    <Pie data={dataCategories} dataKey="value"
                         cx="50%" cy="50%" innerRadius={100} outerRadius={230}
                         isAnimationActive={false}>
                        {dataCategories.map((entry, index) => (
                                <Cell key={`cell-${index}`}
                                      fill={Renderer.getCategorieColor(entry.categorie) + (resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === entry.id ? "" : "5A")}/>
                            ))
                        }
                        <LabelList data={dataSsCategories} dataKey="name"/>
                    </Pie>
                    <Pie data={dataSsCategories} dataKey="value"
                         cx="50%" cy="50%" innerRadius={250} outerRadius={350}
                         isAnimationActive={false}>
                        {dataSsCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`}
                                  fill={Renderer.getCategorieColor(entry.categorie) + (resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === entry.id ? "" : "5A")}
                            />
                            ))
                        }
                        <LabelList data={dataSsCategories} dataKey="name"/>
                    </Pie>
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
    );
}

export default GraphAnalyses