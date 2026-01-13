import React, {JSX, useContext} from 'react'
import {Box, Grid, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import OperationValue from "../../../Utils/renderers/OperationValue.renderer.tsx";
import { CenterComponent } from '../../CenterComponent.tsx';
import {getCategorieColor, getCategorieIcon} from '../../../Utils/renderers/CategorieItem.renderer.tsx';
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import {getOperationLibelle} from '../../../Utils/renderers/OperationItem.renderer.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';

/**
 * Props for the shared operation item component
 */
interface SharedOperationItemProps {
    operation: OperationModel;
    onClick: (operation: OperationModel) => void;
    getBorderColor: (operation: OperationModel) => string;
    getOperationsColor?: string;
    getSelectedOperationColor?: string;
    isSelected?: boolean;
}

/**
 * Shared operation item component
 * Renders a single operation in the list with customizable border color
 * @param operation operation to display
 * @param onClick callback for operation selection
 * @param getBorderColor function to determine the outer border color
 * @returns JSX.Element
 */
const SharedOperationItem: React.FC<SharedOperationItemProps> = ({
    operation,
    onClick: handleOperationSelect,
    getBorderColor,
    getOperationsColor,
    getSelectedOperationColor,
    isSelected
}: SharedOperationItemProps): JSX.Element => {

    const { comptes } = useContext(BudgetContext);
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));

    return (
        <Box key={"liste_" + operation.id}
             onClick={() => handleOperationSelect(operation)}
             sx={{
                 cursor: 'pointer',
                 borderLeft: isSelected ? '4px solid ' + getSelectedOperationColor : 'none',
                 paddingLeft: isSelected ? '6px' : '10px',
                 '&:hover': {
                     backgroundColor: getOperationsColor || '#1F3D2B'
                 }
             }}>
            <Grid container spacing={6} height={isMobile ? 60 : 90} alignItems="center">
                <Grid size={{md: 0.5, xl: 1}} sx={{paddingLeft: '10px'}}>
                    <Box width={isMobile ? 38 : 50} height={isMobile ? 38 : 50}
                         sx={{
                             borderRadius: '50%',
                             border: (isMobile ? '2px' : '3px') + ' solid ' + getBorderColor(operation),
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
    );
};

export default SharedOperationItem;
