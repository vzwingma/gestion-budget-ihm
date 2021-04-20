import React, { Component } from "react";
import Table from 'react-bootstrap/Table';

import * as AppConstants from "../../Utils/AppEnums.constants"

/*
 * Page principale du solde
 */


const ResumeSoldes = ({ currentBudget }) => {

     // assuming 'changeMyVariable' returns a value
        const typeSoldeNow = currentBudget.soldes.soldeAtMaintenant > 0 ? "success" : "danger";
        const typeSoldeFin = currentBudget.soldes.soldeAtMaintenant > 0 ? "success" : "danger";

     return (
        <Table striped bordered hover size="sm" variant="light">
          <thead>
           <tr>
            <th/>
            <th>
                Au { new Date(Date.now()).getDate() } { new Date(Date.now()).toLocaleString('default', { month: 'long' }) } { new Date(Date.now()).getFullYear() }
            </th>
            <th>
                Fin { new Date(Date.now()).toLocaleString('default', { month: 'long' }) } { new Date(Date.now()).getFullYear() }
            </th>
          </tr>
          </thead>
          <tbody><tr>
            <td> Solde </td>
            <td>{
                    currentBudget.soldes.soldeAtMaintenant > 0 ?
                        <span class="text-success">{currentBudget.soldes.soldeAtMaintenant.toFixed(2)} €</span> :
                        <span class="text-danger">{currentBudget.soldes.soldeAtMaintenant.toFixed(2)} €</span>
                }
            </td>
            <td>{
                    currentBudget.soldes.soldeAtFinMoisCourant > 0 ?
                        <span class="text-success">{currentBudget.soldes.soldeAtFinMoisCourant.toFixed(2)} €</span> :
                        <span class="text-danger">{currentBudget.soldes.soldeAtFinMoisCourant.toFixed(2)} €</span>
                }
            </td>
          </tr></tbody>
         </Table>
      )
     };

  export default ResumeSoldes
