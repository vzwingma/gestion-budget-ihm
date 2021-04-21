import Table from 'react-bootstrap/Table';
import ResumeCategorie from './ResumeCategorie.component'
/*
 * Page principale du solde par catégories
 */
const ResumeCategories = ({ currentBudget, categories }) => {

     // définition de la date courante
    const dateCourante = new Date(Date.now()) ;
    const mapTotauxCategories = Object.entries(currentBudget.totauxParCategories);
    const mapTotauxSsCategories = Object.entries(currentBudget.totauxParSSCategories);
    const mapArbreTotaux = [];


    // Construction de l'arborescence des catégories
    const buildResumeCategories = (mapTotauxCategories) => {
        mapTotauxCategories
            .map((totalCat) => (
                buildResumeSousCategories(totalCat[0], totalCat)
            ))
    }

    // Construction de l'arborescence des sous-catégories de idCategorie
     const buildResumeSousCategories = (idCategorie, totalCat)=>{
        totalCat.isSsCategorie = false;
        mapArbreTotaux.push(totalCat);
        // Itération des catégories
        categories
            .filter(catParam => catParam.id === idCategorie)
            .flatMap(catParam => catParam.listeSSCategories)
            .map(ssCatParam => (
                mapTotauxSsCategories
                    .filter(totalSScat => totalSScat[0] === ssCatParam.id)
                    .map(totalSScat => (
                        buildResumeCategorie(totalSScat[0], totalSScat)
                    ))
            ));
    }

    // Construction de l'arborescence d'une sous-catégorie
    const buildResumeCategorie = (idSSCategorie, totalSScat) => {
        totalSScat[1].isSsCategorie = true;
        mapArbreTotaux.push(totalSScat);
    }

    // Build des résumés
    buildResumeCategories(mapTotauxCategories);

    /**
     *  RENDER
     **/
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
          <tbody className="tbodyResume">
              {
                    // Itération sur les catégories
                   mapArbreTotaux.map((totalCategorie, key) => (
                        <ResumeCategorie keyCategorie={key} idCategorie={totalCategorie[0]} totalCategorie={totalCategorie[1]}/>
                    ))
               }
          </tbody>
         </Table>
      )
     };

  export default ResumeCategories
