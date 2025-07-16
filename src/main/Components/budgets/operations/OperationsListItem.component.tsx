import React, {JSX, useContext} from 'react'
import {Box, Grid, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import CenterComponent from '../../CenterComponent';
import {OperationItemProps} from '../../Components.props';
import {getOperationLibelle, getOperationStateColor} from '../../../Utils/renderers/OperationItem.renderer';
import {getCategorieColor, getCategorieIcon} from '../../../Utils/renderers/CategorieItem.renderer';
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider';


/**
 * Tuile d'une opération dans la liste des opérations
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationItem: React.FC<OperationItemProps> = ({operation, onClick : handleOperationSelect} : OperationItemProps) : JSX.Element => {

    const { comptes } = useContext(BudgetContext)!;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <Box key={"liste_" + operation.id}
             onClick={() => handleOperationSelect(operation)}>
            <Grid container spacing={6} height={isMobile ? 45 : 70} alignItems="center">
                <Grid size={{md: 0.5, xl: 1}} sx={{paddingLeft: '10px'}}>
                    <Box width={isMobile ? 38 : 50} height={isMobile ? 38 : 50}
                         sx={{
                             borderRadius: '50%',
                             border: (isMobile ? '2px' : '3px') + ' solid ' + getOperationStateColor(operation.etat),
                         }}>

                        <Box width={isMobile ? 34 : 44} height={isMobile ? 34 : 44}
                             sx={{
                                 borderRadius: '50%',
                                 backgroundColor: getCategorieColor(operation.categorie.id),
                                 border: (isMobile ? '2px' : '3px') + ' solid black',
                                 padding: isMobile ? '3px' : '6px',
                                 color: '#252525'
                             }}>
                            <CenterComponent>{getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{md: 7, xl: 7}}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"}
                                    sx={{spacing: 2, paddingLeft: isMobile ? 1 : 2}}>
                            {getOperationLibelle(operation.libelle, comptes, false, isMobile)}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, paddingLeft: isMobile ? 1 : 2, color: "#808080"}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>

                </Grid>
                <Grid size={{md: 3, xl: 3}}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue id={operation.id} operation={operation} valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid>
            </Grid>
        </Box>

    )
};
export default OperationItem
