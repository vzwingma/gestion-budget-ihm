import React, {JSX} from 'react'
import {OperationItemProps} from '../../Components.props.tsx';
import {getOperationStateColor} from '../../../Utils/renderers/OperationItem.renderer.tsx';
import SharedOperationItem from './OperationListItem.shared.tsx';
import OperationModel from '../../../Models/budgets/Operation.model.ts';


/**
 * Tuile d'une opération dans la liste des opérations
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationItem: React.FC<OperationItemProps> = ({operation, onClick : handleOperationSelect} : OperationItemProps) : JSX.Element => {

    const getBorderColor = (op: OperationModel): string => getOperationStateColor(op.etat);

    return (
        <SharedOperationItem
            operation={operation}
            onClick={handleOperationSelect}
            getBorderColor={getBorderColor}
        />
    );
};
export default OperationItem
