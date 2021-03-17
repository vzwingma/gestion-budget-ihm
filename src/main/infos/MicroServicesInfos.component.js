 import React from 'react'

    const MicroServicesInfos = ({ name, version, description }) => {
      return (
            <tr>
              <td>{name}</td><td>{version}</td>
            </tr>
      )
    };

    export default MicroServicesInfos