import React, { JSX } from "react";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer.tsx";
import AnalyseTooltip, { AnalyseTooltipRow } from "./AnalyseTooltip.component.tsx";

interface TooltipTreeMapProps {
    active?: boolean;
    payload?: any[];
}

/**
 * Custom tooltip for TreeMap visualization
 * Displays category/subcategory name, percentage, total amount, and number of transactions
 */
const AnalyseTreeMapTooltip: React.FC<TooltipTreeMapProps> = ({ active, payload }: TooltipTreeMapProps): JSX.Element => {
    const data = payload?.[0]?.payload;
    if (!data) {
        return <AnalyseTooltip active={active} rows={[]} />;
    }

    const { name, size, total, nbTransactions } = data;

    const rows: AnalyseTooltipRow[] = [
        { key: 'pourcentage', label: "Pourcentage :", value: size?.toFixed(2) + "%" }
    ];
    if (total !== undefined) {
        rows.push({
            key: 'montant',
            label: "Montant :",
            value: <OperationValue valueOperation={total.toFixed(2)} showSign={true} id={`${name}.TOTAL`} />
        });
    }
    if (nbTransactions !== undefined) {
        rows.push({ key: 'transactions', label: "Transactions :", value: nbTransactions });
    }

    return <AnalyseTooltip active={active} title={name} rows={rows} minWidth="200px" />;
};

export default AnalyseTreeMapTooltip;
