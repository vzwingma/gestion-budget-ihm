import OperationValue from '../operations/renderers/OperationSpanValue.component'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
/*
 * Page principale du solde
 */


const ResumeSoldes = ({ currentBudget }) => {

    // définition de la date courante
    const dateCourante = new Date(Date.now()) ;

    return (
        <TableContainer>
            <Table>
            <TableHead className={"theadResume"}>
                <TableRow>
                    <TableCell/>
                    <TableCell>Au { dateCourante.getDate() } { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() }</TableCell>
                    <TableCell>Fin { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() }</TableCell>
                </TableRow>
            </TableHead>
            <TableBody className={"tbodyResume"}>
                <TableRow className={"ligneCategorie"}>
                    <TableCell>Solde</TableCell>
                    <TableCell><OperationValue valueOperation={currentBudget.soldes.soldeAtMaintenant} /></TableCell>
                    <TableCell><OperationValue valueOperation={currentBudget.soldes.soldeAtFinMoisCourant} /></TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </TableContainer>
    )
};

export default ResumeSoldes