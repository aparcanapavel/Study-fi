import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import Mutations from "./graphql/mutations";
const { VERIFY_USER } = Mutations;

let cache;
let client;
let currentUserId;

async function setupClient() {
  cache = new InMemoryCache({
    dataIdFromObject: object => object._id || null
  });

  const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql",
    headers: {
      // pass our token into the header of each request
      authorization: localStorage.getItem("auth-token")
    }
  });

  const errorLink = onError(({ graphQLErrors }) => {
    //this is where the error happens. force reload to fix?
    // if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
    if(graphQLErrors){
      graphQLErrors.map(({ message }) => console.log(message));
    } else {
      window.location.reload();
    }
  });

  client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache,
    onError: ({ networkError, graphQLErrors }) => {
      console.log("graphQLErrors", graphQLErrors);
      console.log("networkError", networkError);
    }
  });
}

async function populateCache() {
  const token = localStorage.getItem("auth-token");

  await cache.writeData({
    data: {
      isLoggedIn: Boolean(token)
    }
  });

  if (token) {
    await client
      .mutate({ mutation: VERIFY_USER, variables: { token } })
      .then(({ data }) => {
        currentUserId = data.verifyUser._id

        cache.writeData({
          data: {
            isLoggedIn: data.verifyUser.loggedIn,
            currentUserId: data.verifyUser._id
          }
        });
      });
  }
}

setupClient()
  .then(() => populateCache())
  .then(() => {
    const Root = () => {
      return (
        <ApolloProvider client={client}>
          <HashRouter>
            <App currentUserId={currentUserId} />
          </HashRouter>
        </ApolloProvider>
      );
    };

    ReactDOM.render(<Root />, document.getElementById("root"));
  })



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
