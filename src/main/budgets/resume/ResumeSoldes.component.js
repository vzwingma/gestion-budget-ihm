import Table from 'react-bootstrap/Table';
import OperationValue from '../operations/OperationSpanValue.component'
/*
 * Page principale du solde
 */


const ResumeSoldes = ({ currentBudget }) => {

    // définition de la date courante
    const dateCourante = new Date(Date.now()) ;

    return (
        <Table striped bordered hover size="sm" variant="light">
            <thead className="theadResume">
                <th/>
                <th>
                    Au { dateCourante.getDate() } { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() }
                </th>
                <th>
                    Fin { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() }
                </th>
            </thead>
            <tbody className="tbodyResume">
                <tr className="ligneCategorie">
                    <td> Solde </td>
                    <td><OperationValue valueOperation={currentBudget.soldes.soldeAtMaintenant} /> </td>
                    <td><OperationValue valueOperation={currentBudget.soldes.soldeAtFinMoisCourant} /> </td>
                </tr>
            </tbody>
        </Table>
    )
};

export default ResumeSoldes