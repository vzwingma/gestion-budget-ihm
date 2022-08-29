import React, { Component } from "react";
import {
  Routes,
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
// import PrivateRoute from './PrivateRoute'
import Budgets from "./budgets/budgets/Budgets.component";
import Login from "./login/Login.component";
import Infos from "./infos/Infos.component";

import Logout from "./login/Logout.component";
import {Nav, Navbar, NavItem} from "react-bootstrap";


/** Page principale avec le routeur **/
export default class Main extends Component {
  render() {
    return (
      <HashRouter>
          <Navbar sticky="top" bg="dark" variant="dark" >
                <Navbar.Brand>
                    <img src="/img/favicon64.png" width="30" height="30" className="d-inline-block align-top" alt="Gestion de budgets"/>
                    {' '}
                    Gestion de budgets
                </Navbar.Brand>
                <Nav >
                    <NavItem><NavLink className="nav-link" to="/infos">Infos</NavLink></NavItem>
                    <NavItem><NavLink className="nav-link" to="/budgets">Budgets</NavLink></NavItem>
                </Nav>
                  <Navbar.Collapse className="justify-content-end">
                      <Navbar.Text>Loggué comme : </Navbar.Text>
                      <NavLink className="nav-item" to="/Logout">Vincent Zwingmann</NavLink>
                  </Navbar.Collapse>
          </Navbar>

        <div className="App">
            <Routes>
                <Route path="/login"    element={<Login/>}/>
                <Route path="/budgets"  element={<Budgets/>} />
                <Route path="/infos"    element={<Infos/>}/>

                <Route path="/logout"   element={<Logout/>}/>
            </Routes>
        </div>
      </HashRouter>
    );
  }
}