import React from 'react'
import {Box, Divider, Stack} from "@mui/material";
import CategoriesListItem from "./CategoriesListItem.component";
import PropTypes from "prop-types";
import {sortLibellesCategories} from "../../Utils/DataUtils.utils";


/**
 * Tuile d'une liste de catégories
 * @param rangSelectedCategorie : int rang de la catégorie
 * @param analysesGroupedByCategories : Object opérations groupées par catégories
 * @param typeAnalyse : Enum par défaut "REALISEE_DEPENSE"
 * @param selectCategorie : function selection d'une catégorie
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const CategoriesListe = ({rangSelectedCategorie, analysesGroupedByCategories, typeAnalyse, selectCategorie}) => {
    /**
     * Iterate groupe
     * @param analysesGroupedByCategories liste des opérations par catégories
     * @returns {JSX.Element}
     */
    function iterate(analysesGroupedByCategories) {

        const arrayAnalysesGroupedByCategories = []
        for (let categorieId in analysesGroupedByCategories) {
            arrayAnalysesGroupedByCategories.push(analysesGroupedByCategories[categorieId])
        }

        let renderList = []
        arrayAnalysesGroupedByCategories
            .filter(analysesOfCategorie => analysesOfCategorie.nbTransactions[typeAnalyse] > 0)
            .sort((resume1, resume2) => sortLibellesCategories(resume1.categorie, resume2.categorie))
            .forEach(analysesOfCategorie => {
                const r = renderList.length
                renderList.push(
                    <CategoriesListItem key={analysesOfCategorie.categorie.id}
                                        resumeCategorie={analysesOfCategorie}
                                        typeAnalyse={typeAnalyse}
                                        selectCategorie={() => selectCategorie(r, analysesOfCategorie)}/>
                );
            });
        return renderList;
    }


    return <Box sx={{height: window.innerHeight - 175, overflow: "hidden"}}>
        {
            (rangSelectedCategorie !== null) ? <Box width={25} height={rangSelectedCategorie * 73}></Box> : <></>
        }
        <Stack divider={<Divider orientation="horizontal"/>}
               sx={{overflowY: "auto", overflowX: "hidden", height: window.innerHeight - 175}}>
            <></>
            {
                iterate(analysesGroupedByCategories)
            }
            <></>
        </Stack>
    </Box>
};
// Properties Types
CategoriesListe.propTypes = {
    rangSelectedCategorie: PropTypes.number.isRequired,
    analysesGroupedByCategories: PropTypes.object.isRequired,
    typeAnalyse: PropTypes.string.isRequired,
    selectCategorie: PropTypes.func.isRequired
}
export default CategoriesListe
