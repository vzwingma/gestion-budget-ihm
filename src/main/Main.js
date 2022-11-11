import React, { Component } from "react";
import { Routes, Route, NavLink, HashRouter} from "react-router-dom";
// import PrivateRoute from './PrivateRoute'
import Budgets from "./budgets/budgets/Budgets.component";
import Login from "./login/Login.component";
import Infos from "./infos/Infos.component";

import Logout from "./login/Logout.component";
import {AppBar, Stack, Toolbar, Typography} from "@mui/material";


/** Page principale avec le routeur **/
export default class Main extends Component {
  render() {
    return (
        <HashRouter>
            <AppBar position="sticky" variant={"outlined"}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Stack direction="row" spacing={10}>
                            <img src="/img/favicon64.png" width="40" height="40" className="d-inline-block align-top" alt="Gestion de budgets"/>
                            <NavLink className="nav-link" to="/infos">Infos</NavLink>
                            <NavLink className="nav-link" to="/budgets">Budgets</NavLink>
                        </Stack>
                    </Typography>
                    <Typography variant={"subtitle1"} component="div" sx={{ flexGrow: 10 }} align={"right"}>
                        Loggué comme : <NavLink className="nav-item" to="/Logout">Vincent Zwingmann</NavLink>
                    </Typography>
                </Toolbar>
            </AppBar>

            <div className="App">
                <Routes>
                    <Route path="/"    element={<Infos/>}/>
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