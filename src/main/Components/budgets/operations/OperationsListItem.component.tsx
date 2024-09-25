import React from 'react'
import {Box, Grid2, Stack, Typography} from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer";
import * as Renderer from "../../../Utils/renderers/OperationItem.renderer";
import * as CategorieRenderer from "../../../Utils/renderers/CategorieItem.renderer";
import OperationModel from '@/src/main/Models/Operation.model';
import CompteBancaireModel from '@/src/main/Models/CompteBancaire.model';
import CenterComponent from '../../CenterComponent';


interface OperationItemProps {
    key: string
    operation: OperationModel
    listeComptes: CompteBancaireModel[]
    onClick: (operation : OperationModel) => void
}


/**
 * Tuile d'une opération dans la liste des opérations
 * @param {string} key : clé de l'opération
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @param onClick : function action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationItem: React.FC<OperationItemProps> = ({key, operation, listeComptes, onClick : handleOperationSelect}) : JSX.Element => {


    return (
        <Box key={"liste_" + key}
             className={"listeItem"}
             onClick={() => handleOperationSelect(operation)}>
            <Grid2 container spacing={6}>
                <Grid2 m={1}>
                    <Box width={50} height={50}
                         sx={{
                             borderRadius: '50%',
                             border: '3px solid ' + Renderer.getOperationStateColor(operation.etat),
                         }}>

                        <Box width={44} height={44}
                             sx={{
                                 borderRadius: '50%',
                                 backgroundColor: CategorieRenderer.getCategorieColor(operation.categorie),
                                 border: '3px solid black',
                                 padding: '6px',
                                 color: '#252525'
                             }}>
                            <CenterComponent>{CategorieRenderer.getCategorieIcon(operation.ssCategorie)}</CenterComponent>
                        </Box>
                    </Box>
                </Grid2>
                <Grid2 m={7}>
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
                <Grid2 m={3}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue id={operation.id} operation={operation} valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};
export default OperationItem
