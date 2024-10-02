import { LabelProps } from "recharts";
import { getCategorieColor } from "../../../Utils/renderers/CategorieItem.renderer";
import { PolarViewBox } from "recharts/types/util/types";
import AnalyseCategoriesModel from "../../../Models/analyses/AnalyseCategories.model";
import React from "react";

    /**
     * Render du label pour une catégorie
     * @param props properties
     * @returns {*}
     */
    export function renderLabelCategorie(props : LabelProps, resumeSelectedCategorie : AnalyseCategoriesModel | null) {
        const selectedId = resumeSelectedCategorie !== null && resumeSelectedCategorie.categorie.id === props.id;
        const color = getCategorieColor(resumeSelectedCategorie !== null ? resumeSelectedCategorie.categorie.id : null)
        return renderLabelAnalyse(props, selectedId, color);
    }

    /**
     * Render du label pour une sous catégorie
     * @param props
     * @returns {*}
     */
    export function renderLabelSsCategorie(props : LabelProps, resumeSelectedSsCategorie : AnalyseCategoriesModel | null) {
        const selectedId = resumeSelectedSsCategorie !== null && resumeSelectedSsCategorie.categorie.id === props.id;
        return renderLabelAnalyse(props, selectedId, "#808080");
    }

    /**
     * Render du label pour une analyse
     * @param props properties
     * @param selectedId : boolean si la catégorie est sélectionnée
     * @param color couleur
     * @returns {JSX.Element}
     */
    export function renderLabelAnalyse(props : LabelProps, selectedId : boolean, color : string) : JSX.Element {
        const {cx, cy, viewBox, value} = props;
        const polarViewBox = viewBox as PolarViewBox;
        const midRadius = ((polarViewBox?.outerRadius ?? 0) + (polarViewBox?.innerRadius ?? 0)) / 2;
        // Calcul de l'angle du texte au milieu de la circonference
        // Conversion en radian, dans le sens horaire
        const midAngle = -((viewBox as any).startAngle + (viewBox as any).endAngle) / 2 * Math.PI / 180;
        const x = (typeof cx === 'number' ? cx : 0) + Math.cos(midAngle) * midRadius;
        const y = (typeof cy === 'number' ? cy : 0) + Math.sin(midAngle) * midRadius;

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

