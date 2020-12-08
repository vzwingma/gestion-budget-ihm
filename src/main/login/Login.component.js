import React, { Component } from "react";

export default class Login extends Component {
  render() {
    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
            <form>
                <h3>Authentification</h3>

                <div className="form-group">
                    <label>Password</label>
                    <input type="Access Token" className="form-control" placeholder="OAuth2 Token" />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Connexion</button>
            </form>
            </div>
        </div>
    );
  }
}
