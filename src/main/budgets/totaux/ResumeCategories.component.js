import Table from 'react-bootstrap/Table';
import ResumeValue from './ResumeValue.component'
/*
 * Page principale du solde par catégories
 */
const ResumeCategories = ({ currentBudget }) => {

     // définition de la date courante
    const dateCourante = new Date(Date.now()) ;
    const mapTotauxCategories = Object.entries(currentBudget.totauxParCategories);


     return (
        <Table striped bordered hover size="sm" variant="light">
          <thead>
           <tr>
            <th/>
            <th>
                Au { dateCourante.getDate() } { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() }
            </th>
            <th>
                Fin { dateCourante.toLocaleString('default', { month: 'long' }) } { dateCourante.getFullYear() }
            </th>
          </tr>
          </thead>
          <tbody>
              {
                    mapTotauxCategories.map((totalCategorie, key) => (
                        <tr key={key} id={totalCategorie[0]}>
                            <td>{totalCategorie[1].libelleCategorie}</td>
                            <td><ResumeValue valueResume={totalCategorie[1].totalAtMaintenant}/></td>
                            <td><ResumeValue valueResume={totalCategorie[1].totalAtFinMoisCourant}/></td>
                        </tr>
                    ))
               }
          </tbody>
         </Table>
      )
     };

  export default ResumeCategories
