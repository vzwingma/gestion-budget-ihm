import React, { JSX } from 'react'
import { Grid, Typography } from "@mui/material";
import { OperationDetailDate } from './OperationDetailDateOperation.component.tsx';
import { getOperationStateColor } from '../../../../../../Utils/renderers/OperationItem.renderer.tsx';
import { OperationDetailEtatSectionProps } from "../OperationDetailPage.props.ts";

/**
 * Section « Etat / Date d'opération » de la page de détail (éléments de grille, à insérer dans un `Grid container`)
 */
export const OperationDetailEtatSection: React.FC<OperationDetailEtatSectionProps> = ({
    etat, editForm, errors, fillOperationForm, resetKey
}: OperationDetailEtatSectionProps): JSX.Element => {
    return (
        <>
            <Grid size={{ md: 8, xl: 8 }}>
                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Etat</Typography>
            </Grid>
            <Grid size={{ md: 4, xl: 4 }}>
                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Date d'opération</Typography>
            </Grid>

            <Grid size={{ md: 8, xl: 8 }}>
                <Typography variant={"overline"} style={{ border: '1px solid ' + getOperationStateColor(etat), padding: '8px', paddingRight: '10px', borderRadius: '4px', color: getOperationStateColor(etat) }}>
                    {etat}
                </Typography>
            </Grid>

            <Grid size={{ md: 4, xl: 4 }}>
                { /** DATE OPERATION **/}
                <OperationDetailDate
                    key={resetKey}
                    formDateInEdition={editForm.dateOperation}
                    errorDateOperation={errors.dateOperation}
                    fillOperationForm={fillOperationForm} />
            </Grid>
        </>
    )
}
