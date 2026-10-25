import React, { JSX } from "react";
import { getTypeCategorieRenderer } from "../../../Utils/renderers/OperationItem.renderer.tsx";
import { TYPES_CATEGORIES_OPERATION_ENUM } from "../../../Utils/AppBusinessEnums.constants.ts";
import AnalyseTooltip, { AnalyseTooltipRow } from "./AnalyseTooltip.component.tsx";

interface TooltipSyntheseProps {
    active?: boolean;
    payload?: any[];
}

/**
 * Custom tooltip for TreeMap visualization
 * Displays category/subcategory name, percentage, total amount, and number of transactions
 */
const AnalyseSyntheseTooltip: React.FC<TooltipSyntheseProps> = ({ active, payload }: TooltipSyntheseProps): JSX.Element => {
    if (!payload || payload.length === 0) {
        return <AnalyseTooltip active={active} rows={[]} variant="inline" />;
    }
    const { name, value } = payload[0];
    const typeCategorie = getTypeCategorieRenderer(name as TYPES_CATEGORIES_OPERATION_ENUM);

    const rows: AnalyseTooltipRow[] = [{
        key: name,
        color: typeCategorie.color,
        label: typeCategorie.text,
        value: ": " + value?.toFixed(2) + "%"
    }];

    return <AnalyseTooltip active={active} rows={rows} variant="inline" />;
};

export default AnalyseSyntheseTooltip;
