import React from "react";
import { Query } from "react-apollo";
import { Route, Switch, HashRouter } from "react-router-dom";
import AuthRoute from "../util/route_util";
import Nav from "./Nav";
import MusicPlayer from './music_player';
import "./css_index.css";

import Splash from "./splash/Splash";
import MainComponent from './main_app/main';
import Queries from "../graphql/queries";
const { IS_LOGGED_IN } = Queries;


const App = () => {
  return (
    <Query query={IS_LOGGED_IN}>
      {({ data }) => {
        if(data.isLoggedIn){
          return(
            <div className='main-component'>
              <MainComponent />
            </div>
          )
        } else {
          return (
            <div className="splash-page-container">
              <Nav />
              <Splash />
              {/* <MusicPlayer /> */}
            </div>
          );
        }
      }}
    </Query>

  );
};

export default App;
