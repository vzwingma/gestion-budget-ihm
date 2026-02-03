import React, { JSX } from 'react'
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { AnalyseOperationsListeProps } from '../../Components.props.ts';
import { Stack } from '@mui/material';
import { getHeightList } from '../../../Utils/ListData.utils.tsx';
import AnalyseOperationItem from './AnalyseOperationItem.tsx';


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
const AnalyseOperationsListe: React.FC<AnalyseOperationsListeProps> = ({ operations }): JSX.Element => {

    const renderItem = (operation: OperationModel): JSX.Element => {
        return <AnalyseOperationItem key={operation.id} operation={operation} />
    };



    /**
     * Iterate through grouped operations and render them
     * @param operationsGrouped operations grouped by key (date or periodicity)
     * @param filterOperations search term
     * @param handleOperationSelect callback for operation selection
     * @param renderItem function to render individual operation items
     * @param getSeparatorStyle optional function to get separator styling
     * @returns array of JSX elements
     */
    function iterateOperations(operationsGrouped: OperationModel[], renderItem: (operation: OperationModel) => JSX.Element): JSX.Element[] {
        let renderList = [] as JSX.Element[];

        operationsGrouped.toSorted((ope1: OperationModel, ope2: OperationModel) => ope1.libelle.localeCompare(ope2.libelle))
        .forEach((operation) =>
            renderList.push(renderItem(operation))
        );

        return renderList;
    }


    return (
        <Stack sx={{ overflowY: "auto", overflowX: "hidden", height: getHeightList() }}>
            {iterateOperations(operations, renderItem)}
        </Stack>
    );
};

export default AnalyseOperationsListe
