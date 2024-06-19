import {Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";
import PropTypes from "prop-types";
import * as Controller from './GraphAnalyseTemporelle.controller'

/**
 * Composant de graphique pour l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {string} props.anneeAnalyses - L'année des analyses.
 * @param {Array} props.analysesGroupedByCategories - Les analyses groupées par catégories.
 * @param {Array} props.timelinesSoldes - Les analyses groupées du soldes.
 * @param {Array} props.listeCategories - Le tableau des catégories.
 * @returns {JSX.Element} Le composant de graphique.
 */
const GraphAnalyseTemporelle = ({
                                    anneeAnalyses,
                                    analysesGroupedByCategories,
                                    timelinesSoldes,
                                    listeCategories
                                }) => {

    let dataCategories = [];


    /** Init du tableau pour l'affichage du graphique **/
    Controller.populateGraphCategoriesEtSoldes(anneeAnalyses, analysesGroupedByCategories, timelinesSoldes, listeCategories, dataCategories);

    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Line.
     */
    const renderLines = () => {
        let lines = [];
        listeCategories
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                lines.push(<Line type="monotone"
                                 dataKey={categorie.libelle}
                                 stroke={categorie.couleurCategorie}/>)
            });
        return lines;
    };


    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Area.
     */
    const renderCharts = () => {
        let areas = [];
        areas.push(
            <Bar type="monotone" dataKey="soldes" fill="#FFFFFF" stroke="green"/>
        )
        return areas;
    };



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
                }}
            >
                <CartesianGrid strokeDasharray="1 10" fillOpacity={0.6}/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip active={true}
                         contentStyle={{color: "white", backgroundColor: "black"}}
                         formatter={(value, name) => [
                             Array.isArray(value) ?
                                 value[0] + " € / " + value[1] + " €"
                                 :
                                 value + " €"
                             ,
                             " - " + name]}/>
                <Legend/>
                {renderLines()}
                {renderCharts()}
            </ComposedChart>
        </ResponsiveContainer>
    );
}

// Types des propriétés
GraphAnalyseTemporelle.propTypes = {
    anneeAnalyses: PropTypes.number.isRequired,
    listeCategories: PropTypes.array.isRequired,
    analysesGroupedByCategories: PropTypes.array.isRequired,
    timelinesSoldes: PropTypes.array.isRequired
}

export default GraphAnalyseTemporelle
