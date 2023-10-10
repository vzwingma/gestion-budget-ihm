import React from 'react'
import {Box, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationValue from "../../Utils/renderers/OperationValue.renderer";
import * as Renderer from "../../Utils/renderers/OperationItem.renderer";
import * as CategorieRenderer from "../../Utils/renderers/CategorieItem.renderer";
import PropTypes from "prop-types";

/**
 * Tuile d'une opération dans la liste des opérations
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @param onClick : function action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationItem = ({operation, listeComptes, onClick}) => {


    return (
        <Box key={"liste_" + operation.id}
             sx={{
                 height: 56,
                 marginY: 1,
                 '&:hover': {
                     backgroundColor: '#f5f6fb',
                     color: '#808080',
                     cursor: 'pointer',
                 }
             }}
             onClick={() => onClick(operation)}>
            <Grid2 container spacing={6}>
                <Grid2 md={1}>
                    <Box width={25} height={25}
                         sx={{
                             borderRadius: "50%",
                             backgroundColor: CategorieRenderer.getCategorieColor(operation.categorie),
                             border: '5px solid ' + Renderer.getOperationStateColor(operation.etat),
                             padding: '6px',
                             color: '#FFFFFF'
                         }}>
                        <center>{CategorieRenderer.getCategorieIcon(operation.ssCategorie)}</center>
                    </Box>
                </Grid2>
                <Grid2 md={7}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                            {Renderer.getOperationLibelle(operation.libelle, listeComptes, false)}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>

                </Grid2>
                <Grid2 md={3}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue operation={operation} valueOperation={operation.valeur} showSign={true}/>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};
OperationItem.propTypes = {
    operation: PropTypes.object.isRequired,
    listeComptes: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired
}
export default OperationItem
