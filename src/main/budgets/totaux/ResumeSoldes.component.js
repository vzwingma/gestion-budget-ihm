import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap'

import * as AppConstants from "../../Utils/AppEnums.constants"

/*
 * Page principale du solde
 */


const ResumeSoldes = ({ currentBudget }) => {
     return (
        <Container fluid>
          <Row>
            <Col>
                Au { new Date(Date.now()).getDate() } { new Date(Date.now()).toLocaleString('default', { month: 'long' }) } { new Date(Date.now()).getFullYear() }
            </Col>
            <Col>
                Fin { new Date(Date.now()).toLocaleString('default', { month: 'long' }) } { new Date(Date.now()).getFullYear() }
            </Col>
          </Row>
          <Row>
            <Col>{
                    currentBudget.soldes.soldeAtMaintenant > 0 ?
                        <span class="text-success">{currentBudget.soldes.soldeAtMaintenant.toFixed(2)} €</span> :
                        <span class="text-danger">{currentBudget.soldes.soldeAtMaintenant.toFixed(2)} €</span>
                }
            </Col>
            <Col>{
                    currentBudget.soldes.soldeAtFinMoisCourant > 0 ?
                        <span class="text-success">{currentBudget.soldes.soldeAtFinMoisCourant.toFixed(2)} €</span> :
                        <span class="text-danger">{currentBudget.soldes.soldeAtFinMoisCourant.toFixed(2)} €</span>
                }
            </Col>
          </Row>
         </Container>
      )
     };

  export default ResumeSoldes
