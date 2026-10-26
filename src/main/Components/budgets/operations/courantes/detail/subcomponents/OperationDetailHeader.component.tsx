import React, { JSX } from 'react'
import { Box, Grid } from "@mui/material";
import { CenterComponent } from '../../../../../shared/CenterComponent.tsx';
import { getCategorieColor, getCategorieIcon } from '../../../../../../Utils/renderers/CategorieItem.renderer.tsx';
import OperationDetailStatus from '../../../../../../Utils/renderers/OperationDetailStatus.renderer.tsx';
import OperationEditionModel from '../../../../../../Models/budgets/OperationEdition.model.ts';
import { OPERATION_STATUS_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';

interface OperationDetailHeaderProps {
    /** Opération en édition (catégorie affichée en direct) */
    editOperation: OperationEditionModel
    /** Statuts de l'opération courante */
    statuts?: OPERATION_STATUS_ENUM[] | null
}

/**
 * En-tête de la page de détail d'une opération : pastille catégorie + statuts
 */
export const OperationDetailHeader: React.FC<OperationDetailHeaderProps> = ({ editOperation, statuts }: OperationDetailHeaderProps): JSX.Element => {
    return (
        <Grid container sx={{ width: "90%" }}>
            <Grid size={{ md: 4, xl: 4 }} />
            <Grid size={{ md: 4, xl: 4 }}>
                <CenterComponent>
                    <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: getCategorieColor(editOperation.categorie.id),
                        color: 'var(--color-white)',
                        padding: '15px 0px 0px 15px'
                    }}>
                        {getCategorieIcon(editOperation.ssCategorie)}
                    </Box>
                </CenterComponent>
            </Grid>
            <Grid size={{ md: 4, xl: 4 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                { /** STATUT **/}
                {statuts !== null && statuts !== undefined ?
                    <OperationDetailStatus statutsOperation={statuts} /> : <></>
                }
            </Grid>
        </Grid>
    )
}
