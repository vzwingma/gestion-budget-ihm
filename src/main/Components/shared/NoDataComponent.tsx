import React, {JSX} from "react";


export const NoDataComponent: React.FC = (): JSX.Element => {
return (<div style={{ 
                width: '100%', 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#999',
                fontSize: '14px'
            }}>
                Aucune donnée à afficher
            </div>);
}


