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

const App = () => {
  return (
    <div>

        <Nav />
        <Splash />
        <MusicPlayer />

    </div>
  );
};

export default App;
