import React from "react";
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
                  }}
                >
                  Logout
                </button>
                <div className="blurred"></div>
                </div>
              );
            } else {
              return (
                <ul className="nav-auth">
                  <li><Link to="/login" className="nav-link">Login</Link></li>
                  <li><Link to="/register" className="nav-link">Sign up</Link></li>
                </ul>
              );
            }
          }}
        </Query>
      )}
    </ApolloConsumer>
  );
};

export default Nav;