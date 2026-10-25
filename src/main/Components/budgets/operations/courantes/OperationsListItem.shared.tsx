import React, {JSX} from 'react'
import {Box, Grid, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import OperationValue from "../../../../Utils/renderers/OperationValue.renderer.tsx";
import { CenterComponent } from '../../../shared/CenterComponent.tsx';
import {getCategorieColor, getCategorieIcon} from '../../../../Utils/renderers/CategorieItem.renderer.tsx';
import {useBudgetContext} from '../../../../Models/contextProvider/BudgetContextProvider.tsx';
import {getOperationLibelle, getOperationStateLabel} from '../../../../Utils/renderers/OperationItem.renderer.tsx';
import OperationModel from '../../../../Models/budgets/Operation.model.ts';
import OperationStatus from '../../../../Utils/renderers/OperationStatus.renderer.tsx';

/**
 * Props for the shared operation item component
 */
interface SharedOperationItemProps {
    operation: OperationModel;
    onClick: (operation: OperationModel) => void;
    getBorderColor: (operation: OperationModel) => string;
    isSelected?: boolean;
    isOneSelected?: boolean;
}
/** Hauteur fixe d'une ligne (px), identique mobile/desktop, avec ou sans commentaire.
 * Calcul : liste = innerHeight - 140 (881px -> 741px) ; ligne 64 + séparateur 1 = 65 -> 11 lignes (715px). */
export const OPERATION_ROW_HEIGHT = 64;

const ELLIPSIS_STYLE = {overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"} as const;

/**
 * Shared operation item component
 * Renders a single operation in the list with customizable border color
 * @param operation operation to display
 * @param onClick callback for operation selection
 * @param getBorderColor function to determine the outer border color
 * @returns JSX.Element
 */
const SharedOperationItem: React.FC<SharedOperationItemProps> = ({
    operation,
    onClick: handleOperationSelect,
    getBorderColor,
    isSelected,
    isOneSelected
}: SharedOperationItemProps): JSX.Element => {

    const budgetContext = useBudgetContext();
    const comptes = budgetContext?.comptes;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const ringColor = getBorderColor(operation);

    return (
        <Box key={"liste_" + operation.id}
             onClick={() => handleOperationSelect(operation)}
             className={"operation-list-item" + (isSelected ? " operation-list-item--selected" : "")}
             sx={{
                 height: OPERATION_ROW_HEIGHT,
                 boxSizing: "border-box",
                 overflow: "hidden",
                 ...(isOneSelected && !isSelected ? {opacity: 0.75} : {})
             }}>
            <Grid container sx={{height: "100%", alignItems: 'center'}}>
                <Grid size={{md: 1.5, xl: 1.5}} sx={{paddingLeft: isMobile ? '8px' : '14px'}}>
                    <Box role={operation.etat != null ? "img" : undefined}
                         aria-label={operation.etat != null ? getOperationStateLabel(operation.etat) : undefined}
                         sx={{
                             boxSizing: "border-box",
                             width: 46,
                             height: 46,
                             borderRadius: '50%',
                             border: '3px solid ' + ringColor,
                         }}>

                        <Box
                             sx={{
                                 boxSizing: "border-box",
                                 width: 40,
                                 height: 40,
                                 borderRadius: '50%',
                                 backgroundColor: getCategorieColor(operation.categorie.id),
                                 border: '3px solid black',
                                 padding: '4px',
                                 color: '#252525'
                             }}>
                            <CenterComponent>{getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{md: 6.5, xl: 6.5}} sx={{minWidth: 0}}>
                    <Stack direction={"column"} sx={{minWidth: 0}}>
                        <Typography variant={"subtitle1"} component="div"
                                    sx={{textAlign: "left", paddingLeft: isMobile ? 1 : 2, lineHeight: 1.5,
                                        fontSize: isMobile ? "0.9375rem" : "1rem", ...ELLIPSIS_STYLE}}>
                            {getOperationLibelle(operation.libelle, comptes || [], false, isMobile)}
                        </Typography>
                        <Typography variant={"caption"} component="div"
                                    sx={{textAlign: "left", paddingLeft: isMobile ? 1 : 2, fontSize: "0.75rem", lineHeight: 1.4,
                                        color: "var(--color-operation-subtext, #a8a8a8)", ...ELLIPSIS_STYLE}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{md: 1.5, xl: 1.5}}>
                    <Typography component="div" sx={{ textAlign: "center" }}>
                        <OperationStatus statutsOperation={operation.statuts || []} />
                    </Typography>
                </Grid>
                <Grid  size={{md: 2.5, xl: 2.5}}>
                    <Typography variant={"subtitle1"} component="div" sx={{textAlign: "right", paddingRight: isMobile ? 1 : 2, whiteSpace: "nowrap"}}>
                        <OperationValue id={operation.id} operation={operation} valueOperation={operation.valeur} showSign={true} explicitPlus={true}/>
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SharedOperationItem;
