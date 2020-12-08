import React, { Component } from "react";
import { logout } from './../Services/Auth.service'
/**
 *   Page de logout
 **/
export default class Logout extends Component {
    constructor(props) {
        super(props);
        logout();
    }


   /**
    Phase de render
   **/

  render() {
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
            Bye !
            </div>
        </div>
    );
  }
}
