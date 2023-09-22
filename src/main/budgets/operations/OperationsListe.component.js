import React from 'react'
import {Divider, Stack} from "@mui/material";
import OperationItem from "./OperationsListItem.component";
import {getLabelDate} from "../../Utils/DataUtils.utils";


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param onClick action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const OperationsListe = ({operationGroupedByDate, onClick}) => {

    /**
     * Iterate groupe
     * @param operationGroupedByDate
     * @returns {JSX.Element}
     */
    function iterate(operationGroupedByDate) {

        let renderList = []
        for (var dateOperationKey in operationGroupedByDate) {
            if (dateOperationKey !== null && dateOperationKey !== "null") {
                renderList.push(<span>{getLabelDate(dateOperationKey)}</span>)
            }
            operationGroupedByDate[dateOperationKey]
                .map((operation) => renderList.push(
                    <OperationItem operation={operation} onClick={() => onClick(operation)}/>)
                )
        }
        return renderList;
    }


    return <Stack divider={<Divider orientation="horizontal" flexItem/>}
                  spacing={1}
                  sx={{overflowY: "auto", overflowX: "hidden"}} maxHeight={window.innerHeight - 195}>
        {
            iterate(operationGroupedByDate)
        }
    </Stack>
};

export default OperationsListe
