import React, {JSX, useContext} from 'react'
import {Box, Grid, Stack, Typography} from "@mui/material";
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
    return (
        <Box key={"liste_" + operation.id}
             className={"listeItem"}
             onClick={() => handleOperationSelect(operation)}>
            <Grid container spacing={6}>
                <Grid size={{md: 1}}>
                    <Box width={50} height={50}
                         sx={{
                             borderRadius: '50%',
                             border: '3px solid ' + getOperationStateColor(operation.etat),
                         }}>

                        <Box width={44} height={44}
                             sx={{
                                 borderRadius: '50%',
                                 backgroundColor: getCategorieColor(operation.categorie.id),
                                 border: '3px solid black',
                                 padding: '6px',
                                 color: '#252525'
                             }}>
                            <CenterComponent>{getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                        </Box>
                    </Box>
                </Grid>
                <Grid size={{md: 7}}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"}
                                    sx={{spacing: 2, paddingLeft: 2}}>
                            {getOperationLibelle(operation.libelle, comptes, false)}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, paddingLeft: 2, color: "#808080"}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>

                </Grid>
                <Grid size={{md: 3}}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue id={operation.id} operation={operation} valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid>
            </Grid>
        </Box>

    )
};
export default OperationItem
