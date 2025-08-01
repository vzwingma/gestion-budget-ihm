import React, {JSX} from "react";
import AnalyseCategoriesModel from "../../../../Models/analyses/categories/AnalyseCategories.model";
import GraphAnalyseCategoriesModel from "../../../../Models/analyses/categories/GraphAnalyseCategories.model";
import CategorieOperationModel from "../../../../Models/budgets/CategorieOperation.model";
import {sortLibellesCategories} from "../../../../Utils/OperationData.utils";
import {PieLabelProps} from "recharts/types/polar/Pie";
import { getCategorieColor } from "../../../../Utils/renderers/CategorieItem.renderer";


/**
 * Populate des data pour les graphs d'une catégorie
 * @param analysesGroupedByCategories : object analyses groupées des catégories
 * @param typeAnalyse
 * @param dataGraphCategories : array tableau pour alimenter le graphique
 * @param dataGraphSsCategories
 * @param parentCategorie : object catégorie parente
 */
export function populateGraphAnalyseCategories(analysesGroupedByCategories: {
                                                   [idCategorie: string]: AnalyseCategoriesModel
                                               },
                                               typeAnalyse: string,
                                               dataGraphCategories: GraphAnalyseCategoriesModel[],
                                               dataGraphSsCategories: GraphAnalyseCategoriesModel[] | null, parentCategorie?: CategorieOperationModel) {
    const arrayAnalysesGroupedByCategories: AnalyseCategoriesModel[] = []
    // transform en array
    for (let categorieId in analysesGroupedByCategories) {
        arrayAnalysesGroupedByCategories.push(analysesGroupedByCategories[categorieId]);
    }

    // Populate datagategories
    arrayAnalysesGroupedByCategories
        .filter(analysesOfCategorie => analysesOfCategorie.nbTransactions[typeAnalyse] > 0)
        .sort((analysesOfCategorie1, analysesOfCategorie2) => sortLibellesCategories(analysesOfCategorie1.categorie, analysesOfCategorie2.categorie))
        .forEach((analysesOfCategorie) => {

            dataGraphCategories.push({
                id: analysesOfCategorie.categorie.id!,
                categorie: parentCategorie ?? analysesOfCategorie.categorie,
                name: analysesOfCategorie.categorie.libelle + " : " + analysesOfCategorie.pourcentage[typeAnalyse] + "%",
                value: Math.abs(analysesOfCategorie.total[typeAnalyse])
            })
            // Populate pour les sous catégories
            if (analysesOfCategorie.resumesSsCategories !== undefined && analysesOfCategorie.resumesSsCategories !== null && dataGraphSsCategories !== null) {
                populateGraphAnalyseCategories(analysesOfCategorie.resumesSsCategories, typeAnalyse, dataGraphSsCategories, null, analysesOfCategorie.categorie);
            }
        })
}

/**
     * Rend une étiquette de catégorie avec des propriétés spécifiques.
     *
     * @param props - Les propriétés de l'étiquette à rendre.
     * @param resumeSelectedCategorie - Le modèle de la catégorie sélectionnée ou null si aucune catégorie n'est sélectionnée.
     * @returns Un élément JSX représentant l'étiquette de la catégorie.
     */
export function renderLabelCategorie(props: PieLabelProps, resumeSelectedCategorie: AnalyseCategoriesModel | null): JSX.Element {
    const selectedId = resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === props.id;
    const color = getCategorieColor(resumeSelectedCategorie !== null ? resumeSelectedCategorie.categorie.id : null)
    return renderLabelAnalyse(props, selectedId, color);
}

/**
 * Rend une étiquette de sous-catégorie avec des propriétés spécifiques.
 *
 * @param props - Les propriétés de l'étiquette à rendre.
 * @param resumeSelectedSsCategorie - Le modèle de la sous-catégorie sélectionnée ou null si aucune sous-catégorie n'est sélectionnée.
 * @returns Un élément JSX représentant l'étiquette de la sous-catégorie.
 */
export function renderLabelSsCategorie(props: PieLabelProps, resumeSelectedSsCategorie: AnalyseCategoriesModel | null): JSX.Element {
    const selectedId = resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === props.id;
    const color = getCategorieColor(resumeSelectedSsCategorie !== null ? resumeSelectedSsCategorie.categorie.id : null)
    return renderLabelAnalyse(props, selectedId, color);
}



export const renderLabelAnalyse = (props: PieLabelProps, selectedId: boolean, color : string) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (<>
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
                  fontSize={selectedId ? 17 : 12} textAnchor="middle">
                {payload.name}
            </text>
        </>
    );
};

