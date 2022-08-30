import OperationValue from '../../operations/OperationSpanValue.component'
/*
 * Page principale du solde pour 1 catégorie
 */
const ResumeCategorie = ({ keyCategorie, idCategorie, totalCategorie }) => {

    return (
        <tr key={keyCategorie} id={idCategorie} className={`${!totalCategorie.isSsCategorie ? "ligneCategorie" : ""}`}>
            <td><span className={`${totalCategorie.isSsCategorie ? "ligneSsCategorie" : ""}`}>{ totalCategorie.libelleCategorie }</span></td>
            <td><OperationValue valueOperation={totalCategorie.totalAtMaintenant}/></td>
            <td><OperationValue valueOperation={totalCategorie.totalAtFinMoisCourant}/></td>
        </tr>
    )
};

export default ResumeCategorie