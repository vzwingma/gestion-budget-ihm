import React, {JSX} from 'react'
import OperationModel from '../../../Models/budgets/Operation.model.ts';
import {OperationsRecurrentesListeProps} from '../../Components.props.ts';
import OperationRecurrenteItem from './OperationsRecurrentesListItem.component.tsx';
import { getPeriodeRenderer } from '../../../Utils/renderers/OperationItem.renderer.tsx';
import { PERIODES_MENSUALITE_ENUM } from '../../../Utils/AppBusinessEnums.constants.ts';
import SharedOperationsListe from './OperationsListe.shared.tsx';


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
    
    const renderItem = (operation: OperationModel, onClick: (operation: OperationModel) => void): JSX.Element => (
        <OperationRecurrenteItem key={operation.id}
                                operation={operation}
                                onClick={onClick}/>
    );

    const getSeparatorStyle = (key: string) => ({
        color: getPeriodeRenderer(key as PERIODES_MENSUALITE_ENUM).color
    });

    return (
        <SharedOperationsListe
            operationsGrouped={operationGroupedByPeriodicity}
            filterOperations={filterOperations}
            onClick={handleOperationSelect}
            renderItem={renderItem}
            getSeparatorStyle={getSeparatorStyle}
        />
    );
};

export default OperationsRecurrentesListe
