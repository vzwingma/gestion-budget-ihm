import React from "react";

import OperationButtonAction from "./renderers/OperationButtonAction.component";
import {ButtonGroup} from "@mui/material";

const OperationItemActions = ({operation}) => {


    return (
        <ButtonGroup aria-label="Actions" variant={"light"}>
            {operation.etat !== "REALISEE" &&
                <OperationButtonAction action="REALISEE" iconAction="circle_ok.png" label="Valider l'opération"/>
            }
            {operation.etat !== "PREVUE" &&
                <OperationButtonAction action="PREVUE" iconAction="circle_clock.png" label="Prévoir l'opération"/>
            }
            {operation.etat !== "ANNULEE" &&
                <OperationButtonAction action="ANNULEE" iconAction="circle_cancel.png" label="Annuler l'opération"/>
            }
            {operation.etat !== "SUPPRIMEE" &&
                <OperationButtonAction action="SUPPRIMEE_A_CONFIRMER" iconAction="circle_remove.png"
                                       label="Supprimer l'opération"/>
            }
            {operation.etat !== "REPORTEE" &&
                <OperationButtonAction action="REPORTEE" iconAction="circle_arrow_right.png"
                                       label="Reporter l'opération"/>
            }
        </ButtonGroup>
    )
}
export default OperationItemActions
