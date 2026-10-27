import OperationModel from "../../../../Models/budgets/Operation.model.ts";

export interface OperationItemProps {
    operation: OperationModel
    onClick: (operation : OperationModel) => void | null
    isSelected?: boolean
    isOneSelected?: boolean
}
