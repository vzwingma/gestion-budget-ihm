import React from 'react'
import {Divider, Stack} from "@mui/material";
import CategoriesItem from "./CategoriesListItem.component";


/**
 * Tuile d'une liste de catégories
 * @param operationsGroupedByCategories opérations groupées par catégories
 * @param selection d'une catégorie
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const CategoriesListe = ({operationsGroupedByCategories, onClick}) => {
    /**
     * Iterate groupe
     * @param operationsGroupedByCategories liste des opérations par catégories
     * @returns {JSX.Element}
     */
    function iterate(operationsGroupedByCategories) {

        let renderList = []
        for (let categorieId in operationsGroupedByCategories) {

            renderList.push(
                <CategoriesItem resumeCategorie={operationsGroupedByCategories[categorieId]}
                                onClick={() => onClick(operationsGroupedByCategories[categorieId])}/>
            );
        }
        return renderList;
    }


    return <Stack divider={<Divider orientation="horizontal"/>}
                  sx={{overflowY: "auto", overflowX: "hidden", height: window.innerHeight - 175}}>
        {
            iterate(operationsGroupedByCategories)
        }
    </Stack>
};

export default CategoriesListe
