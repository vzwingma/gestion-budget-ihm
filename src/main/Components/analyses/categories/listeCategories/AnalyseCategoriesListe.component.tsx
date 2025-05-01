import React, {JSX} from 'react'
import {Box, Divider, Stack} from "@mui/material";
import AnalyseCategorieListItem from "./AnalyseCategorieListItem.component";
import {sortLibellesCategories} from '../../../../Utils/OperationData.utils';
import AnalyseCategoriesModel from '../../../../Models/analyses/categories/AnalyseCategories.model';
import {AnalyseCategoriesListeProps} from '../../../Components.props';


/**
 * Tuile d'une liste de catégories
 * @param rangSelectedCategorie : int rang de la catégorie
 * @param analysesGroupedByCategories : Object opérations groupées par catégories
 * @param typeAnalyse : enum par défaut "REALISEE_DEPENSE"
 * @param selectCategorie : function selection d'une catégorie
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
/**
 * Composant AnalyseCategoriesListe
 *
 * Ce composant affiche une liste de catégories avec leurs analyses respectives.
 *
 * @param {AnalyseCategoriesListeProps} props - Les propriétés du composant.
 * @param {number | null} props.rangSelectedCategorie - Le rang de la catégorie sélectionnée.
 * @param {{ [key: string]: AnalyseCategoriesModel } | null} props.analysesGroupedByCategories - Les analyses groupées par catégories.
 * @param {string} props.typeAnalyse - Le type d'analyse.
 * @param {(analysesOfCategorie: AnalyseCategoriesModel, rank: number) => void} props.selectCategorie - La fonction pour sélectionner une catégorie.
 *
 * @returns {JSX.Element} Le composant rendu.
 */
const AnalyseCategoriesListe: React.FC<AnalyseCategoriesListeProps> = ({   rangSelectedCategorie,
                                                                           analysesGroupedByCategories,
                                                                           typeAnalyse,
                                                                           selectCategorie
                                                                       }: AnalyseCategoriesListeProps): JSX.Element => {
    /**
     * Iterate groupe
     * @param analysesGroupedByCategories liste des opérations par catégories
     * @returns {JSX.Element}
     */
    /**
     * Itère sur les analyses groupées par catégories et génère une liste d'éléments JSX.
     *
     * @param analysesGroupedByCategories - Un objet contenant les analyses groupées par catégories, où la clé est l'identifiant de la catégorie et la valeur est un modèle d'analyse de catégorie.
     * @returns Un tableau d'éléments JSX représentant les éléments de la liste des analyses par catégorie.
     */
    function iterate(analysesGroupedByCategories :  { [key: string]: AnalyseCategoriesModel } | null) : JSX.Element[] {

        const arrayAnalysesGroupedByCategories : AnalyseCategoriesModel[] = []
        for (let categorieId in analysesGroupedByCategories) {
            arrayAnalysesGroupedByCategories.push(analysesGroupedByCategories[categorieId])
        }

        let renderList : JSX.Element[]= []
        arrayAnalysesGroupedByCategories
            .filter(analysesOfCategorie => analysesOfCategorie.nbTransactions[typeAnalyse] > 0)
            .sort((resume1, resume2) => sortLibellesCategories(resume1.categorie, resume2.categorie))
            .forEach(analysesOfCategorie => {
                const r = renderList.length
                renderList.push(
                    <AnalyseCategorieListItem key={analysesOfCategorie.categorie.id}
                                              resumeCategorie={analysesOfCategorie}
                                              typeAnalyse={typeAnalyse}
                                              selectCategorie={() => selectCategorie(analysesOfCategorie, r)}/>
                );
            });
        return renderList;
    }


    return <Box sx={{height: window.innerHeight - 175, overflow: "hidden"}}>
        {
            (rangSelectedCategorie !== null) ? <Box width={25} height={rangSelectedCategorie * 79}></Box> : <></>
        }
        <Stack divider={<Divider orientation="horizontal"/>}
               sx={{overflowY: "auto", overflowX: "hidden", height: window.innerHeight - 175}}>
            { iterate(analysesGroupedByCategories) }
        </Stack>
    </Box>
};
export default AnalyseCategoriesListe
