import OperationValue from '../../../Utils/renderers/OperationValue.renderer.tsx'
import {Stack, Typography, useMediaQuery, useTheme, Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import React, {JSX} from "react";
import {useBudgetContext} from '../../../Models/contextProvider/BudgetContextProvider.tsx';
import { getTypeCategorieRenderer } from '../../../Utils/renderers/OperationItem.renderer.tsx';
import TapTooltip from '../../shared/TapTooltip.component.tsx';
import { TYPES_CATEGORIES_OPERATION_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';

/**
 * Page principale d'affichage du solde
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const BudgetSoldes: React.FC = (): JSX.Element => {

    const {currentBudget} = useBudgetContext();
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
                            <TableCell sx={{ textAlign: "right", color: 'white', fontWeight: 'bold' }}>Au {dateCourante.getDate()} {dateCourante.toLocaleString('default', {month: 'long'})} {dateCourante.getFullYear()}</TableCell>
                            <TableCell sx={{ textAlign: "right", color: 'white', fontWeight: 'bold' }}>Fin du mois</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(budget.totauxParTypeCategories)
                        .map((total) => (
                            <TableRow key={total.libelleCategorie}>
                                <TableCell sx={{ color: getTypeCategorieRenderer(total.libelleCategorie as TYPES_CATEGORIES_OPERATION_ENUM).color , fontSize: '1.1em' }}>
                                    {getTypeCategorieRenderer(total.libelleCategorie as TYPES_CATEGORIES_OPERATION_ENUM).text}
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", color: 'white', fontSize: '1.1em' }}>
                                    <OperationValue valueOperation={total.totalAtMaintenant} showSign={true} id={`total-now-${total.libelleCategorie}`}/>
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", color: 'white', fontSize: '1.1em' }}>
                                    <OperationValue valueOperation={total.totalAtFinMoisCourant} showSign={true} id={`total-end-${total.libelleCategorie}`}/>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Soldes</TableCell>
                            <TableCell sx={{ textAlign: "right", color: 'white', fontWeight: 'bold' }}>
                                <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true} id={'tooltip-solde-now'}/>
                            </TableCell>
                            <TableCell sx={{ textAlign: "right", color: 'white', fontWeight: 'bold', fontSize: '1.1em' }}>
                                <OperationValue valueOperation={budget.soldes.soldeAtFinMoisCourant} showSign={true} id={'tooltip-solde-end'}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        );
    }

    const labelSx = {color: "var(--color-operation-subtext, #a8a8a8)", whiteSpace: "nowrap", flexShrink: 0};
    const rowSx = {display: "flex", alignItems: "baseline", justifyContent: "space-between", columnGap: 1, width: "100%", minWidth: 0, whiteSpace: "nowrap"};

    // Un seul déclencheur pour les 2 soldes : survol (desktop) ou tap (tablette), cible tactile >= 44 px
    return (
        <TapTooltip title={getTooltipSoldes()} followCursor={true} slotProps={{ tooltip: { sx: { backgroundColor: 'transparent', boxShadow: 'none' } } }}>
            {budget ?
                <Stack direction={"column"} sx={{width: "100%", maxWidth: 240, minWidth: 0, minHeight: 44, justifyContent: "center", cursor: "help"}}>
                    <Box sx={rowSx}>
                        <Typography variant={"caption"} sx={labelSx}>Aujourd'hui</Typography>
                        <Typography variant={"h6"} component="span" sx={{textAlign: "right", fontSize: isMobile ? "1.05rem" : undefined}}>
                            <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true}
                                            id={'soldeAtMaintenant'}/>
                        </Typography>
                    </Box>
                    {budget.actif ?
                        <Box sx={rowSx}>
                            <Typography variant={"caption"} sx={labelSx}>Fin de mois</Typography>
                            <Typography variant={"caption"} component="span" sx={{textAlign: "right"}}>
                                <OperationValue valueOperation={budget.soldes.soldeAtFinMoisCourant} showSign={true}
                                                id={'soldeAtFinMoisCourant'}/>
                            </Typography>
                        </Box>
                        : <></>}
                </Stack> : <></>}
        </TapTooltip>
    )
};

export default BudgetSoldes
