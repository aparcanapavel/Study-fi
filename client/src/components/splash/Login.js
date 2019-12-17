import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import { Link } from "react-router-dom"
const { LOGIN_USER } = Mutations;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    // here we can write directly to our cache with our returned mutation data
    client.writeData({
      data: { isLoggedIn: data.login.loggedIn }
    });
  }

  render() {
    return (
      <Mutation
        mutation={LOGIN_USER}
        onCompleted={data => {
          const { token } = data.login;
          localStorage.setItem("auth-token", token);
          this.props.history.push("/");
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {loginUser => (
          <div className="auth-div">
            <h1 className="auth-header">
              Login!
            </h1>
            <form
              className="auth-form"
              onSubmit={e => {
                e.preventDefault();
                loginUser({
                  variables: {
                    email: this.state.email,
                    password: this.state.password
                  }
                });
              }}
            >
              <input
                className="auth-input"
                value={this.state.email}
                onChange={this.update("email")}
                placeholder="Email"
              />
              <input
                className="auth-input"
                value={this.state.password}
                onChange={this.update("password")}
                type="password"
                placeholder="Password"
              />
              <button
                className="auth-button"
                type="submit">
                  Log In
              </button>
            </form>

            <div className="auth-switch">
              <h1 className="auth-link-preface">Need an account?</h1>
              <Link to="/register"><h1 className="auth-link">Register Instead</h1></Link>
            </div>

            <div className="auth-switch">
              <h1 className="auth-link">Use Demo User</h1>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Login;