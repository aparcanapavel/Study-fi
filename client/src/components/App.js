import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Route, Switch, HashRouter } from "react-router-dom";
import AuthRoute from "../util/route_util";
import Login from "./splash/Login";
import Nav from "./Nav";
import MusicPlayer from './music_player';
import UserShow from "./user/User_Show";
import "./css_index.css";
import SongIndex from "./song/song_index";

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
              <MusicPlayer />
            </div>
          )
        } else {
          return (
            <div className="splash-page-container">
              <Nav />
              <Splash />
              <MusicPlayer />
            </div>
          );
        }
      }}
    </Query>

  );
};

export default App;
