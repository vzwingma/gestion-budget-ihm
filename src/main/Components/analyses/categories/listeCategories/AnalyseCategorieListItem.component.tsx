import React, {JSX} from 'react'
import {Box, Grid, Stack, styled, Tooltip, tooltipClasses, TooltipProps, Typography} from "@mui/material";
import OperationValue from "../../../../Utils/renderers/OperationValue.renderer";
import {getCategorieIcon} from "../../../../Utils/renderers/CategorieItem.renderer";
import CenterComponent from '../../../CenterComponent';
import {AnalyseCategorieListItemProps} from '../../../Components.props';


/**
 * Tuile d'un résumé de catégories
 * @param resumeCategorie : object résumé de catégories
 * @param typeAnalyse : string type d'analyse
 * @param selectCategorie : function selection d'un résumé de catégories
 * @param selectDetailCategorie : function selection d'un détail de catégorie
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const AnalyseCategorieListItem: React.FC<AnalyseCategorieListItemProps> = ({   resumeCategorie,
                                                                               typeAnalyse,
                                                                               selectCategorie
                                                                           }: AnalyseCategorieListItemProps): JSX.Element => {


    // Etat pour le tooltip
    const [openTooltip, setOpenTooltip] = React.useState(false);


    /**
     * Tooltip HTML du détail des opérations de la catégorie
     */
    const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}
                 onClose={() => setOpenTooltip(false)}
                 open={openTooltip}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#2f2f2f',
            color: '#ebebeb',
            maxWidth: 400,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #ebebeb',
        },
    }));

    let tooltipContent = <table>
        {resumeCategorie.listeOperations.map((operation, index) => {
            return <tr key={"operation_" + index}>
                <td width={"250px"}>{operation.libelle}</td>
                <td align={"right"}><OperationValue id={"valueDetail_" + operation.id} valueOperation={operation.valeur}
                                                    showSign={true}/></td>
            </tr>
        })
        }
    </table>


    return (
        <Box key={"liste_" + resumeCategorie.categorie.id}
             className={"listeItem"} onMouseOver={() => selectCategorie()} onClick={() => setOpenTooltip(true)}>
            <HtmlTooltip
                title={
                    <React.Fragment>
                        <Typography color="inherit">Détails des transactions</Typography>
                        {tooltipContent}
                    </React.Fragment>
                }>

            <Grid container spacing={6}>
                <Grid size={{ md: 1 }}>
                    <Box width={40} height={40}
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: resumeCategorie.couleurCategorie,
                            padding: '6px',
                            color: '#FFFFFF'
                        }}>
                        <CenterComponent>{getCategorieIcon(resumeCategorie.categorie)}</CenterComponent>
                    </Box>
                </Grid>
                <Grid size={{md: 7}}>
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

                </Grid>
                <Grid size={{md: 3}}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} sx={{ spacing: 2 }}>
                        <OperationValue id={"value_" + resumeCategorie.categorie.id} valueOperation={resumeCategorie.total[typeAnalyse]} showSign={true} />
                    </Typography>
                </Grid>
            </Grid>
            </HtmlTooltip>
        </Box>

    )
};
export default AnalyseCategorieListItem
