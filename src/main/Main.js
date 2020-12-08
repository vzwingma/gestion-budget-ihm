import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import PrivateRoute from './PrivateRoute'
import Budgets from "./budgets/Budgets";
import Login from "./login/Login.component";
import Infos from "./infos/Infos";

import Logout from "./login/Logout.component";


/** Page principale avec le routeur **/
class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/budgets">Budgets</NavLink></li>
            <li><NavLink to="/infos">Infos</NavLink></li>
          </ul>
          <ul className="header">
            <li><NavLink to="/Logout">Logout</NavLink></li>
          </ul>


          <div className="App">
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/budgets" component={Budgets} />
            <Route path="/infos" component={Infos}/>

            <Route path="/logout" component={Logout}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;