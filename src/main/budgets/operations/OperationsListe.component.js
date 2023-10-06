import React from 'react'
import {Container, Divider, Stack} from "@mui/material";
import OperationItem from "./OperationsListItem.component";
import {getLabelDate} from "../../Utils/DataUtils.utils";


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param listeComptes liste des comptes
 * @param onClick action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const OperationsListe = ({operationGroupedByDate, listeComptes, onClick}) => {

    /**
     * Iterate groupe
     * @param operationGroupedByDate
     * @returns {JSX.Element}
     */
    function iterate(operationGroupedByDate) {

        let renderList = []
        for (let dateOperationKey in operationGroupedByDate) {
            if (dateOperationKey !== null && dateOperationKey !== "null") {
                renderList.push(<Container key={"liste_" + dateOperationKey}
                    sx={{backgroundColor: '#e1e5f1 !important', padding: '10px', color: '#7991b3'}}>
                    <center>{getLabelDate(dateOperationKey)}</center>
                </Container>)
            }
            operationGroupedByDate[dateOperationKey]
                .map((operation) => renderList.push(
                    <OperationItem operation={operation} listeComptes={listeComptes}
                                   onClick={() => onClick(operation)}/>)
                )
        }
        return renderList;
    }


    return <Stack divider={<Divider orientation="horizontal"/>}
                  sx={{overflowY: "auto", overflowX: "hidden", height: window.innerHeight - 175}}>
        {
            iterate(operationGroupedByDate)
        }
    </Stack>
};

export default OperationsListe
