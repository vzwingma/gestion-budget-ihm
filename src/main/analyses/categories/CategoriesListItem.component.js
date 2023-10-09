import React from 'react'
import {Box, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import OperationValue from "../../Utils/renderers/OperationValue.renderer";
import * as Renderer from "../../Utils/renderers/CategorieItem.renderer";

/**
 * Tuile d'un résumé de catégories
 * @param resumeCategorie résumé de catégories
 * @param typeAnalyse type d'analyse
 * @param selectCategorie selection d'un résumé de catégories
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const CategoriesItem = ({resumeCategorie, typeAnalyse, selectCategorie}) => {

    return (
        <Box key={"liste_" + resumeCategorie.categorie.id}
             sx={{
                 height: 56,
                 marginY: 1,
                 '&:hover': {
                     backgroundColor: '#f5f6fb',
                     color: '#808080',
                     cursor: 'pointer',
                 }
             }} onMouseOver={() => selectCategorie()}>
            <Grid2 container spacing={6}>
                <Grid2 md={1}>
                    <Box width={25} height={25}
                         sx={{
                             borderRadius: "50%",
                             backgroundColor: resumeCategorie.couleurCategorie,
                             padding: '6px',
                             color: '#FFFFFF'
                         }}>
                        <center>{Renderer.getCategorieIcon(resumeCategorie.categorie)}</center>
                    </Box>
                </Grid2>
                <Grid2 md={7}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{spacing: 2}}>
                            {resumeCategorie.categorie.libelle}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                                    sx={{spacing: 2, color: "#808080"}}>
                            {resumeCategorie.pourcentage[typeAnalyse]} %
                            - {resumeCategorie.nbTransactions[typeAnalyse]} transactions
                        </Typography>
                    </Stack>

                </Grid2>
                <Grid2 md={3}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{spacing: 2}}>
                        <OperationValue valueOperation={resumeCategorie.total[typeAnalyse]} showSign={true}/>
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};

export default CategoriesItem
