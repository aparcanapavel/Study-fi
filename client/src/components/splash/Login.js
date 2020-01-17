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
      password: "",
      errors: null
    };

    this.demoUser = this.demoUser.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  };

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  };

  updateCache(client, { data }) {
    // here we can write directly to our cache with our returned mutation data
    client.writeData({
      data: { isLoggedIn: data.login.loggedIn }
    });
  };

  demoUser(e, login){
    e.preventDefault();
    login({
      variables: {
        email: "demoUser@gmail.com",
        password: "password"
      }
    });
  };

  componentWillUnmount(){
    clearTimeout(this.timer);
  }

  handleErrors(errors) {
    this.timer = setTimeout(() => {
      const authModal = document.getElementById("auth-div");
      authModal.classList.add("error");
    },1);
    const splitErr = errors.message.split(":");
    this.setState({ errors: splitErr[1] });
  };

  emailStyle() {
    if (this.state.errors && (this.state.errors.includes("Email") || this.state.errors.includes("email"))) {
      return { "border": "1px solid red" }
    } else {
      return {}
    }
  };

  passwordStyle() {
    if (this.state.errors && (this.state.errors.includes("Password") || this.state.errors.includes("password"))) {
      return { "border": "1px solid red" }
    } else {
      return {}
    }
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
        onError = { errors => {
          this.handleErrors(errors);
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {loginUser => {
          return <div className="auth-div" id="auth-div">
            <h1 className="auth-header">
              Login!
            </h1>
            <ul className="errors-ul">
              {this.state.errors}
            </ul>
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
                style={this.emailStyle()}
              />
              <input
                className="auth-input"
                value={this.state.password}
                onChange={this.update("password")}
                type="password"
                placeholder="Password"
                style={this.passwordStyle()}
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
              <p className="auth-link" onClick={(e) => this.demoUser(e, loginUser)}>Use Demo User</p>
            </div>

            
          </div>
        }}
      </Mutation>
    );
  };
}

export default Login;