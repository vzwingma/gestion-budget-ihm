import React from 'react'
import {Box, Grid2, Stack, Typography} from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import * as Renderer from "../../../Utils/renderers/OperationItem.renderer";
import * as CategorieRenderer from "../../../Utils/renderers/CategorieItem.renderer";
import CenterComponent from '../../CenterComponent';
import OperationModel from "../../../Models/Operation.model";
import CompteBancaireModel from "../../../Models/CompteBancaire.model";


interface OperationItemProps {
    operation: OperationModel
    listeComptes: CompteBancaireModel[]
    onClick: (operation : OperationModel) => void
}


/**
 * Tuile d'une opération dans la liste des opérations
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @param onClick : function action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationItem: React.FC<OperationItemProps> = ({operation, listeComptes, onClick : handleOperationSelect} : OperationItemProps) : JSX.Element => {


    return (
        <Box key={"liste_" + operation.id}
             className={"listeItem"}
             onClick={() => handleOperationSelect(operation)}>
            <Grid2 container spacing={6}>
                <Grid2 size={{md: 1}}>
                    <Box width={50} height={50}
                         sx={{
                             borderRadius: '50%',
                             border: '3px solid ' + Renderer.getOperationStateColor(operation.etat),
                         }}>

                        <Box width={44} height={44}
                             sx={{
                                 borderRadius: '50%',
                                 backgroundColor: CategorieRenderer.getCategorieColor(operation.categorie.id),
                                 border: '3px solid black',
                                 padding: '6px',
                                 color: '#252525'
                             }}>
                            <CenterComponent>{CategorieRenderer.getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                        </Box>
                    </Box>
                </Grid2>
                <Grid2 size={{md: 7}}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"}
                                    sx={{spacing: 2, paddingLeft: 2}}>
                            {Renderer.getOperationLibelle(operation.libelle, listeComptes, false)}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, paddingLeft: 2, color: "#808080"}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>

                </Grid2>
                <Grid2 size={{md: 3}}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue id={operation.id} operation={operation} valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};
export default OperationItem
