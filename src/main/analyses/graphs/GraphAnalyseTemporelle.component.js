import {Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";
import PropTypes from "prop-types";
import * as Controller from './GraphAnalyseTemporelle.controller'

/**
 * Composant de graphique pour l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {string} props.anneeAnalyses - L'année des analyses.
 * @param {Array} props.timelinesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Array} props.timelinesSoldes - Les analyses groupées du soldes.
 * @param {Boolean} props.filterSoldesActive - Le filtre des soldes.
 * @param {Array} props.listeCategories - Le tableau des catégories.
 * @returns {JSX.Element} Le composant de graphique.
 */
const GraphAnalyseTemporelle = ({
                                    anneeAnalyses,
                                    timelinesGroupedByCategories,
                                    timelinesSoldes,
                                    filterSoldesActive,
                                    listeCategories
                                }) => {

    let dataCategories = [];


    /** Init du tableau pour l'affichage du graphique **/
    Controller.populateGraphCategoriesEtSoldes(anneeAnalyses, timelinesGroupedByCategories, timelinesSoldes, listeCategories, filterSoldesActive, dataCategories);

    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Line.
     */
    const renderLines = () => {
        let lines = [];
        listeCategories
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                let idStroke = "url(#lineStroke" + categorie.id + ")";
                lines.push(<Line key={categorie.id}
                                 type="monotone"
                                 dataKey={categorie.libelle}
                                 stroke={idStroke}/>)
            });
        return lines;
    };

    /**
     * rend le dégradé des lignes du graphique
     * @returns {[]}
     */
    const renderLinesStrokes = () => {
        let lines = [];

        listeCategories
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                let idStroke = "lineStroke" + categorie.id;
                let stepNextBudget;
                if (dataCategories.length === 12) {
                    stepNextBudget = 100;
                } else {
                    stepNextBudget = Math.floor(((dataCategories.length - 2) / (dataCategories.length - 1)) * 100);
                }
                stepNextBudget += "%"
                lines.push(<linearGradient id={idStroke} x1="0" y1="0" x2="100%" y2="0">
                    <stop offset="0%" stopColor={categorie.couleur}/>
                    <stop offset={stepNextBudget} stopColor={categorie.couleur}/>
                        <stop offset={stepNextBudget} stopColor="grey"/>
                        <stop offset="100%" stopColor="grey"/>
                    </linearGradient>
                )
            });
        return lines;
    };

    /**
     * Formatte le tooltip
     * @param value
     * @param name
     * @returns {[string,string]}
     */
    const tooltipFormatter = (value, name) => {
        return [
            Array.isArray(value) ? value[0] + " € / " + value[1] + " €" : value + " €"
            , " - " + name];
    }


    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                wwidth="90%" height="90%"
                data={dataCategories}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}>

                <defs>
                    <linearGradient id="colorSoldes" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="30%" stopColor="#6584FF" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6584FF" stopOpacity={0.6}/>
                    </linearGradient>
                    {renderLinesStrokes()}
                </defs>


                <CartesianGrid strokeDasharray="1 10" fillOpacity={0.6}/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip active={true}
                         contentStyle={{color: "white", backgroundColor: "black"}}
                         formatter={tooltipFormatter}/>
                <Legend/>
                {renderLines()}
                <Bar type="monotone" dataKey="Soldes" fill="url(#colorSoldes)" stroke="url(#colorSoldes)" barSize={50}/>
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
    timelinesSoldes: PropTypes.array.isRequired
}

export default GraphAnalyseTemporelle
