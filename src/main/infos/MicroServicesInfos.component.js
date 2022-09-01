 import React from 'react'

 const MicroServicesInfos = ({ name, version }) => {
      return (
            <tr>
              <td>API {name}</td><td>{version}</td>
            </tr>
      )
    };

 export default MicroServicesInfos