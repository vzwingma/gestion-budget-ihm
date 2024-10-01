import {Cell, LabelList, Pie, PieChart, ResponsiveContainer} from "recharts";
import React from "react";
import PropTypes from "prop-types";
import { getCategorieColor } from "../../../Utils/renderers/CategorieItem.renderer";
import { sortLibellesCategories } from "../../../Utils/OperationData.utils";



interface GraphAnalysesProps {
    typeAnalyse: string,
    analysesGroupedByCategories: any,
    resumeSelectedCategorie: any,
    resumeSelectedSsCategorie: any
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
const GraphAnalyses : React.FC<GraphAnalysesProps> = ({   typeAnalyse,
                           analysesGroupedByCategories,
                           resumeSelectedCategorie,
                           resumeSelectedSsCategorie
                       } : GraphAnalysesProps) : JSX.Element => {


    let dataCategories : any[] = [];
    let dataSsCategories : any[]= [];

    /**
     * Populate des data pour les graphs d'une catégorie
     * @param analysesGroupedByCategories : object analyses groupées des catégories
     * @param dataCategories : array tableau pour alimenter le graphique
     * @param parentCategorie : object catégorie parente

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
     */
    /**
     * Render du label pour une catégorie
     * @param props properties
     * @returns {*}
     
    function renderLabelCategorie(props : string) {
        const selectedId = resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === props.id;
        const color = getCategorieColor(resumeSelectedCategorie !== null ? resumeSelectedCategorie.categorie : null)
        return renderLabelAnalyse(props, selectedId, color);
    }
*/
    /**
     * Render du label pour une sous catégorie
     * @param props
     * @returns {*}
  
    function renderLabelSsCategorie(props : string) {
        const selectedId = resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === props.id;
        return renderLabelAnalyse(props, selectedId, "#808080");
    }
   */
    /**
     * Render du label pour une analyse
     * @param props properties
     * @param selectedId : boolean si la catégorie est sélectionnée
     * @param color couleur
     * @returns {JSX.Element}
     
    function renderLabelAnalyse(props, selectedId, color) {
        const {cx, cy, viewBox, value} = props;
        const midRadius = (viewBox.outerRadius + viewBox.innerRadius) / 2;
        // Calcul de l'angle du texte au milieu de la circonference
        // Conversion en radian, dans le sens horaire
        const midAngle = -(viewBox.startAngle + viewBox.endAngle) / 2 * Math.PI / 180;
        const x = cx + Math.cos(midAngle) * midRadius;
        const y = cy + Math.sin(midAngle) * midRadius;

        return (
            <>
                <defs>
                    <filter x="0" y="0" width="1" height="1" id="solid">
                        <feFlood floodColor={color} result="bg"/>
                        <feMerge>
                            <feMergeNode in="bg"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <text x={x} y={y} dy={10}
                      stroke={"white"} strokeWidth={selectedId ? 0.5 : 0.1}
                      fill={"white"}
                      filter={selectedId ? "url(#solid)" : ""}
                      fontSize={selectedId ? 17 : 10} textAnchor="middle">
                    {value}
                </text>
            </>

        );
    }
*/
    /** Init du tableau pour l'affichage du graphique **/
  //  populateGraphCategorie(analysesGroupedByCategories, dataCategories);

    return (
        <></>
        /**
        <ResponsiveContainer width="100%" height="100%"> vnbb:
            <PieChart width="90%" height="90%">
                { // Affichage du graphique CATEGORIE }
                <Pie data={dataCategories} dataKey="value"
                     cx="50%" cy="50%" innerRadius="30%" outerRadius="65%"
                     isAnimationActive={false}>
                    {dataCategories.map((entry) => (
                        <Cell key={`cell-${entry.categorie}`}
                              fill={getCategorieColor(entry.categorie) + (resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === entry.id ? "" : "5A")}/>
                    ))
                    }
                    <LabelList data={dataSsCategories} dataKey="name"
                               content={renderLabelCategorie}/>
                </Pie>
                { // Affichage du graphique SOUS CATEGORIE }
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
                               content={renderLabelSsCategorie}/>
                </Pie>
            </PieChart>
        </ResponsiveContainer>
        */
    );
}
export default GraphAnalyses
