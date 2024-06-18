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
                                    analysesGroupedByCategories,
                                    listeCategories
                                }) => {

    let dataCategories = [];

    /**
     * Remplit le graphique avec les données d'une catégorie.
     * @param {string} anneeAnalyses - L'année des analyses.
     * @param {Array} analysesGroupedByCategories - Les analyses groupées par catégories.
     * @param {Array} dataCategories - Le tableau pour alimenter le graphique.
     */
    function populateGraphCategorie(anneeAnalyses, analysesGroupedByCategories, dataCategories) {

        console.log("Affichage de l'analyse temporelle pour ", anneeAnalyses)

        for (let budgetId in analysesGroupedByCategories) {
            let dataCategorie = {};
            let budgetIdParts = budgetId.split("_");
            if (budgetIdParts[1] === "" + anneeAnalyses) {

                let label = new Date();
                label.setMonth(budgetIdParts[2] - 1);
                dataCategorie["name"] = label.toLocaleString('default', {month: 'long'});

                listeCategories
                    .filter(categorie => categorie.filterActive)
                    .forEach(categorie => {
                        dataCategorie[categorie.libelle] =
                            analysesGroupedByCategories[budgetId][categorie.id] !== undefined ? Math.abs(analysesGroupedByCategories[budgetId][categorie.id].total) : 0;
                    })
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
        listeCategories
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                lines.push(<Line type="monotone"
                                 dataKey={categorie.libelle}
                                 stroke={categorie.couleurCategorie}/>)
            });
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
