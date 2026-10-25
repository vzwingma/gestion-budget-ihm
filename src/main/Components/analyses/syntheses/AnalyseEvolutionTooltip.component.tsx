import React, { JSX } from "react";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer.tsx";
import AnalyseTooltip, { AnalyseTooltipRow } from "./AnalyseTooltip.component.tsx";

interface TooltipEvolutionProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

/**
 * Custom tooltip for TreeMap visualization
 * Displays category/subcategory name, percentage, total amount, and number of transactions
 */
const AnalyseEvolutionTooltip: React.FC<TooltipEvolutionProps> = ({ active, payload, label }: TooltipEvolutionProps): JSX.Element => {
    // Filtrer les items avec valeur 0 et trier par nom
    const rows: AnalyseTooltipRow[] = (payload ?? [])
        .filter((entry: any) => entry.value !== 0)
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((entry: any): AnalyseTooltipRow => ({
            key: entry.dataKey,
            color: entry.color,
            label: entry.name + " :",
            value: <OperationValue valueOperation={entry.value.toFixed(2)} showSign={true} id={`${entry.dataKey}.VALUE`} />
        }));

    return <AnalyseTooltip active={active} title={label} rows={rows} minWidth="200px" />;
};

export default AnalyseEvolutionTooltip;
