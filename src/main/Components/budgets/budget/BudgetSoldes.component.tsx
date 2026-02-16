import OperationValue from '../../../Utils/renderers/OperationValue.renderer.tsx'
import {Stack, Tooltip, Typography, useMediaQuery, useTheme, Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React, {JSX, useContext} from "react";
import {BudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import { getTypeCategorieRenderer } from '../../../Utils/renderers/OperationItem.renderer.tsx';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Page principale d'affichage du solde
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const BudgetSoldes: React.FC = (): JSX.Element => {

    const {currentBudget} = useContext(BudgetContext);
    const budget = currentBudget;
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    // définition de la date courante
    const dateCourante = new Date(Date.now());

    function getTooltipSoldes() {
        if (!budget) return "";
        return (
            <Box sx={{ p: 0 }}>
                <Table size="medium" sx={{ minWidth: 500 }} style={{ backgroundColor: '#424242' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}> </TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Au {dateCourante.getDate()} {dateCourante.toLocaleString('default', {month: 'long'})} {dateCourante.getFullYear()}</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Fin du mois</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(budget.totauxParTypeCategories)
                        .map((total) => (
                            <TableRow key={total.libelleCategorie}>
                                <TableCell sx={{ color: getTypeCategorieRenderer(total.libelleCategorie as TYPES_CATEGORIES_OPERATION_ENUM).color , fontSize: '1.1em' }}>
                                    {getTypeCategorieRenderer(total.libelleCategorie as TYPES_CATEGORIES_OPERATION_ENUM).text}
                                </TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontSize: '1.1em' }}>
                                    <OperationValue valueOperation={total.totalAtMaintenant} showSign={true} id={`total-now-${total.libelleCategorie}`}/>
                                </TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontSize: '1.1em' }}>
                                    <OperationValue valueOperation={total.totalAtFinMoisCourant} showSign={true} id={`total-end-${total.libelleCategorie}`}/>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Soldes</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                                <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true} id={'tooltip-solde-now'}/>
                            </TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1em' }}>
                                <OperationValue valueOperation={budget.soldes.soldeAtFinMoisCourant} showSign={true} id={'tooltip-solde-end'}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        );
    }

    return (
        <Stack direction={"column"} justifyContent="left" alignContent={"center"} alignItems="center">
            <Tooltip title={getTooltipSoldes()} followCursor={true} slotProps={{ tooltip: { sx: { backgroundColor: 'transparent', boxShadow: 'none' } } }}>
                {budget ?
                    <Typography variant={"h6"} width={isMobile ? 100 : 240} textAlign={"right"} sx={{cursor: "help"}}>
                        <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true}
                                        id={'soldeAtMaintenant'}/>
                    </Typography> : <></>}
            </Tooltip>
            <Tooltip title={getTooltipSoldes()} followCursor={true} slotProps={{ tooltip: { sx: { backgroundColor: 'transparent', boxShadow: 'none' } } }}>
            {(budget?.actif) ?
                    <Typography variant={"caption"} width={isMobile ? 100 : 240} textAlign={"right"}
                                sx={{cursor: "help"}}>
                        <span style={{color: "#808080"}}>(</span> <OperationValue
                        valueOperation={budget.soldes.soldeAtFinMoisCourant} showSign={true}
                        id={'soldeAtFinMoisCourant'}/> <span style={{color: "#808080"}}>)</span>
                    </Typography>

                : <></>
            }
            </Tooltip>
        </Stack>
    )
};

export default BudgetSoldes
