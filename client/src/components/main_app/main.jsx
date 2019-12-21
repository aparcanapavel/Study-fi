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
import PlaylistShow from "./playlist/playlist_show";
import CreatePlaylist from "./playlist/create_playlist";
const { CURRENT_USER_ID, FETCH_USER_PLAYLISTS } = Queries;

class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSong: null,
      modal: false
    };
    this.toPage = this.toPage.bind(this);
    this.update = this.update.bind(this);
    this.setCurrentSong = this.setCurrentSong.bind(this);
    this.playSongNow = this.playSongNow.bind(this);
    this.playAlbumNow = this.playAlbumNow.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  toPage(page) {
    return this.props.history.push(`/${page}`);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  setCurrentSong(song) {
    this.setState({ currentSong: song });
  }

  playSongNow(song) {
    this.musicPlayer.playSongNow(song);
  }

  playAlbumNow(albumSongs) {
    this.musicPlayer.playAlbumNow(albumSongs);
  }

  openModal() {
    this.setState({ modal: true });
  }

  closeModal() {
    this.setState({ modal: false });
  }

  render() {
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

                <div className="new-playlist" onClick={this.openModal}>
                  <i className="fas fa-plus-square"></i>
                  <p>Create Playlist</p>
                </div>
                <Query
                  query={FETCH_USER_PLAYLISTS}
                  variables={{id: data.currentUserId}}
                >
                  {({ loading, error, data }) => {
                    if(loading) return null;
                    if (error) return <p>error</p>

                    let userPlaylists = Object.values(data.user.playlists).reverse();

                    return <PlaylistIndex currentUserId={data.currentUserId} playlists={userPlaylists}/>
                  }}
                </Query>
              </aside>
              <section className="main-container">
                <Switch>
                  <Route
                    path="/artist/:artistId"
                    render={props => (
                      <ArtistShow {...props} playSongNow={this.playSongNow} />
                    )}
                  />
                  <Route
                    path="/album/:albumId"
                    render={props => (
                      <AlbumShow
                        {...props}
                        playSongNow={this.playSongNow}
                        playAlbumNow={this.playAlbumNow}
                        currentSong={this.state.currentSong}
                      />
                    )}
                  />
                  <Route
                    path="/search"
                    render={props => <Search playSongNow={this.playSongNow} />}
                  />
                  <Route
                    path="/playlist/:playlistId"
                    component={PlaylistShow}
                  />
                  <Route path="/" component={HomeComponent} />
                </Switch>
              </section>
              <div className="music-player">
                <MusicPlayer
                  onRef={ref => (this.musicPlayer = ref)}
                  setCurrentSong={this.setCurrentSong}
                />
              </div>
              {this.state.modal ? (
                <div id="modal-outter-container" onClick={this.closeModal}>
                  <div
                    id="modal-innder-container"
                    onClick={e => e.stopPropagation()}
                  >
                    <CreatePlaylist
                      currentUserId={data.currentUserId}
                      closeModal={this.closeModal}
                    />
                  </div>
                </div>
              ) : null}
            </main>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(MainComponent);