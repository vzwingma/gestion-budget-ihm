import ResumeValue from './../ResumeValue.component'
/*
 * Page principale du solde pour 1 catégorie
 */
const ResumeCategorie = ({ keyCategorie, idCategorie, totalCategorie }) => {

     return (
        <tr key={keyCategorie} id={idCategorie} className={`${!totalCategorie.isSsCategorie ? "ligneCategorie" : ""}`}>
            <td><span className={`${totalCategorie.isSsCategorie ? "ligneSsCategorie" : ""}`}>{totalCategorie.libelleCategorie}</span></td>
            <td><ResumeValue valueResume={totalCategorie.totalAtMaintenant}/></td>
            <td><ResumeValue valueResume={totalCategorie.totalAtFinMoisCourant}/></td>
        </tr>
      )
     };

  export default ResumeCategorie
