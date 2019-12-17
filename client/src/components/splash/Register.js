import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import { Link } from "react-router-dom";

const { REGISTER_USER } = Mutations;

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      password: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    console.log(data);
    // here we can write directly to our cache with our returned mutation data
    client.writeData({
      data: { isLoggedIn: data.register.loggedIn }
    });
  }

  render() {
    return (
      <Mutation
        mutation={REGISTER_USER}
        onCompleted={data => {
          debugger;
          const { token } = data.register;
          localStorage.setItem("auth-token", token);
          this.props.history.push("/");
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {registerUser => (
          <div className="auth-div">
            <h1 className="auth-header">
              Register!
            </h1>
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
              />
              <input
                className="auth-input"
                value={this.state.name}
                onChange={this.update("name")}
                placeholder="Name"
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
                  Sign Up
              </button>
              <div className="auth-switch">
                <h1 className="auth-link-preface">Already a member?</h1>
                <Link to="/login" > <h1 className="auth-link">Login Instead</h1></Link>
              </div>
              <div className="auth-switch">
                <h1 className="auth-link">Use Demo User</h1>
              </div>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Register;