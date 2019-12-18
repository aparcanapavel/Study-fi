import React, { Component } from "react";
import Nav from "../Nav";

import Search from "./search/search";

class MainComponent extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <main className="overall-container">
        <nav className="top-nav">
          <Nav />
        </nav>
        <aside className="main-nav">
          <h2>
            <i className="fas fa-graduation-cap"></i> Study-fi
          </h2>
          <ul className="main-links">
            <li key="1">
              <i className="fas fa-university"></i>
              <p>Home</p>
            </li>
            <li key="2">
              <i className="fas fa-search"></i>
              <p>Search</p>
            </li>
            <li key="3">
              <i className="fas fa-book"></i>
              <p>Your Library</p>
            </li>
          </ul>
          <h3>PLAYLISTS</h3>
          <div className="new-playlist">
            <i className="fas fa-plus-square"></i>
            <p>Create Playlist</p>
          </div>
          <ul className="playlists">
            <li></li>
          </ul>
        </aside>
        <section className="main-container">all the music boxes</section>
      </main>
    );
  }
}

export default MainComponent;