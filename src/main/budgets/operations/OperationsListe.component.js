import React from 'react'
import {Container, Divider, Stack} from "@mui/material";
import OperationItem from "./OperationsListItem.component";
import {getLabelDate} from "../../Utils/DataUtils.utils";
import PropTypes from "prop-types";


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @param onClick action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 * <OperationItem operation={operation} onClick={this.handleOperationSelect}/>
 */
const OperationsListe = ({operationGroupedByDate, filterOperations, listeComptes, onClick}) => {


    /**
     * Iterate groupe
     * @param operationGroupedByDate
     * @returns {JSX.Element}
     */
    function iterate(operationGroupedByDate) {

        let renderList = []
        for (let dateOperationKey in operationGroupedByDate) {

            const operationsFilteredForDate = operationGroupedByDate[dateOperationKey]
                .filter((operation) => filterOperations === null
                    || filterOperations === ""
                    || operation.libelle.toLowerCase().includes(filterOperations.toLowerCase())
                    || operation.categorie.libelle.toLowerCase().includes(filterOperations.toLowerCase())
                    || operation.ssCategorie.libelle.toLowerCase().includes(filterOperations.toLowerCase()));

            if (dateOperationKey !== null && dateOperationKey !== "null" && operationsFilteredForDate.length > 0) {
                renderList.push(
                    <Container key={"liste_" + dateOperationKey}
                                           className={"listeItemSeparator"}>
                        <center>{getLabelDate(dateOperationKey)}</center>
                    </Container>)
            }

            operationsFilteredForDate
                .forEach((operation) => renderList.push(
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
OperationsListe.propTypes = {
    operationGroupedByDate: PropTypes.object.isRequired,
    filterOperations: PropTypes.string.isRequired,
    listeComptes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
}
export default OperationsListe
