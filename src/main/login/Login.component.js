import React, { Component } from "react";
import { authenticate } from './../Services/Auth.service'
/**
 *   Page de login
 **/
export default class Login extends Component {
    constructor(props) {
        super(props);
        console.log(process.env.REACT_APP_OAUTH2_TOKEN)
        this.state = {token: process.env.REACT_APP_OAUTH2_TOKEN};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({token: event.target.value});
    }

    // Validation du formulaire
    handleSubmit(event) {
        event.preventDefault();
        authenticate(this.state.token)
        console.log("Redirect to previous view")
        this.props.history.push("/budgets");
    }


   /**
    Phase de render
   **/

  render() {
    return (

        <div className="auth-wrapper">
            <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
                <h3>Authentification</h3>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="OAuth2 Token" value={this.state.token} onChange={this.handleChange}/>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Connexion</button>
            </form>
            </div>
        </div>
    );
  }
}
