import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import { Link } from "react-router-dom";

const { REGISTER_USER, LOGIN_USER } = Mutations;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      password: "",
      errors: null
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    client.writeData({
      data: { isLoggedIn: data.register.loggedIn }
    });
  }

  updateLoginCache(client, { data }) {
    client.writeData({
      data: { isLoggedIn: data.login.loggedIn }
    });
  }

  demoUser(e, login) {
    e.preventDefault();
    login({
      variables: {
        email: "demoUser@gmail.com",
        password: "password"
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleErrors(errors) {
    this.timer = setTimeout(() => {
      const authModal = document.getElementById("auth-div");
      authModal.classList.add("error");
    }, 1);
    const splitErr = errors.message.split(":");
    this.setState({ errors: splitErr[1] });
  };

  emailStyle() {
    if (this.state.errors && this.state.errors.includes("Email")) {
      return {"border": "1px solid red"}
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

  nameStyle() {
    if (this.state.errors && (this.state.errors.includes("Name"))) {
      return {"border": "1px solid red"};
    } else {
      return {};
    }
  }
  render() {
    return (
      <Mutation
        mutation={REGISTER_USER}
        onCompleted={data => {
          const { token } = data.register;
          localStorage.setItem("auth-token", token);
          this.props.history.push("/");
        }}
        onError={errors => {
          this.handleErrors(errors);
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {registerUser => (
          <div className="auth-div" id="auth-div">
            <h1 className="auth-header">Sign Up!</h1>
            <ul className="errors-ul">
              {this.state.errors}
            </ul>
            <form
              className="auth-form"
              onSubmit={e => {
                e.preventDefault();
                registerUser({
                  variables: {
                    email: this.state.email,
                    name: this.state.name,
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
                value={this.state.name}
                onChange={this.update("name")}
                placeholder="Name"
                style={this.nameStyle()}
              />
              <input
                className="auth-input"
                value={this.state.password}
                onChange={this.update("password")}
                type="password"
                placeholder="Password"
                style={this.passwordStyle()}
              />
              <button className="auth-button" type="submit">
                Sign Up
              </button>
              <div className="auth-switch">
                <h1 className="auth-link-preface">Already a member?</h1>
                <Link to="/login">
                  {" "}
                  <h1 className="auth-link">Login Instead</h1>
                </Link>
              </div>
              <div className="auth-switch">
                <Mutation
                  mutation={LOGIN_USER}
                  onCompleted={data => {
                    const { token } = data.login;
                    localStorage.setItem("auth-token", token);
                    this.props.history.push("/");
                  }}
                  update={(client, data) => this.updateLoginCache(client, data)}
                >
                  {loginUser => {
                    return (
                      <p
                        className="auth-link"
                        onClick={e => this.demoUser(e, loginUser)}
                      >
                        Use Demo User
                      </p>
                    );
                  }}
                </Mutation>
              </div>
            </form>

            
          </div>
        )}
      </Mutation>
    );
  }
}

export default Register;