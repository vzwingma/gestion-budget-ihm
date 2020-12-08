import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import PrivateRoute from './PrivateRoute'
import Budgets from "./budgets/Budgets";
import Login from "./login/Login";
import Infos from "./infos/Infos";

/** Page principale avec le routeur **/
class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <h1>Gestion de budgets</h1>
          <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/budgets">Budgets</NavLink></li>
            <li><NavLink to="/infos">Infos</NavLink></li>
          </ul>
          <div className="content">
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/budgets" component={Budgets}/>
            <Route path="/infos" component={Infos}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;