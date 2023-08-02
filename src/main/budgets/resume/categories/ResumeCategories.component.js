import ResumeCategorie from './ResumeCategorie.component'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
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
    const buildResumeCategories = (mapTotauxParCategories) => {
        mapTotauxParCategories
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
            .filter(catParam => catParam != null && catParam.id === idCategorie)
            .flatMap(catParam => catParam.listeSSCategories)
            .map(ssCatParam => (
                mapTotauxSsCategories
                    .filter(totalSScat => totalSScat[0] === ssCatParam.id)
                    .map(totalSScat => buildResumeSousCategorie(totalSScat))
            ));
    }

    // Construction de l'arborescence d'une sous-catégorie
    const buildResumeSousCategorie = (totalSScat) => {
        totalSScat[1].isSsCategorie = true;
        mapArbreTotaux.push(totalSScat);
    }

    // Build des résumés
    buildResumeCategories(mapTotauxCategories);

    /**
     *  RENDER
     **/
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
                <TableBody className="tbodyResume">
                  {
                        // Itération sur les catégories
                       mapArbreTotaux.map((totalCategorie) => (
                            <ResumeCategorie key={totalCategorie[0]} idCategorie={totalCategorie[0]} totalCategorie={totalCategorie[1]}/>
                        ))
                   }
                </TableBody>
             </Table>
         </TableContainer>
      )
     };

  export default ResumeCategories
