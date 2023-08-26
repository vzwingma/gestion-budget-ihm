import OperationValue from '../operations/renderers/OperationSpanValue.component'
import {Box, Tooltip} from "@mui/material";
/*
 * Page principale du solde
 */


const BudgetsSoldes = ({currentCompte, currentBudget}) => {

    // définition de la date courante
    const dateCourante = new Date(Date.now());

    function getTooltipAuj() {
        return "Au" + dateCourante.getDate() + " " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear()
    }

    function getTooltipFin() {
        return "Fin " + dateCourante.toLocaleString('default', {month: 'long'}) + " " + dateCourante.getFullYear(); // { dateCourante.getDate() } { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() } }
    }

    return (
        <>
            <Box>
                {currentCompte.icon} {currentCompte.text}
            </Box>
            <Tooltip title={getTooltipAuj()}>
                <Box>
                    <OperationValue valueOperation={currentBudget.soldes.soldeAtMaintenant} showSign={true}/>
                </Box></Tooltip>
            <Tooltip title={getTooltipFin()}>
                <Box>
                    <OperationValue valueOperation={currentBudget.soldes.soldeAtFinMoisCourant} showSign={true}/>
                </Box></Tooltip>
        </>

    )
};

export default BudgetsSoldes
