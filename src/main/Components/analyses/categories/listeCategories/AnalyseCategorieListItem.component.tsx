import React from 'react'
import { Box, Grid2, Stack, Typography } from "@mui/material";
import OperationValue from "../../../../Utils/renderers/OperationValue.renderer";
import { getCategorieIcon } from "../../../../Utils/renderers/CategorieItem.renderer";



interface AnalyseCategorieListItemProps {
    resumeCategorie: any,
    typeAnalyse: string,
    selectCategorie: any
}

/**
 * Tuile d'un résumé de catégories
 * @param resumeCategorie : object résumé de catégories
 * @param typeAnalyse : string type d'analyse
 * @param selectCategorie : function selection d'un résumé de catégories
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const AnalyseCategorieListItem: React.FC<AnalyseCategorieListItemProps> = ({ resumeCategorie, typeAnalyse, selectCategorie }: AnalyseCategorieListItemProps) => {

    return (
        <Box key={"liste_" + resumeCategorie.categorie.id}
            className={"listeItem"} onMouseOver={() => selectCategorie()}>
            <Grid2 container spacing={6}>
                <Grid2 size={{ md: 1 }}>
                    <Box width={40} height={40}
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: resumeCategorie.couleurCategorie,
                            padding: '6px',
                            color: '#FFFFFF'
                        }}>
                        <center>{getCategorieIcon(resumeCategorie.categorie)}</center>
                    </Box>
                </Grid2>
                <Grid2 size={{ md: 7 }}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"} sx={{ spacing: 2 }}>
                            {resumeCategorie.categorie.libelle}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                            sx={{ spacing: 2, color: "#808080" }}>
                            {resumeCategorie.pourcentage[typeAnalyse]} %
                            - {resumeCategorie.nbTransactions[typeAnalyse]} transactions
                        </Typography>
                    </Stack>

                </Grid2>
                <Grid2 size={{ md: 3 }}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{ spacing: 2 }}>
                        <OperationValue id={"value_" + resumeCategorie.categorie.id} valueOperation={resumeCategorie.total[typeAnalyse]} showSign={true} />
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>

    )
};
export default AnalyseCategorieListItem
