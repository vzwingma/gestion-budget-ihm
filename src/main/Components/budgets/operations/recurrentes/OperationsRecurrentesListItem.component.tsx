import React, {JSX} from 'react'
import {OperationItemProps} from '../../../Components.props.ts';
import {getPeriodeRenderer} from '../../../../Utils/renderers/OperationItem.renderer.tsx';
import SharedOperationItem from '../courantes/OperationsListItem.shared.tsx';
import OperationModel from '../../../../Models/budgets/Operation.model.ts';


/**
 * Tuile d'une opération récurrente dans la liste des opérations récurrentes
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationRecurrenteItem: React.FC<OperationItemProps> = ({operation, onClick : handleOperationSelect, isSelected, isOneSelected} : OperationItemProps) : JSX.Element => {

    const getBorderColor = (op: OperationModel): string => getPeriodeRenderer(op.mensualite.periode).color;

    return (
        <SharedOperationItem
            operation={operation}
            onClick={handleOperationSelect}
            getBorderColor={getBorderColor}
            getOperationsColor='#4A2E12'
            getSelectedOperationColor='#FB923C'
            isSelected={isSelected}
            isOneSelected={isOneSelected} />
    );
};
export default OperationRecurrenteItem
