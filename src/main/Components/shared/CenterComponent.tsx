import {InternalStandardProps} from "@mui/material/internal";
import React, {JSX} from "react";


export interface CenterComponentProps extends InternalStandardProps<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Tooltip reference element.
   */
  children: React.ReactElement<any, any>[] | React.ReactElement<any, any>;
}


export const CenterComponent: React.FC<CenterComponentProps> = (props: CenterComponentProps): JSX.Element => {
return (
        <div className="container">
            <div className="child">
                {props.children}
            </div>
        </div>
    );
}


