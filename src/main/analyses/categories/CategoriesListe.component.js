import React from 'react'
import {Box, Divider, Stack} from "@mui/material";
import CategoriesItem from "./CategoriesListItem.component";


/**
 * Tuile d'une liste de catégories
 * @param rangSelectedCategorie : rang de la catégorie
 * @param analysesGroupedByCategories opérations groupées par catégories
 * @param selection d'une catégorie
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const CategoriesListe = ({rangSelectedCategorie, analysesGroupedByCategories, onClick}) => {
    /**
     * Iterate groupe
     * @param analysesGroupedByCategories liste des opérations par catégories
     * @returns {JSX.Element}
     */
    function iterate(analysesGroupedByCategories) {

        let renderList = []
        for (let categorieId in analysesGroupedByCategories) {
            const r = renderList.length
            renderList.push(
                <CategoriesItem key={categorieId}
                                resumeCategorie={analysesGroupedByCategories[categorieId]}
                                onClick={() => onClick(r, analysesGroupedByCategories[categorieId])}/>
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
                iterate(analysesGroupedByCategories)
            }
            <></>
        </Stack>
    </Box>
};

export default CategoriesListe
