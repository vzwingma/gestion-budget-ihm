import React, {JSX, useMemo} from "react";
import {Box, Button} from "@mui/material";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import FilterChips from "./FilterChips.component.tsx";
import {FILTER_BAR_HEIGHT} from "../../../Utils/renderers/ListData.renderer.utils.tsx";
import {FILTRE_OPERATIONS_VIDE, FiltreOperations, isFiltreActif} from "../../../Utils/OperationsFilter.utils.ts";
import {getTotalLabel} from "../operations/OperationsListHeader.component.tsx";

interface OperationsFilterBarProps {
    filtre: FiltreOperations;
    onFiltreChange: (filtre: FiltreOperations) => void;
    /** Opérations de la liste après filtrage (texte + puces) : source du compteur et du net */
    operationsFiltrees: OperationModel[];
}

/**
 * Barre de filtres de l'en-tête : puces + (si un filtre texte ou puce est actif) résultat
 * « N opérations · net X,XX € · Réinitialiser ». Hauteur fixe (`FILTER_BAR_HEIGHT`) : pas de saut de layout.
 *
 * Le net est la somme signée des opérations filtrées, hors ANNULEE/SUPPRIMEE (cohérent avec les sous-totaux par date).
 */
const OperationsFilterBar: React.FC<OperationsFilterBarProps> = ({filtre, onFiltreChange, operationsFiltrees}: OperationsFilterBarProps): JSX.Element => {

    const actif = isFiltreActif(filtre);
    const net = useMemo(() => getTotalLabel(operationsFiltrees, true), [operationsFiltrees]);
    const nombre = operationsFiltrees.length;

    return (
        <Box sx={{
            height: FILTER_BAR_HEIGHT,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            columnGap: 2,
            overflow: "hidden",
            whiteSpace: "nowrap"
        }}>
            <FilterChips puces={filtre} onChange={(puces) => onFiltreChange({...filtre, ...puces})}/>
            {actif &&
                <Box role="status" sx={{display: "flex", alignItems: "center", fontSize: "0.875rem", color: "#f0f0f0"}}>
                    <span style={{fontVariantNumeric: "tabular-nums"}}>
                        {nombre} {nombre > 1 ? "opérations" : "opération"} · net {net}
                    </span>
                    <span aria-hidden="true">&nbsp;·&nbsp;</span>
                    <Button size="small" onClick={() => onFiltreChange(FILTRE_OPERATIONS_VIDE)}
                            sx={{minHeight: 44, minWidth: 44, textTransform: "none", fontSize: "0.875rem"}}>
                        Réinitialiser
                    </Button>
                </Box>
            }
        </Box>
    );
};

export default OperationsFilterBar;
