import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { flatCategoriesData, populateGraphCategories, populateGraphSoldes } from "./GraphAnalyseTemporelle.controller";
import TooltipAnalyseTemporelle from "./TooltipAnalyseTemporelle.component";
import { GraphAnalyseTemporelleProps } from "../../Components.props";
import { GraphAnalyseTimelineModel } from "../../../Models/analyses/temporelles/GraphAnalyseTimeline.model";
import { GraphAnalyseTimelineItemModel } from "../../../Models/analyses/temporelles/GraphAnalyseMensuel.model";


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
                                    analyseSoldesCategoriesData }: GraphAnalyseTemporelleProps) => {

    /**
     * 
     * @returns {Array} Les données pour le graphique.
     */
    function getGraphData() {
        let dataGraphTimeline: GraphAnalyseTimelineModel = { dataGraphTimelineItem: {} };

        /** Init du tableau pour l'affichage du graphique **/
        console.log("Construction de l'affichage de l'analyse temporelle pour", anneeAnalyses);
        populateGraphCategories(anneeAnalyses, analyseSoldesCategoriesData, timelinesByCategoriesData, false, dataGraphTimeline);
        populateGraphCategories(anneeAnalyses, analyseSoldesCategoriesData, timelinesPrevisionnellesByCategoriesData, true, dataGraphTimeline);
        populateGraphSoldes(anneeAnalyses, timelinesSoldesData, filterSoldesActive, false, dataGraphTimeline);
        populateGraphSoldes(anneeAnalyses, timelinesPrevisionnellesSoldesData, filterSoldesActive, true, dataGraphTimeline);
        return flatCategoriesData(dataGraphTimeline, analyseSoldesCategoriesData, filterSoldesActive);
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
