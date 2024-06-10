import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";
import PropTypes from "prop-types";

/**
 * Composant de graphique pour l'analyse temporelle.
 * @param {Object} props - Les propriétés passées au composant.
 * @param {string} props.anneeAnalyses - L'année des analyses.
 * @param {Array} props.analysesGroupedByCategories - Les analyses groupées par catégories.
 * @returns {JSX.Element} Le composant de graphique.
 */
const GraphAnalyseTemporelle = ({
                                    anneeAnalyses,
                                    analysesGroupedByCategories
                                }) => {

    let dataCategories = [];
    const listeCategories = [];

    /**
     * Remplit le graphique avec les données d'une catégorie.
     * @param {string} anneeAnalyses - L'année des analyses.
     * @param {Array} analysesGroupedByCategories - Les analyses groupées par catégories.
     * @param {Array} dataCategories - Le tableau pour alimenter le graphique.
     */
    function populateGraphCategorie(anneeAnalyses, analysesGroupedByCategories, dataCategories) {

        console.log("Affichage de l'analyse temporelle pour ", anneeAnalyses)
        // transform en array
        for (let budgetId in analysesGroupedByCategories) {
            // Identification de toutes les catégories présentes
            for (const categoryKey in analysesGroupedByCategories[budgetId]) {
                if (!listeCategories.includes(categoryKey) && categoryKey !== null && categoryKey.id !== null) {
                    listeCategories[categoryKey] = analysesGroupedByCategories[budgetId][categoryKey].categorie;
                }
            }
        }

        for (let budgetId in analysesGroupedByCategories) {
            let dataCategorie = {};
            let budgetIdParts = budgetId.split("_");
            if (budgetIdParts[1] === "" + anneeAnalyses) {

                let label = new Date();
                label.setMonth(budgetIdParts[2] - 1);
                dataCategorie["name"] = label.toLocaleString('default', {month: 'long'});
                for (let categorieId in listeCategories) {
                    dataCategorie[listeCategories[categorieId].libelle] =
                        analysesGroupedByCategories[budgetId][categorieId] !== undefined ? Math.abs(analysesGroupedByCategories[budgetId][categorieId].total) : 0;
                }
                dataCategories.push(dataCategorie);
            }
        }
    }

    /** Init du tableau pour l'affichage du graphique **/
    populateGraphCategorie(anneeAnalyses, analysesGroupedByCategories, dataCategories);

    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Line.
     */
    const renderLines = () => {
        let lines = [];
        for (let categorieId in listeCategories) {
            lines.push(<Line type="monotone" dataKey={listeCategories[categorieId].libelle}
                             stroke={listeCategories[categorieId].couleurCategorie}/>)
        }
        return lines;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                         formatter={(value, name) => [value + " €", name]}/>
                <Legend/>
                {
                    renderLines()
                }
            </LineChart>
        </ResponsiveContainer>
    );
}

// Types des propriétés
GraphAnalyseTemporelle.propTypes = {
    id: PropTypes.string.isRequired,
    anneeAnalyses: PropTypes.number.isRequired,
    analysesGroupedByCategories: PropTypes.array.isRequired
}

export default GraphAnalyseTemporelle
