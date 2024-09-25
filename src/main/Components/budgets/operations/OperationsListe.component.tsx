import React from 'react'
import {Container, Divider, Stack} from "@mui/material";
import CompteBancaireModel from '@/src/main/Models/CompteBancaire.model';
import OperationModel from '@/src/main/Models/Operation.model';
import CenterComponent from '../../CenterComponent';
import { getLabelDate } from '@/src/main/Utils/DataUtils.utils';
import OperationItem from './OperationsListItem.component';

interface OperationsListeProps {
    operationGroupedByDate: {[key: string]: OperationModel[]}
    filterOperations: string | null
    listeComptes: CompteBancaireModel[]
    onClick: (operation : OperationModel) => void
}


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @param onClick action lors du click
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
  */
const OperationsListe: React.FC<OperationsListeProps> = ({operationGroupedByDate, filterOperations, listeComptes, onClick : handleOperationSelect} : OperationsListeProps) : JSX.Element => {


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
                        <CenterComponent><>{getLabelDate(dateOperationKey)}</></CenterComponent>
                    </Container>)
            }

            operationsFilteredForDate
                .forEach((operation) => renderList.push(
                    < OperationItem key={operation.id}
                                    operation={operation}
                                    listeComptes={listeComptes}
                                    onClick={handleOperationSelect}/>)
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