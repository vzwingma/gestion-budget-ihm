import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
        <div>
            <center>
                <h1>Gestion de budgets</h1>
            </center>
            <div>
                <h3>{process.env.NODE_ENV}</h3>
            </div>
        </div>
    );
  }
}

export default Home;