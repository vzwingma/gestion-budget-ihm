import React, { JSX } from 'react'
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { AnalyseOperationsListeProps } from '../../Components.props.ts';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { getHeightDetailList } from '../../../Utils/renderers/ListData.renderer.utils.tsx';
import AnalyseOperationItem from './AnalyseOperationItem.component.tsx';
import { NoDataComponent } from '../../shared/NoDataComponent.tsx';


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
    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));


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

        operationsGrouped.toSorted((ope1: OperationModel, ope2: OperationModel) => ((ope1.autresInfos.dateOperation ? new Date(ope1.autresInfos.dateOperation).getTime() : 0) - (ope2.autresInfos.dateOperation ? new Date(ope2.autresInfos.dateOperation).getTime() : 0)) || (ope1.libelle.localeCompare(ope2.libelle)))
            .forEach((operation) =>
                renderList.push(renderItem(operation))
            );

        return renderList;
    }

    if (!operations || operations.length === 0) {
        return <NoDataComponent />;
    }


    return (<Box sx={{ height: getHeightDetailList(isMobile), display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'auto' }}>
                {iterateOperations(operations, renderItem)}
            </Box>
    );
};

export default AnalyseOperationsListe
