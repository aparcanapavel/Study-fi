import React, { Component } from "react";
import { withRouter } from "react-router";
import { Switch, Route } from 'react-router-dom';
import Nav from "../Nav";
import HomeComponent from './home';
import MusicPlayer from '../music_player';
import Search from "./search/search";
import ArtistShow from "./artist/artist_show";
import AlbumShow from "./album/album_show";
import PlaylistIndex from "./playlist/playlist_index";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
const {CURRENT_USER_ID} = Queries;

class MainComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      newQueue: ""
    }
    this.toPage = this.toPage.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.playSongNow = this.playSongNow.bind(this);
  }

  toPage(page){
    return this.props.history.push(`/${page}`);
  }

  update(field){
    return e => this.setState({ [field]: e.target.value });
  }

  handleSubmit(e){
    e.preventDefault();
    this.musicPlayer.addToQueue(this.state.newQueue);
  }

  playSongNow(song){
    this.musicPlayer.playSongNow(song);
  }

  render(){
    return (
      <Query query={CURRENT_USER_ID}>
        {({ loading, error, data }) => {
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
                <PlaylistIndex />
                <div className="new-playlist">
                  <i className="fas fa-plus-square"></i>
                  <p>Create Playlist</p>
                </div>
              </aside>
              <section className="main-container">
                <Switch>
                  <Route path="/artist/:artistId" component={ArtistShow} />
                  <Route 
                    path="/album/:albumId" 
                    render={props => <AlbumShow {...props} playSongNow={this.playSongNow}/>} 
                  />
                  <Route
                    path="/search"
                    render={props => <Search playSongNow={this.playSongNow} />}
                  />
                  <Route path="/" component={HomeComponent} />
                </Switch>
              </section>
              <div className="music-player">
                <MusicPlayer onRef={ref => (this.musicPlayer = ref)} />
              </div>
            </main>
          );
        }}
        </Query>
    );
  }
}

export default withRouter(MainComponent);