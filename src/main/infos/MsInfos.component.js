 import React from 'react'

    const MicroServicesInfos = ({ name, version, description }) => {
      return (
              <div>
                <h5>{name} : {version}</h5>
              </div>
      )
    };

    export default MicroServicesInfos