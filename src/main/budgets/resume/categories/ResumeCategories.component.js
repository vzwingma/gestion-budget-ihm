import Table from 'react-bootstrap/Table';
import ResumeValue from './ResumeValue.component'
/*
 * Page principale du solde par catégories
 */
const ResumeCategories = ({ currentBudget, categories }) => {

     // définition de la date courante
    const dateCourante = new Date(Date.now()) ;
    const mapTotauxCategories = Object.entries(currentBudget.totauxParCategories);
    const mapTotauxSSCategories = Object.entries(currentBudget.totauxParSSCategories);

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
                    // Itération sur les catégories
                    mapTotauxCategories.map((totalCategorie, key) => (
                        <tr key={key} id={totalCategorie[0]}>
                            <td>{totalCategorie[1].libelleCategorie}</td>
                            <td><ResumeValue valueResume={totalCategorie[1].totalAtMaintenant}/></td>
                            <td><ResumeValue valueResume={totalCategorie[1].totalAtFinMoisCourant}/></td>
                        </tr>

                        mapTotauxSSCategories.map((totalSSCategorie, key) => (
                                                <tr key={key} id={totalSSCategorie[0]}>
                                                    <td>{totalSSCategorie[1].libelleCategorie}</td>
                                                    <td><ResumeValue valueResume={totalSSCategorie[1].totalAtMaintenant}/></td>
                                                    <td><ResumeValue valueResume={totalSSCategorie[1].totalAtFinMoisCourant}/></td>
                                                </tr>


                    ))
               }
          </tbody>
         </Table>
      )
     };

  export default ResumeCategories
