import {getStyleOperation} from "../../Utils/renderers/OperationValue.renderer";
import PropTypes from "prop-types";
import React from "react";

/**
 * formatte le tooltip
 * @param active
 * @param payload
 * @param label
 * @returns {JSX.Element}
 * @constructor
 */
const TooltipAnalyseTemporelle = ({active, payload, label}) => {
    let tooltip = [];
    if (active && payload && payload.length) {

        payload.forEach(item => {
            if (!(item.dataKey.startsWith("prev_") && payload.find(p => p.dataKey === item.dataKey.replace("prev_", "")) !== undefined)) {
                let name = (item.dataKey.startsWith("prev_") ? "Prévisionnel " : "") + item.name.replace("prev_", "");

                if (item.name.includes("Soldes")) {
                    let nameSoldes = item.name.includes("SoldesD") ? "Solde Début" : "Solde Fin";
                    tooltip.push(
                        <p key={item.id}>{nameSoldes} :
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
// Types des propriétés
TooltipAnalyseTemporelle.propTypes = {
    active: PropTypes.bool.isRequired,
    payload: PropTypes.array.isRequired,
    label: PropTypes.string
}
export default TooltipAnalyseTemporelle
