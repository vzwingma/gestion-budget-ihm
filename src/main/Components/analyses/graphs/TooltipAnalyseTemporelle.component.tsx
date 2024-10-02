import {getStyleOperation} from "../../../Utils/renderers/OperationValue.renderer";
import React from "react";
import { TooltipAnalyseTemporelleProps } from "../../Components.props";
import { SOLDES_ENUM } from "./GraphAnalyseTemporelle.constant";



/**
 * formatte le tooltip
 * @param active
 * @param payload
 * @param label
 * @returns {JSX.Element}
 * @constructor
 */
const TooltipAnalyseTemporelle = ({active, payload, label} : TooltipAnalyseTemporelleProps) => {
    let tooltip : JSX.Element[] = [];
    if (active && payload?.length) {

        payload.forEach((item : any) => {
            if (!(item.dataKey.startsWith(SOLDES_ENUM.PREVISIONNEL) && payload.find(p => p.dataKey === item.dataKey.replace(SOLDES_ENUM.PREVISIONNEL, "")) !== undefined)) {
                let name = (item.dataKey.startsWith(SOLDES_ENUM.PREVISIONNEL) ? "Prévisionnel " : "") + item.name.replace(SOLDES_ENUM.PREVISIONNEL, "");

                if (item.name.includes("Soldes")) {
                    let nameSoldes = item.name.includes(SOLDES_ENUM.SOLDE_COURANT) ? "Solde Début" : "Solde Fin";
                    tooltip.push(
                        <p key={item.id}>
                            {nameSoldes} :
                            <span className={getStyleOperation(null, item.value)}> {item.value} €</span>
                        </p>)
                } else {
                    tooltip.push(<p key={item.id} style={{color: item.color}}>{name} : {item.value} €</p>)
                }
            }
        });
    }
    return (
        <div className="custom-tooltip" style={{color: "white", backgroundColor: "#121212AA"}}>
            <h2 className="label">{label}</h2>
            {tooltip}
        </div>
    );
}

export default TooltipAnalyseTemporelle
