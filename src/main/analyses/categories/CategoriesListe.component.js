import React from 'react'
import {Box, Divider, Stack} from "@mui/material";
import CategoriesItem from "./CategoriesListItem.component";


/**
 * Tuile d'une liste de catégories
 * @param rangSelectedCategorie : rang de la catégorie
 * @param operationsGroupedByCategories opérations groupées par catégories
 * @param selection d'une catégorie
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const CategoriesListe = ({rangSelectedCategorie, operationsGroupedByCategories, onClick}) => {
    /**
     * Iterate groupe
     * @param operationsGroupedByCategories liste des opérations par catégories
     * @returns {JSX.Element}
     */
    function iterate(operationsGroupedByCategories) {

        let renderList = []
        for (let categorieId in operationsGroupedByCategories) {
            const r = renderList.length
            renderList.push(
                <CategoriesItem key={categorieId}
                                resumeCategorie={operationsGroupedByCategories[categorieId]}
                                onClick={() => onClick(r, operationsGroupedByCategories[categorieId])}/>
            );
        }
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
                iterate(operationsGroupedByCategories)
            }
            <></>
        </Stack>
    </Box>
};

export default CategoriesListe
