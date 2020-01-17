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
import QueueShow from '../music_player/queue_show';
import Library from "./library/library";
import Loader from "react-loader-spinner";
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
    this.removeActive = this.removeActive.bind(this);
    this.setActive = this.setActive.bind(this);
    this.getQueue = this.getQueue.bind(this);
    this.playAlbumSongNow = this.playAlbumSongNow.bind(this);
  }

  toPage(page) {
    this.removeActive();
    let selected;
    if (page === "") {
      selected = "home";
    } else {
      selected = page;
    }
    this.setActive(selected);
    return this.props.history.push(`/${page}`);
  }

  setActive(elementId) {
    const currentActive = document.getElementById(elementId);
    currentActive.classList.add("active");
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  setCurrentSong(song) {
    if (this.queueShow) {
      setTimeout(() => {
        this.getQueue();
      }, 1);
    }

    this.setState({ currentSong: song });
  }

  playSongNow(song) {
    this.musicPlayer.playSongNow(song);
  }

  playAlbumNow(albumSongs) {
    this.musicPlayer.playAlbumNow(albumSongs);
  }

  playAlbumSongNow(albumSongs, songIdx) {
    this.musicPlayer.playAlbumSongNow(albumSongs, songIdx);
  }

  openModal() {
    this.setState({ modal: true });
  }

  closeModal() {
    this.setState({ modal: false });
  }

  getQueue() {
    let mPQueue = null;
    if (this.musicPlayer) mPQueue = this.musicPlayer.getQueue();
    if (!mPQueue) {
      this.queueShow.setQueue(null);
    }

    const queueData = {
      queue: mPQueue.queue,
      history: mPQueue.history,
      currentSongIdx: mPQueue.currentSongIdx,
      isPlaying: mPQueue.isPlaying,
      currentlyPlaying: this.state.currentSong
    };

    this.queueShow.setQueue(queueData);
  }

  removeActive() {
    let playlistItems = document.getElementsByClassName("nav-name-item");

    for (let i = 0; i < playlistItems.length; i++) {
      let playlist = playlistItems[i];
      playlist.classList.remove("active");
    }
  }

  render() {
    return (
      <Query query={CURRENT_USER_ID}>
        {({ loading, error, data }) => {
          if (loading) {
            return (<div className="loading-main">
            <Loader
              type="Bars"
              color="#2F5451"
              height={100}
              width={100}
            />
          </div>
          )};
          if (error) {
            //force refresh upon login to prevent error form displaying
            window.location.reload();
            return (
              <div className="loading-main">
                <Loader
                  type="Bars"
                  color="#2F5451"
                  height={100}
                  width={100}
                />
              </div>
            )
          }

          const userId = data.currentUserId;
          return (
            <div className="app-container-with-modal">
              <Query
                query={FETCH_USER_PLAYLISTS}
                variables={{ id: data.currentUserId }}
              >
                {({ loading, error, data }) => {
                  if (loading) {
                    return (
                    <div className="loading-main">
                      <Loader
                        type="Bars"
                        color="#2F5451"
                        height={100}
                        width={100}
                      />
                    </div>
                    )};
                  if (error) return <p>error</p>;

                  let userPlaylists = Object.values(
                    data.user.playlists
                  ).reverse();

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
                          <li
                            key="1"
                            onClick={() => this.toPage("")}
                            className="nav-name-item"
                            id="home"
                          >
                            <i className="fas fa-university"></i>
                            <p>Home</p>
                          </li>
                          <li
                            key="2"
                            onClick={() => this.toPage("search")}
                            className="nav-name-item"
                            id="search"
                          >
                            <i className="fas fa-search"></i>
                            <p>Search</p>
                          </li>
                          <li
                            key="3"
                            onClick={() => this.toPage("library")}
                            className="nav-name-item"
                            id="library"
                          >
                            <i className="fas fa-book"></i>
                            <p>Your Library</p>
                          </li>
                        </ul>
                        <h3>PLAYLISTS</h3>

                        <div className="new-playlist" onClick={this.openModal}>
                          <i className="fas fa-plus-square"></i>
                          <p>Create Playlist</p>
                        </div>

                        <PlaylistIndex
                          currentUserId={data.currentUserId}
                          playlists={userPlaylists}
                          removeActive={this.removeActive}
                          setActive={this.setActive}
                        />
                      </aside>
                      <section className="main-container">
                        <Switch>
                          <Route
                            path="/artist/:artistId"
                            render={props => (
                              <ArtistShow
                                {...props}
                                userPlaylists={userPlaylists}
                                playSongNow={this.playSongNow}
                                playAlbumSongNow={this.playAlbumSongNow}
                                currentSong={this.state.currentSong}
                                userId={userId}
                              />
                            )}
                          />
                          <Route
                            path="/album/:albumId"
                            render={props => (
                              <AlbumShow
                                {...props}
                                userPlaylists={userPlaylists}
                                playSongNow={this.playSongNow}
                                playAlbumNow={this.playAlbumNow}
                                playAlbumSongNow={this.playAlbumSongNow}
                                currentSong={this.state.currentSong}
                                onRef={ref => (this.albumShow = ref)}
                                userId={userId}
                              />
                            )}
                          />
                          <Route
                            path="/search"
                            render={props => (
                              <Search
                                currentUserId={userId}
                                userPlaylists={userPlaylists}
                                playSongNow={this.playSongNow}
                                currentSong={this.state.currentSong}
                              />
                            )}
                          />
                          <Route
                            path="/playlist/:playlistId"
                            render={props => (
                              <PlaylistShow
                                {...props}
                                userPlaylists={userPlaylists}
                                playSongNow={this.playSongNow}
                                playAlbumNow={this.playAlbumNow}
                                playAlbumSongNow={this.playAlbumSongNow}
                                currentSong={this.state.currentSong}
                                onRef={ref => (this.playlistShow = ref)}
                                currentUserId={userId}
                              />
                            )}
                          />

                          <Route
                            path="/queue"
                            render={props => (
                              <QueueShow
                                {...props}
                                onRef={ref => (this.queueShow = ref)}
                                getQueue={this.getQueue}
                              />
                            )}
                          />

                          <Route
                            path="/library"
                            render={props => (
                              <Library
                                {...props}
                                playSongNow={this.playSongNow}
                                currentSong={this.state.currentSong}
                                currentUserId={userId}
                                userPlaylists={userPlaylists}
                              />
                            )}
                          />

                          <Route
                            path="/"
                            render={props => (
                              <HomeComponent
                                {...props}
                                setActive={this.setActive}
                              />
                            )}
                            setActive={this.setActive}
                          />
                        </Switch>
                      </section>
                      <div className="music-player">
                        <MusicPlayer
                          onRef={ref => (this.musicPlayer = ref)}
                          setCurrentSong={this.setCurrentSong}
                        />
                      </div>
                    </main>
                  );
                }}
              </Query>
              {this.state.modal ? (
                <div id="modal-outter-container" onClick={this.closeModal}>
                  <div
                    id="modal-innder-container"
                    onClick={e => e.stopPropagation()}
                  >
                    <CreatePlaylist
                      currentUserId={data.currentUserId}
                      closeModal={this.closeModal}
                      removeActive={this.removeActive}
                      currentSong={this.state.currentSong}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(MainComponent);