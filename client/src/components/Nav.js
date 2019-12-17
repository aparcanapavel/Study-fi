import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Query, ApolloConsumer } from "react-apollo";
import Queries from "../graphql/queries";
const { IS_LOGGED_IN } = Queries;

const Nav = props => {
  return (
    <ApolloConsumer>
      {client => (
        <Query query={IS_LOGGED_IN}>
          {({ data }) => {
            if (data.isLoggedIn) {
              return (
                <div className="nav-auth">
                <button
                  className="nav-button"
                  onClick={e => {
                    e.preventDefault();
                    localStorage.removeItem("auth-token");
                    client.writeData({ data: { isLoggedIn: false } });
                    props.history.push("/");
                  }}
                >
                  Logout
                </button>
                </div>
              );
            } else {
              return (
                <div className="nav-auth">
                  <Link to="/login"><h1 className="nav-link">Login</h1></Link>
                  <Link to="/register"><h1 className="nav-link">Register</h1></Link>
                </div>
              );
            }
          }}
        </Query>
      )}
    </ApolloConsumer>
  );
};

export default Nav;