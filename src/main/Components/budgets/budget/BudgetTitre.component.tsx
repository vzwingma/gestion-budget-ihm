import OperationValue from '../../../Utils/renderers/OperationValue.renderer'
import {Box, Divider, Stack, Tooltip, Typography} from "@mui/material";
import React, { useContext } from "react";
import {EventOutlined} from "@mui/icons-material";
import { BudgetContext } from '../../../Models/contextProvider/BudgetContextProvider';

/**
 * Page principale d'affichage du solde
 * @param currentCompte compte courant
 * @param currentDate date courante
 * @param currentBudget budget courant
 * @returns {JSX.Element} element JSX
 * @constructor
 */
const BudgetsTitre : React.FC = (): JSX.Element => {

    const {currentBudget, selectedCompte, selectedDate} = useContext(BudgetContext)!;
    const budget = currentBudget!;
    const currentCompte = selectedCompte!;
    const currentDate = selectedDate!;

    // définition de la date courante
    const dateCourante = new Date(Date.now());

    function getTooltipAuj() {
        return "Au " + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    function getTooltipFin() {
        return "Fin " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear();
    }

    
    return (
        <Stack direction={"row"} spacing={1} justifyContent="left" alignItems="center" marginTop={"3pt"}>
            <img src={"/img/banques/" + currentCompte.itemIcon} width={50} height={50} alt={currentCompte.libelle}/>
            <Stack direction={"column"}>
                <Typography variant={"h6"} component="div" width={300} textAlign={"center"}>
                    {currentCompte.libelle}
                </Typography>
                <Typography variant={"caption"} sx={{color: "#808080"}} component="div" width={300}
                            textAlign={"center"}>
                    {currentDate.toLocaleString('default', {month: 'long'}) + " " + currentDate.getFullYear()}
                </Typography>
            </Stack>
            <Divider orientation="vertical" flexItem/>
            <Tooltip title={getTooltipAuj()}>
                <Typography variant={"h6"} width={120} textAlign={"center"} sx={{cursor: "help"}}>
                    <OperationValue valueOperation={budget.soldes.soldeAtMaintenant} showSign={true} id={'soldeAtMaintenant'}/>
                </Typography>
            </Tooltip>
            {
                (budget.actif) ?
                    <Tooltip title={getTooltipFin()}>
                        <Box sx={{cursor: "help", height: "40px", width: "100px"}}>
                            <EventOutlined sx={{paddingTop: "8px", color: "#808080"}}/>
                            <Typography variant={"caption"} textAlign={"center"}>
                                <OperationValue valueOperation={budget.soldes.soldeAtFinMoisCourant}
                                showSign={true} id={'soldeAtFinMoisCourant'}/>
                            </Typography>
                        </Box>
                    </Tooltip>
                    : <></>
            }

            <Divider orientation="vertical" flexItem/>
        </Stack>
    )
};

export default BudgetsTitre
