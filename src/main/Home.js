import React, { Component } from "react";

/*
 * Bandeau principal
 */
export default class Home extends Component {
  render() {
    return (
        <div>
            <h5>Gestion de budgets - {process.env.NODE_ENV}</h5>
        </div>
    );
  }
}