import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import Budgets from "./budgets/Budgets.component";
import Login from "./login/Login.component";
import Infos from "./infos/Infos.component";

import Logout from "./login/Logout.component";


/** Page principale avec le routeur **/
export default class Main extends Component {
  render() {
    return (
      <HashRouter>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-brand">
                <img src="/img/favicon64.png" width="30" height="30" className="d-inline-block align-top" alt="Gestion de budgets"/>
                    Gestion de budgets
            </div>
            <ul className="navbar-nav">
                <li className="nav-item" ><NavLink className="nav-link" to="/budgets">Budgets</NavLink></li>
                <li className="nav-item" ><NavLink className="nav-link" to="/infos">Infos</NavLink></li>
                <span>Texte : Ici sera l'utilisateur </span>
                <li className="nav-item" ><NavLink className="nav-link" to="/Logout">Déconnexion</NavLink></li>
            </ul>
        </nav>
        <div className="App">
            <Route path="/login" component={Login}/>
            <Route path="/budgets" component={Budgets} />
            <Route path="/infos" component={Infos}/>

            <Route path="/logout" component={Logout}/>
        </div>
      </HashRouter>
    );
  }
}