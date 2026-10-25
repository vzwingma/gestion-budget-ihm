import React, { JSX } from 'react'
import OperationItem from './courantes/OperationsListItem.component.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import { OperationsListeProps } from '../../Components.props.tsx';
import SharedOperationsListe from './OperationsListe.shared.tsx';
import OperationsListHeader from './OperationsListHeader.component.tsx';
import { FILTER_BAR_HEIGHT } from '../../../Utils/renderers/ListData.renderer.utils.tsx';


/**
 * Tuile  d'une liste d'opérations
 * @param operationGroupedByDate opérations groupées par date d'opérations
 * @param filterOperations filtre des opérations
 * @param filterPuces puces de filtre (état / sens)
 * @param listeComptes liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 *
 */
const OperationsListe: React.FC<OperationsListeProps> = ({ operationGroupedByDate, filterOperations, filterPuces, onClick: handleOperationSelect, selectedOperationId }: OperationsListeProps): JSX.Element => {

    const renderItem = (operation: OperationModel, onClick: (operation: OperationModel) => void): JSX.Element => {
        return <OperationItem key={operation.id}
            operation={operation}
            onClick={onClick}
            isSelected={operation.id === selectedOperationId}
            isOneSelected={selectedOperationId !== null && selectedOperationId !== undefined} />
    };

    // Groupe sans date (clé "null") : aucun en-tête, comme avant
    const renderGroupHeader = (groupKey: string, operationsFiltered: OperationModel[]): JSX.Element | null =>
        groupKey === "null" ? null : <OperationsListHeader groupKey={groupKey} operations={operationsFiltered} />;

    return (
        <SharedOperationsListe
            operationsGrouped={operationGroupedByDate}
            filterOperations={filterOperations}
            filterPuces={filterPuces}
            reservedHeight={FILTER_BAR_HEIGHT}
            onClick={handleOperationSelect}
            renderItem={renderItem}
            renderGroupHeader={renderGroupHeader}
        />
    );
};

export default OperationsListe
