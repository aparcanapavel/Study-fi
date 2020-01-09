import React from "react";
import { Query, Mutation } from "react-apollo";
import Mutations from "../../../graphql/mutations";
import Queries from "../../../graphql/queries";
import {Link} from "react-router-dom";
import { withRouter } from "react-router";
import SongOptions from "../../song/song_options";
import Loader from "react-loader-spinner"

const { REMOVE_USER_PLAYLIST, LIKE_SONG, UNLIKE_SONG } = Mutations;
const { FETCH_PLAYLIST, FETCH_USER_PLAYLISTS } = Queries;

class PlaylistShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: null,
      section: null,
      bool: false,
      playlistOptions: false
    };
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
    this.updateCache = this.updateCache.bind(this);
    this.togglePlaylistOptions = this.togglePlaylistOptions.bind(this);
    this.removePlaylist = this.removePlaylist.bind(this);
    this.updateLike = this.updateLike.bind(this);
    this.updateUnlike = this.updateUnlike.bind(this);
    this.handleLike = this.handleLike.bind(this);
  }

  toggleSongOptions(e, songId, section) {
    e.stopPropagation();
    this.state.options === songId
      ? this.setState({ options: null, section: null })
      : this.setState({ options: songId, section: section });
  }

  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = int % 60 < 10 ? `0${int % 60}` : int % 60;
    return `${minutes}:${seconds}`;
  }

  updateCache(cache, data) {
    let playlists;
    try {
      playlists = cache.readQuery({
        query: FETCH_USER_PLAYLISTS,
        variables: { id: this.props.currentUserId }
      });
    } catch (err) {
      return;
    }

    if (playlists) {
      let playlistArray = playlists.user.playlists;
      let deletedPlaylist = data.data.removeUserPlaylist;
      let newPlaylistArray = [];
      playlistArray.forEach((playlist, i) => {
        if (playlist._id !== deletedPlaylist._id) {
          newPlaylistArray.push(playlist);
        }
      });

      cache.writeQuery({
        query: FETCH_USER_PLAYLISTS,
        data: {
          user: {
            _id: this.props.currentUserId,
            playlists: newPlaylistArray
          }
        }
      });
    }
  }

  removePlaylist(e, mutation) {
    const playlistId = this.props.match.params.playlistId;
    const userId = this.props.currentUserId;
    mutation({
      variables: {
        playlistId,
        userId
      }
    }).then(() => {
      this.props.history.push("/");
    });
  }

  togglePlaylistOptions() {
    this.setState({playlistOptions: !this.state.playlistOptions})
  }

  isLiked(songId, likedSongs) {
    for (let i = 0; i < likedSongs.length; i++) {
      let likedSong = likedSongs[i];
      if (likedSong._id === songId) return true;
    }

    return false;
  }

  updateLike(cache, data) {
    let playlistShow;
    try {
      playlistShow = cache.readQuery({
        query: FETCH_PLAYLIST,
        variables: {
          id: this.props.match.params.playlistId,
          userId: this.props.currentUserId
        }
      });
    } catch (err) {
      return;
    }

    if (playlistShow) {
      let song = data.data.addLikedSong;
      let likedSongs = playlistShow.user.likedSongs.concat(song);

      cache.writeQuery({
        query: FETCH_PLAYLIST,
        variables: {
          songId: this.props.match.params.playlistId,
          userId: this.props.currentUserId
        },
        data: {
          playlist: playlistShow.playlist,
          user: {
            _id: this.props.currentUserId,
            likedSongs,
            __typename: "UserType"
          }
        }
      });
    }
    this.setState({ bool: !this.state.bool });
  }

  updateUnlike(cache, data) {
    let playlistShow;
    try {
      playlistShow = cache.readQuery({
        query: FETCH_PLAYLIST,
        variables: {
          id: this.props.match.params.playlistId,
          userId: this.props.currentUserId
        }
      });
    } catch (err) {
      return;
    }

    if (playlistShow) {
      let likedSongs = playlistShow.user.likedSongs;
      let removedSong = data.data.removeLikedSong;
      let resArr = [];
      likedSongs.forEach(song => {
        if (song._id !== removedSong._id) {
          resArr.push(song);
        }
      });

      cache.writeQuery({
        query: FETCH_PLAYLIST,
        variables: {
          id: this.props.match.params.playlistId,
          userId: this.props.currentUserId
        },
        data: {
          playlist: playlistShow.playlist,
          user: {
            _id: this.props.currentUserId,
            likedSongs: resArr,
            __typename: "UserType"
          }
        }
      });
    }

    this.setState({ bool: !this.state.bool });
  }

  handleLike(e, mutation, songId) {
    e.stopPropagation();

    mutation({
      variables: {
        songId,
        userId: this.props.currentUserId
      }
    });
  }

  render() {
    return (
      <div>
        <Query
          query={FETCH_PLAYLIST}
          variables={{ 
            id: this.props.match.params.playlistId,
            userId: this.props.currentUserId
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <div className="album-show-loading">
                  <Loader
                    type="Bars"
                    color="#2F5451"
                    height={100}
                    width={100}
                  />
                </div>
              );
            } else if (error) {
              return <h1>error</h1>;
            } else {
              let images = data.playlist.songs.map((song, i) => {
                if (i < 4) {
                  return (
                    <img src={song.album.imageUrl} alt="" key={i} />
                  );
                }
              });

              const likedSongs = data.user.likedSongs;

              return (
                <div className="playlist-show">
                  <Mutation
                    mutation={REMOVE_USER_PLAYLIST}
                    update={(cache, data2) => this.updateCache(cache, data2)}
                  >
                    {(removeUserPlaylist, { data2 }) => {
                      return (
                        <div className="playlist-show-top">
                          <div className="albums-window">{images}</div>

                          <div className="playlist-details">
                            <h2>{data.playlist.name}</h2>

                            <button
                              className="play-playlist"
                              onClick={() =>
                                this.props.playAlbumNow(data.playlist.songs)
                              }
                            >
                              Play
                            </button>

                            <i className="fas fa-ellipsis-h" onClick={this.togglePlaylistOptions} />

                            { this.state.playlistOptions &&
                            <div className="playlist-options-modal"> 
                            <button
                              className=""
                              onClick={e =>
                                this.removePlaylist(
                                  e,
                                  removeUserPlaylist
                                )
                              }
                            >Delete Playlist</button>
                            </div>
                            }
                          </div>
                        </div>
                      );
                    }}
                  </Mutation>
                  <ul className="">
                    {data.playlist.songs.map((song, i) => {
                      const currentSong = this.props.currentSong;
                      let songElement;
                      if (currentSong) {
                        songElement =
                          currentSong._id === song._id
                            ? "current-song-element"
                            : null;
                      }
                      return (
                        <li
                          id={songElement}
                          className="album-show-song"
                          key={i+4}
                          onClick={() => this.props.playSongNow(song)}
                        >
                          <div className="album-show-song-start">
                            {/* <h1 key="song-heart" className="far fa-heart"></h1> */}
                            {this.isLiked(song._id, likedSongs) ? (
                              <Mutation
                                mutation={UNLIKE_SONG}
                                update={(cache, data) =>
                                  this.updateUnlike(cache, data)
                                }
                              >
                                {(removeLikedSong, { data }) => (
                                  <i
                                    key="song-heart"
                                    className="fas fa-heart"
                                    onClick={e =>
                                      this.handleLike(
                                        e,
                                        removeLikedSong,
                                        song._id
                                      )
                                    }
                                  ></i>
                                )}
                              </Mutation>
                            ) : (
                              <Mutation
                                mutation={LIKE_SONG}
                                update={(cache, data) =>
                                  this.updateLike(cache, data)
                                }
                              >
                                {(addLikedSong, { data }) => (
                                  <i
                                    key="song-heart"
                                    className="far fa-heart"
                                    onClick={e =>
                                      this.handleLike(e, addLikedSong, song._id)
                                    }
                                  ></i>
                                )}
                              </Mutation>
                            )}

                            <h1 className="album-show-song-name">
                              {song.name}
                            </h1>
                          </div>
                          <div className="album-show-song-artists">
                            {song.artists.map((artist, i) => {
                              let comma = "";
                              if (i === 0 && song.artists.length > 1) {
                                comma = ",";
                              }
                              return (
                                <Link
                                  to={`/artist/${artist._id}`}
                                  key={artist._id}
                                >
                                  <h1 className="album-show-artist-name">
                                    {artist.name + comma}
                                  </h1>
                                </Link>
                              );
                            })}
                          </div>
                          <h1 className="album-show-song-duration">
                            {this.parseTime(song.duration)}
                          </h1>

                          <i
                            onClick={e =>
                              this.toggleSongOptions(e, song._id, "popular")
                            }
                            className="fas fa-ellipsis-h"
                          ></i>
                          {this.state.options === song._id &&
                            this.state.section === "popular" && (
                              <SongOptions
                                toggleSongOptions={this.toggleSongOptions}
                                currentUserId={this.props.currentUserId}
                                userPlaylists={this.props.userPlaylists}
                                section={"popular-song-options-container"}
                                songId={song._id}
                              />
                            )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }
          }}
        </Query>
      </div>
    );
  }
};

export default withRouter(PlaylistShow);