import React, {JSX} from 'react'
import {getOperationStateColor} from '../../../../Utils/renderers/OperationItem.renderer.tsx';
import SharedOperationItem from './OperationsListItem.shared.tsx';
import OperationModel from '../../../../Models/budgets/Operation.model.ts';
import { OperationItemProps } from "../shared/OperationItem.props.ts";


/**
 * Tuile d'une opération dans la liste des opérations
 * @param operation : object opération affichée
 * @param listeComptes : array liste des comptes
 * @returns {JSX.Element} tuile
 * @constructor constructeur
 */
const OperationItem: React.FC<OperationItemProps> = ({operation, onClick : handleOperationSelect, isSelected, isOneSelected} : OperationItemProps) : JSX.Element => {

    const getBorderColor = (op: OperationModel): string => getOperationStateColor(op.etat);

    return (
        <SharedOperationItem
            operation={operation}
            onClick={handleOperationSelect}
            getBorderColor={getBorderColor}
            isSelected={isSelected}
            isOneSelected={isOneSelected}
        />
    );
};

// AP 006 - T8 : composant rendu en boucle (une tuile par opération) ; évite le re-render de
// chaque tuile quand seules d'autres opérations de la liste changent (cf. T9 pour la
// stabilisation du callback `onClick` associé).
export default React.memo(OperationItem)
