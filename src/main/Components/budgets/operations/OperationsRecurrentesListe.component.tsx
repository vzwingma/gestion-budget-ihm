import React, {JSX} from 'react'
import {Container, Divider, Stack, useMediaQuery, useTheme} from "@mui/material";
import { CenterComponent } from '../../CenterComponent.tsx';
import OperationItem from './OperationsListItem.component.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OperationsRecurrentesListeProps} from '../../Components.props.ts';
import OperationRecurrenteItem from './OperationsRecurrentesListItem.component.tsx';


/**
 * Tuile  d'une liste d'opérations récurrentes
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
const OperationsRecurrentesListe: React.FC<OperationsRecurrentesListeProps> = ({operationGroupedByPeriodicity, filterOperations, onClick : handleOperationSelect} : OperationsRecurrentesListeProps) : JSX.Element => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    const listHeight = isMobile ? window.innerHeight - 95 : window.innerHeight - 140;
    /**
     * Iterate groupe
     * @param operationGroupedByPeriodicity
     * @returns {JSX.Element}
     */
    function iterate(operationGroupedByPeriodicity : {[key: string]: OperationModel[]}): JSX.Element[] {

        let renderList = [] as JSX.Element[];
        for (let dateOperationKey in operationGroupedByPeriodicity) {

            const operationsFilteredForPeriodicity = operationGroupedByPeriodicity[dateOperationKey]
                .filter((operation : OperationModel) => filterOperations === null
                    || filterOperations === ""
                    || operation.libelle.toLowerCase().includes(filterOperations.toLowerCase())
                    || operation.categorie.libelle.toLowerCase().includes(filterOperations.toLowerCase())
                    || operation.ssCategorie.libelle.toLowerCase().includes(filterOperations.toLowerCase()));

            if (dateOperationKey !== null && dateOperationKey !== "null" && operationsFilteredForPeriodicity.length > 0) {
                renderList.push(
                    <Container key={"liste_" + dateOperationKey}
                               className={"listeItemSeparator"}>
                        <CenterComponent><>{dateOperationKey}</></CenterComponent>
                    </Container>)
            }

            operationsFilteredForPeriodicity
                .forEach((operation) => renderList.push(
                    <OperationRecurrenteItem key={operation.id}
                                    operation={operation}
                                    onClick={handleOperationSelect}/>)
                )
        }
        return renderList;
    }


    return <Stack divider={<Divider orientation="horizontal"/>}
                  sx={{overflowY: "auto", overflowX: "hidden", height: listHeight}}>
        {  iterate(operationGroupedByPeriodicity) }
    </Stack>
};

export default OperationsRecurrentesListe
