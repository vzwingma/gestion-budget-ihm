import React, {JSX} from 'react'
import {Container, Divider, Stack, useMediaQuery, useTheme} from "@mui/material";
import CenterComponent from '../../CenterComponent';
import OperationItem from './OperationsListItem.component';
import OperationModel from '../../../Models/budgets/Operation.model';
import {OperationsListeProps} from '../../Components.props';


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
const OperationsListe: React.FC<OperationsListeProps> = ({operationGroupedByDate, filterOperations, onClick : handleOperationSelect} : OperationsListeProps) : JSX.Element => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const listHeight = isMobile ? window.innerHeight - 115 : window.innerHeight - 175;
    /**
     * Iterate groupe
     * @param operationGroupedByDate
     * @returns {JSX.Element}
     */
    function iterate(operationGroupedByDate : {[key: string]: OperationModel[]}): JSX.Element[] {

        let renderList = [] as JSX.Element[];
        for (let dateOperationKey in operationGroupedByDate) {

            const operationsFilteredForDate = operationGroupedByDate[dateOperationKey]
                .filter((operation : OperationModel) => filterOperations === null
                    || filterOperations === ""
                    || operation.libelle.toLowerCase().includes(filterOperations.toLowerCase())
                    || operation.categorie.libelle.toLowerCase().includes(filterOperations.toLowerCase())
                    || operation.ssCategorie.libelle.toLowerCase().includes(filterOperations.toLowerCase()));

            if (dateOperationKey !== null && dateOperationKey !== "null" && operationsFilteredForDate.length > 0) {
                renderList.push(
                    <Container key={"liste_" + dateOperationKey}
                               className={"listeItemSeparator"}>
                        <CenterComponent><>{dateOperationKey}</></CenterComponent>
                    </Container>)
            }

            operationsFilteredForDate
                .forEach((operation) => renderList.push(
                    <OperationItem key={operation.id}
                                    operation={operation}
                                    onClick={handleOperationSelect}/>)
                )
        }
        return renderList;
    }


    return <Stack divider={<Divider orientation="horizontal"/>}
                  sx={{overflowY: "auto", overflowX: "hidden", height: listHeight}}>
        {  iterate(operationGroupedByDate) }
    </Stack>
};

export default OperationsListe
