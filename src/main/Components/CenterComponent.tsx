import { InternalStandardProps } from "@mui/material";
import React from "react";


export interface CenterComponentProps extends InternalStandardProps<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Tooltip reference element.
   */
  children: React.ReactElement<any, any>;
}
   

  export default function CenterComponent(props: CenterComponentProps): JSX.Element {
    return (
      <div>
        {props.children}
      </div>
    );
  }