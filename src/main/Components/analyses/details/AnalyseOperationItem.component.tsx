import React, { JSX, useContext } from 'react'
import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BudgetContext } from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { getCategorieColor, getCategorieIcon } from '../../../Utils/renderers/CategorieItem.renderer.tsx';
import { CenterComponent } from '../../shared/CenterComponent.tsx';
import { getOperationLibelle } from '../../../Utils/renderers/OperationItem.renderer.tsx';
import OperationStatus from '../../../Utils/renderers/OperationStatus.renderer.tsx';
import OperationValue from '../../../Utils/renderers/OperationValue.renderer.tsx';
/**
 * Props for the shared operation item component
 */
interface SharedOperationItemProps {
    operation: OperationModel;
}

/**
 * Shared operation item component
 * Renders a single operation in the list with customizable border color
 * @param operation operation to display
 * @param onClick callback for operation selection
 * @param getBorderColor function to determine the outer border color
 * @returns JSX.Element
 */
const AnalyseOperationItem: React.FC<SharedOperationItemProps> = ({
    operation
}: SharedOperationItemProps): JSX.Element => {

    const { comptes } = useContext(BudgetContext);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    return (
        <Box key={"liste_" + operation.id}>
            <Grid container height={isMobile ? 40 : 60} alignItems="center">
                <Grid size={{ md: 1.5, xl: 1.5 }} sx={{ paddingLeft: isMobile ? '4px' : '10px' }}>
                    <Box width={isMobile ? 38 : 50} height={isMobile ? 38 : 50}>
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
                <Grid size={{ md: 6.5, xl: 6.5 }}>
                    <Stack direction={"column"}>
                        <Typography variant={"subtitle1"} component="div" align={"left"}
                            sx={{ spacing: 2, paddingLeft: isMobile ? 1 : 2 }}>
                            {getOperationLibelle(operation.libelle, comptes, false, isMobile)}
                        </Typography>
                        <Typography variant={"caption"} component="div" align={"left"}
                            sx={{ spacing: 2, paddingLeft: isMobile ? 1 : 2, color: "#808080" }}>
                            {operation.categorie.libelle} / {operation.ssCategorie.libelle}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{ md: 1.5, xl: 1.5 }}>
                    <Typography component="div" align={"center"}>
                        <OperationStatus statutsOperation={operation.statuts} />
                    </Typography>
                </Grid>
                <Grid size={{ md: 2.5, xl: 2.5 }}>
                    <Typography variant={"subtitle1"} component="div" align={"right"} paddingRight={isMobile ? 1 : 2}>
                        <OperationValue id={operation.id} operation={operation} valueOperation={operation.valeur} showSign={true} />
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyseOperationItem;
