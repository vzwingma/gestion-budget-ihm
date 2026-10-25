import React, {JSX} from 'react'
import {Box} from "@mui/material";
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../Utils/AppBusinessEnums.constants.ts';
import {addEndingZeros} from '../../../Utils/OperationData.utils.ts';
import {getLabelJourSemaineFRFromDate} from '../../../Utils/Date.utils.ts';
import {GROUPE_A_VALIDER} from '../budget/Budget.controller.ts';

/** Hauteur fixe de l'en-tête de groupe (px) : compact pour garder ≥ 11 lignes visibles */
export const OPERATIONS_HEADER_HEIGHT = 40;

interface OperationsListHeaderProps {
    /** Clé du groupe : GROUPE_A_VALIDER ou date au format FR (jj/mm/aaaa) */
    groupKey: string;
    /** Opérations du groupe, déjà filtrées (filtre texte) */
    operations: OperationModel[];
}

/**
 * Total signé arrondi au centime, formaté (« +12,00 € », « -4,35 € », « 0,00 € »)
 * @param operations opérations à totaliser
 * @param exclureInactives true pour ignorer les opérations annulées / supprimées (sans effet sur le solde)
 */
export function getTotalLabel(operations: OperationModel[], exclureInactives: boolean): string {
    const total = operations
        .filter((operation: OperationModel) => !exclureInactives
            || (operation.etat !== OPERATION_ETATS_ENUM.ANNULEE && operation.etat !== OPERATION_ETATS_ENUM.SUPPRIMEE))
        .reduce((somme: number, operation: OperationModel) => somme + operation.valeur, 0);
    const arrondi = Math.round(total * 100) / 100 || 0;
    return (arrondi > 0 ? "+" : "") + addEndingZeros(arrondi) + " €";
}

/**
 * En-tête de groupe de la liste des opérations :
 * « À valider · N · total » ou « Jour jj/mm · sous-total »
 * Valeurs dérivées au rendu des opérations filtrées (aucun state).
 */
const OperationsListHeader: React.FC<OperationsListHeaderProps> = ({groupKey, operations}: OperationsListHeaderProps): JSX.Element => {

    let titre: string;
    if (groupKey === GROUPE_A_VALIDER) {
        titre = "À valider · " + operations.length;
    } else {
        const dateOperation = operations[0]?.autresInfos.dateOperation;
        const jour = dateOperation == null ? "" : getLabelJourSemaineFRFromDate(new Date(dateOperation)) + " ";
        titre = jour + groupKey.slice(0, 5);
    }
    const total = getTotalLabel(operations, groupKey !== GROUPE_A_VALIDER);

    return (
        <Box role="heading" aria-level={3}
             sx={{
                 height: OPERATIONS_HEADER_HEIGHT,
                 minHeight: OPERATIONS_HEADER_HEIGHT,
                 flexShrink: 0,
                 boxSizing: "border-box",
                 display: "flex",
                 alignItems: "center",
                 px: 2,
                 fontSize: "0.875rem",
                 fontWeight: 600,
                 whiteSpace: "nowrap",
                 backgroundColor: "var(--color-separator-bg)",
                 color: "var(--color-separator-text)"
             }}>
            <span style={{fontVariantNumeric: "tabular-nums"}}>{titre} · {total}</span>
        </Box>
    );
};

export default OperationsListHeader;
