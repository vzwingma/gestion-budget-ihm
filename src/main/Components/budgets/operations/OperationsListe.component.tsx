import React, {JSX} from 'react'
import OperationItem from './OperationsListItem.component.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OperationsListeProps} from '../../Components.props.tsx';
import SharedOperationsListe from './OperationsListe.shared.tsx';


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param listeComptes liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
const OperationsListe: React.FC<OperationsListeProps> = ({operationGroupedByDate, filterOperations, onClick : handleOperationSelect, selectedOperationId} : OperationsListeProps) : JSX.Element => {
    
    const renderItem = (operation: OperationModel, onClick: (operation: OperationModel) => void): JSX.Element => {
        console.log("Rendering operation item", operation.id, selectedOperationId, operation.id === selectedOperationId);

        return <OperationItem key={operation.id}
                      operation={operation}
                      onClick={onClick}
                      isSelected={operation.id === selectedOperationId}/>
    };

    return (
        <SharedOperationsListe
            operationsGrouped={operationGroupedByDate}
            filterOperations={filterOperations}
            onClick={handleOperationSelect}
            renderItem={renderItem}
        />
    );
};

export default OperationsListe
