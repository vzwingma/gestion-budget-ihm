import React, { JSX } from 'react'
import { Grid, Typography } from "@mui/material";
import { OperationDetailMensualite } from './OperationDetailMensualite.component.tsx';
import { OperationDetailDateFin } from '../../../shared/OperationRecurrenteDetailDateFin.component.tsx';
import { BUSINESS_GUID, PERIODES_MENSUALITE_ENUM } from '../../../../../../Utils/AppBusinessEnums.constants.ts';
import { OperationDetailMensualiteSectionProps } from '../../../../../Components.props.ts';

/**
 * Section « Période / Date de fin » de la page de détail (masquée pour la catégorie Actifs / Investissements,
 * dont la période est forcée à Mensuelle). Éléments de grille, à insérer dans un `Grid container`.
 */
export const OperationDetailMensualiteSection: React.FC<OperationDetailMensualiteSectionProps> = ({
    editForm, errors, editOperation, fillOperationForm, resetKey
}: OperationDetailMensualiteSectionProps): JSX.Element => {

    if (editOperation.categorie.id === BUSINESS_GUID.CAT_ACTIFS_INVEST) {
        return <></>;
    }
    const periode = editOperation.mensualite.periode;
    const avecDateFin = periode !== undefined && periode !== PERIODES_MENSUALITE_ENUM.PONCTUELLE;

    return (
        <>
            <Grid size={{ md: 8, xl: 8 }}>
                <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Période</Typography>
            </Grid>
            <Grid size={{ md: 4, xl: 4 }}>
                {avecDateFin &&
                    <Typography variant={"caption"} sx={{ color: "var(--color-heading-text)" }}>Date de fin</Typography>
                }
            </Grid>
            <Grid size={{ md: 8, xl: 8 }}>
                { /** Période **/}
                <OperationDetailMensualite
                    formMensualiteInEdition={editForm.mensualite}
                    periodeInEdition={periode}
                    fillOperationForm={fillOperationForm} />
            </Grid>
            <Grid size={{ md: 4, xl: 4 }}>
                { /** DATE FIN **/}
                {avecDateFin &&
                    <OperationDetailDateFin key={resetKey} formDateInEdition={editForm.dateFin}
                        errorDateOperation={errors.dateFin}
                        fillOperationForm={fillOperationForm} />}
            </Grid>
        </>
    )
}
