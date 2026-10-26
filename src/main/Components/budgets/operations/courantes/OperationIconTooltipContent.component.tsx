import React, {JSX} from 'react'
import {Box, Typography} from "@mui/material";
import OperationModel from '../../../../Models/budgets/Operation.model.ts';
import {OPERATION_ETATS_ENUM} from '../../../../Utils/AppBusinessEnums.constants.ts';
import {getOperationStateColor, getOperationStateLabel, getPeriodeRenderer} from '../../../../Utils/renderers/OperationItem.renderer.tsx';

/** Signification de l'anneau autour de l'icône : état de l'opération (courantes) ou périodicité (récurrentes) */
export type OperationRingMeaning = 'etat' | 'periode';

interface OperationIconTooltipContentProps {
    operation: OperationModel;
    /** Couleur de l'anneau de l'icône */
    ringColor: string;
    /** Couleur de fond de l'icône (catégorie) */
    categorieColor: string;
    ringMeaning: OperationRingMeaning;
}

/** États expliqués dans la légende de l'anneau */
const LEGEND_ETATS: OPERATION_ETATS_ENUM[] = [
    OPERATION_ETATS_ENUM.PREVUE,
    OPERATION_ETATS_ENUM.REPORTEE,
    OPERATION_ETATS_ENUM.REALISEE,
    OPERATION_ETATS_ENUM.ANNULEE
];

const PANEL_SX = {backgroundColor: '#424242', color: 'white', borderRadius: '4px', padding: '8px 12px', maxWidth: 280} as const;
const SECONDARY_COLOR = '#e0e0e0';
const ROW_SX = {display: 'flex', alignItems: 'center', columnGap: 1} as const;

/** Pastille de couleur (décorative : le sens est toujours porté par le texte voisin) */
const Swatch: React.FC<{color: string}> = ({color}: {color: string}): JSX.Element => (
    <Box component="span" aria-hidden="true"
         sx={{display: 'inline-block', flexShrink: 0, width: 12, height: 12, borderRadius: '50%', backgroundColor: color, border: '1px solid #e0e0e0'}}/>
);

/**
 * Contenu de l'infobulle de l'icône d'une opération : catégorie, sous-catégorie, statut et légende des couleurs.
 * Rendu uniquement à l'ouverture de l'infobulle (contenu paresseux).
 */
const OperationIconTooltipContent: React.FC<OperationIconTooltipContentProps> = ({
    operation, ringColor, categorieColor, ringMeaning
}: OperationIconTooltipContentProps): JSX.Element => {

    const isEtat = ringMeaning === 'etat';
    let statut: string | null;
    if (!isEtat) {
        statut = getPeriodeRenderer(operation.mensualite?.periode).text;
    } else if (operation.etat != null) {
        statut = getOperationStateLabel(operation.etat);
    } else {
        statut = null;
    }

    return (
        <Box sx={PANEL_SX}>
            <Box sx={ROW_SX}>
                <Swatch color={categorieColor}/>
                <Typography variant="body2" component="div" sx={{fontWeight: 'bold'}}>{operation.categorie.libelle}</Typography>
            </Box>
            <Typography variant="caption" component="div" sx={{color: SECONDARY_COLOR, paddingLeft: '20px'}}>
                {operation.ssCategorie.libelle}
            </Typography>
            {statut != null &&
                <Box sx={{...ROW_SX, marginTop: 1}}>
                    <Swatch color={ringColor}/>
                    <Typography variant="body2" component="div">{isEtat ? 'Statut' : 'Périodicité'} : {statut}</Typography>
                </Box>
            }
        </Box>
    );
};

export default OperationIconTooltipContent;
