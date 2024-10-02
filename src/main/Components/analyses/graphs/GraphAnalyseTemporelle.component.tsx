import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { populateGraphCategories, populateGraphSoldes } from "./GraphAnalyseTemporelle.controller";
import TooltipAnalyseTemporelle from "./TooltipAnalyseTemporelle.component";
import { GraphAnalyseTemporelleProps } from "../../Components.props";
import { DataTemporelleAnnee } from "../../../Models/analyses/temporelles/GraphAnalyse.model";


/**
 * Composant de graphique pour l'analyse temporelle.
 * @param {GraphAnalyseTemporelleProps} props - Les propriétés passées au composant.
 * @returns {JSX.Element} Le composant de graphique.
 */
const GraphAnalyseTemporelle = ({ anneeAnalyses,
    timelinesByCategoriesData,
    timelinesSoldesData,
    timelinesPrevisionnellesByCategoriesData,
    timelinesPrevisionnellesSoldesData,
    filterSoldesActive,
    analyseSoldesCategoriesData }: GraphAnalyseTemporelleProps) => {

    let dataCategories: DataTemporelleAnnee = { datasTemporellesMois: {} };

    /** Init du tableau pour l'affichage du graphique **/
    console.log("Construction de l'affichage de l'analyse temporelle pour", anneeAnalyses);
    populateGraphCategories(anneeAnalyses, analyseSoldesCategoriesData, timelinesByCategoriesData, false, dataCategories);
    populateGraphCategories(anneeAnalyses, analyseSoldesCategoriesData, timelinesPrevisionnellesByCategoriesData, true, dataCategories);
    populateGraphSoldes(anneeAnalyses, timelinesSoldesData, filterSoldesActive, false, dataCategories);
    populateGraphSoldes(anneeAnalyses, timelinesPrevisionnellesSoldesData, filterSoldesActive, true, dataCategories);

    // TODO : Transformation en objet pour le graphique
    const dataByCategories: any[] = Object.values(dataCategories.datasTemporellesMois);
    for (let i = 0; i < dataByCategories.length; i++) {
        const dataByMonth = dataByCategories[i];
        for (let j = 0; j < analyseSoldesCategoriesData.length; j++) {
            const categorie = analyseSoldesCategoriesData[j];
            dataByMonth[categorie.libelleCategorie] = dataByMonth.categories[categorie.libelleCategorie];
            dataByMonth["prev_" + categorie.libelleCategorie] = dataByMonth.categories["prev_" + categorie.libelleCategorie];
        }
        if(filterSoldesActive) {
            dataByMonth["SoldesD"] = dataByMonth.categories["SoldesD"];
            dataByMonth["SoldesF"] = dataByMonth.categories["SoldesF"];
            dataByMonth["prev_SoldesD"] = dataByMonth.categories["prev_SoldesD"];
            dataByMonth["prev_SoldesF"] = dataByMonth.categories["prev_SoldesF"];
        }
    }


    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Line.
     */
    const renderLines = () => {
        let lines: JSX.Element[] = [];
        analyseSoldesCategoriesData
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                lines.push(<Line key={categorie.id}
                    type="monotone"
                    dataKey={categorie.libelleCategorie}
                    strokeWidth="3"
                    stroke={categorie.couleur} />)

                lines.push(<Line key={"prev_" + categorie.id}
                    type="monotone"
                    dataKey={"prev_" + categorie.libelleCategorie}
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    stroke={categorie.couleur} />)
            });
        return lines;
    };


    const renderSoldes = () => {
        let soldes : JSX.Element[] = [];
        soldes.push(<Bar key="SoldesD" dataKey="SoldesD"
            type="monotone"
            fill="url('#colorSoldesD')" stroke="url('#colorSoldesD')"
            barSize={40} />)

        soldes.push(<Bar key="SoldesF" dataKey="SoldesF"
            type="monotone"
            fill="url('#colorSoldesF')" stroke="url('#colorSoldesF')"
            barSize={40} />)

        soldes.push(<Bar key="prev_SoldesD"
            dataKey="prev_SoldesD"
            type="monotone"
            fill="url('#colorSoldesD')" stroke="url('#colorSoldesD')"
            barSize={40} strokeDasharray="5 5" />)

        soldes.push(<Bar key="prev_SoldesF"
            dataKey="prev_SoldesF"
            type="monotone"
            fill="url('#colorSoldesF')" stroke="url('#colorSoldesF')"
            barSize={40} strokeDasharray="5 5" />)
        return soldes;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={dataByCategories}>

                <defs>
                    <linearGradient id="colorSoldesD" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#19547b" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8d968b" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="colorSoldesF" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="50%" stopColor="#8d968b" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#ffd89b" stopOpacity={0.9} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="1 10" />
                <XAxis dataKey="name" />
                <YAxis />
                { <Tooltip content={<TooltipAnalyseTemporelle/>}/> }

                {renderLines()}

                {renderSoldes()}

            </ComposedChart>
        </ResponsiveContainer>
    );
}

export default GraphAnalyseTemporelle
