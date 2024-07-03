import {Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";
import PropTypes from "prop-types";
import * as Controller from './GraphAnalyseTemporelle.controller'
import TooltipAnalyseTemporelle from "./TooltipAnalyseTemporelle.component";

/**
 * Composant de graphique pour l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {string} props.anneeAnalyses - L'année des analyses.
 * @param {Array} props.timelinesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Array} props.timelinesSoldes - Les analyses groupées du soldes.
 * @param {Array} props.timelinesPrevisionnellesGroupedByCategories - Les analyses à terminaison groupées par catégories.
 * @param {Array} props.timelinesPrevisionnellesSoldes - Les analyses à terminaison groupées du soldes.
 * @param {Boolean} props.filterSoldesActive - Le filtre des soldes.
 * @param {Array} props.listeCategories - Le tableau des catégories.
 * @returns {JSX.Element} Le composant de graphique.
 */
const GraphAnalyseTemporelle = ({
                                    anneeAnalyses,
                                    timelinesGroupedByCategories,
                                    timelinesSoldes,
                                    timelinesPrevisionnellesGroupedByCategories,
                                    timelinesPrevisionnellesSoldes,
                                    filterSoldesActive,
                                    listeCategories
                                }) => {

    let dataCategories = [];

    /** Init du tableau pour l'affichage du graphique **/
    console.log("Construction de l'affichage de l'analyse temporelle pour", anneeAnalyses);
    Controller.populateGraphCategories(anneeAnalyses, listeCategories, timelinesGroupedByCategories, false, dataCategories);
    Controller.populateGraphCategories(anneeAnalyses, listeCategories, timelinesPrevisionnellesGroupedByCategories, true, dataCategories);
    Controller.populateGraphSoldes(anneeAnalyses, timelinesSoldes, filterSoldesActive, false, dataCategories);
    Controller.populateGraphSoldes(anneeAnalyses, timelinesPrevisionnellesSoldes, filterSoldesActive, true, dataCategories);

    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Line.
     */
    const renderLines = () => {
        let lines = [];
        listeCategories
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                lines.push(<Line key={categorie.id}
                                 type="monotone"
                                 dataKey={categorie.libelle}
                                 strokeWidth="3"
                                 stroke={categorie.couleur}/>)

                lines.push(<Line key={"prev_" + categorie.id}
                                 type="monotone"
                                 dataKey={"prev_" + categorie.libelle}
                                 strokeWidth="1"
                                 strokeDasharray="5 5"
                                 stroke={categorie.couleur}/>)
            });
        return lines;
    };


    const renderSoldes = () => {
        let soldes = [];
        soldes.push(<Bar key="SoldesD" dataKey="SoldesD"
                         type="monotone"
                         fill="url('#colorSoldesD')" stroke="url('#colorSoldesD')"
                         barSize={40}/>)

        soldes.push(<Bar key="SoldesF" dataKey="SoldesF"
                         type="monotone"
                         fill="url('#colorSoldesF')" stroke="url('#colorSoldesF')"
                         barSize={40}/>)

        soldes.push(<Bar key="prev_SoldesD"
                         dataKey="prev_SoldesD"
                         type="monotone"
                         fill="url('#colorSoldesD')" stroke="url('#colorSoldesD')"
                         barSize={40} strokeDasharray="5 5"/>)

        soldes.push(<Bar key="prev_SoldesF"
                         dataKey="prev_SoldesF"
                         type="monotone"
                         fill="url('#colorSoldesF')" stroke="url('#colorSoldesF')"
                         barSize={40} strokeDasharray="5 5"/>)
        return soldes;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                width="100%" height="100%"
                data={dataCategories}>

                <defs>
                    <linearGradient id="colorSoldesD" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#19547b" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#8d968b" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="colorSoldesF" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="50%" stopColor="#8d968b" stopOpacity={0.7}/>
                        <stop offset="100%" stopColor="#ffd89b" stopOpacity={0.9}/>
                    </linearGradient>
                </defs>


                <CartesianGrid strokeDasharray="1 10"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip content={<TooltipAnalyseTemporelle/>}/>

                {renderLines()}

                {renderSoldes()}

            </ComposedChart>
        </ResponsiveContainer>
    );
}

// Types des propriétés
GraphAnalyseTemporelle.propTypes = {
    anneeAnalyses: PropTypes.number.isRequired,
    listeCategories: PropTypes.array.isRequired,
    filterSoldesActive: PropTypes.bool.isRequired,
    timelinesGroupedByCategories: PropTypes.array.isRequired,
    timelinesSoldes: PropTypes.array.isRequired,
    timelinesPrevisionnellesGroupedByCategories: PropTypes.array.isRequired,
    timelinesPrevisionnellesSoldes: PropTypes.array.isRequired
}

export default GraphAnalyseTemporelle
