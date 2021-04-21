/*
 * Affichage d'une valeur dans le résumé
 */


const ResumeValue = ({ valueResume }) => {

     // définition de la date courante
     return (
                valueResume === 0 ?
                    <span>{valueResume.toFixed(2)} €</span>
                :
                   valueResume > 0 ?
                        <span className="text-success">{valueResume.toFixed(2)} €</span> :
                        <span className="text-danger">{valueResume.toFixed(2)} €</span>
      )
     };

  export default ResumeValue
