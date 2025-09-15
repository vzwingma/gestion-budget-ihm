import {Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React, {JSX} from "react";
import {flatCategoriesData, populateGraphCategories, populateGraphSoldes} from "./GraphAnalyseTemporelle.controller.ts";
import TooltipAnalyseTemporelle from "./TooltipAnalyseTemporelle.component.tsx";
import {GraphAnalyseTemporelleProps} from "../../../Components.props.tsx";
import {GraphAnalyseTimelineModel} from "../../../../Models/analyses/temporelles/GraphAnalyseTimeline.model.ts";
import {SOLDES_ENUM} from "./GraphAnalyseTemporelle.constant.ts";


/**
 * Composant de graphique pour l'analyse temporelle.
 * @param {GraphAnalyseTemporelleProps} props - Les propriétés passées au composant.
 * @returns {JSX.Element} Le composant de graphique.
 */
const GraphAnalyseTemporelle = ({   anneeAnalyses,
                                    timelinesByCategoriesData,
                                    timelinesSoldesData,
                                    timelinesPrevisionnellesByCategoriesData,
                                    timelinesPrevisionnellesSoldesData,
                                    filterSoldesActive,
                                    analyseSoldesCategoriesData
                                }: GraphAnalyseTemporelleProps): JSX.Element => {

    /**
     * Récupère les données pour le graphique.
     * @returns {Array} Les données pour le graphique.
     */
    function getGraphData(): Array<any> {
        let dataGraphTimeline: GraphAnalyseTimelineModel = { dataGraphTimelineItem: {} };

        /** Init du tableau pour l'affichage du graphique **/
        console.log("Construction de l'affichage de l'analyse temporelle pour", anneeAnalyses === 0 ? "tous les budgets" : anneeAnalyses);
        populateGraphCategories(analyseSoldesCategoriesData, timelinesByCategoriesData, false, dataGraphTimeline);
        populateGraphCategories(analyseSoldesCategoriesData, timelinesPrevisionnellesByCategoriesData, true, dataGraphTimeline);
        populateGraphSoldes(timelinesSoldesData, filterSoldesActive, false, dataGraphTimeline);
        populateGraphSoldes(timelinesPrevisionnellesSoldesData, filterSoldesActive, true, dataGraphTimeline);
        return flatCategoriesData(dataGraphTimeline, analyseSoldesCategoriesData, filterSoldesActive);
    }


    /**
     * Rend les lignes du graphique.
     * @returns {Array} Un tableau de composants Line.
     */
    const renderLines = (): Array<any> => {
        let lines: JSX.Element[] = [];
        analyseSoldesCategoriesData
            .filter(categorie => categorie.filterActive)
            .forEach(categorie => {
                lines.push(<Line key={categorie.id}
                    type="monotone"
                    dataKey={categorie.libelleCategorie}
                    strokeWidth="3"
                    stroke={categorie.couleur} />)

                lines.push(<Line key={SOLDES_ENUM.PREVISIONNEL + (categorie.id ?? 'defaultId')}
                    type="monotone"
                    dataKey={SOLDES_ENUM.PREVISIONNEL + categorie.libelleCategorie}
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    stroke={categorie.couleur} />)
            });
        return lines;
    };


    const renderSoldes = () => {
        let soldes : JSX.Element[] = [];
        soldes.push(<Bar key={SOLDES_ENUM.SOLDE_COURANT} dataKey={SOLDES_ENUM.SOLDE_COURANT}
            type="monotone"
            fill="url('#colorSoldesD')" stroke="url('#colorSoldesD')"
            barSize={40} />)

        soldes.push(<Bar key={SOLDES_ENUM.SOLDE_FIN} dataKey={SOLDES_ENUM.SOLDE_FIN}
            type="monotone"
            fill="url('#colorSoldesF')" stroke="url('#colorSoldesF')"
            barSize={40} />)

        soldes.push(<Bar key={SOLDES_ENUM.PREVISIONNEL + SOLDES_ENUM.SOLDE_COURANT}
            dataKey={SOLDES_ENUM.PREVISIONNEL + SOLDES_ENUM.SOLDE_COURANT}
            type="monotone"
            fill="url('#colorSoldesD')" stroke="url('#colorSoldesD')"
            barSize={40} strokeDasharray="5 5" />)

        soldes.push(<Bar key={SOLDES_ENUM.PREVISIONNEL + SOLDES_ENUM.SOLDE_FIN}
            dataKey={SOLDES_ENUM.PREVISIONNEL + SOLDES_ENUM.SOLDE_FIN}
            type="monotone"
            fill="url('#colorSoldesF')" stroke="url('#colorSoldesF')"
            barSize={40} strokeDasharray="5 5" />)
        return soldes;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                data={getGraphData()}>

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
