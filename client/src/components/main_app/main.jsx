import React, { Component } from "react";
import { withRouter } from "react-router";
import { Switch, Route } from 'react-router-dom';
import Nav from "../Nav";
import HomeComponent from './home';
import MusicPlayer from '../music_player';
import Search from "./search/search";

class MainComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      newQueue: ""
    }
    this.toPage = this.toPage.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toPage(page){
    return this.props.history.push(`/${page}`);
  }

  update(field){
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e){
    e.preventDefault();
    this.child.addToQueue(this.state.newQueue);
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
            <li key="1" onClick={() => this.toPage("")}>
              <i className="fas fa-university"></i>
              <p>Home</p>
            </li>
            <li key="2" onClick={() => this.toPage("search")}>
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
        <section className="main-container">
          <Switch>
            <Route path="/search" component={Search} />
            <Route path="/" component={HomeComponent} />
          </Switch>
          <form onSubmit={this.handleSubmit} id="testInput">
            <input
              type="text"
              value={this.state.newQueue}
              onChange={this.update("newQueue")}
            />
            <button>go</button>
          </form>
        </section>
        <div className="music-player">
          <MusicPlayer onRef={ref => (this.child = ref)} />
        </div>
      </main>
    );
  }
}

export default withRouter(MainComponent);