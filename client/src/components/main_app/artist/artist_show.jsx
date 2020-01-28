import React from "react";
import { Query, Mutation } from "react-apollo";
import Queries from "../../../graphql/queries";
import { Link } from "react-router-dom";
import SongOptions from "../../song/song_options";
import Mutations from "../../../graphql/mutations";
import Loader from "react-loader-spinner";
const { LIKE_SONG, UNLIKE_SONG } = Mutations;
const { FETCH_ARTIST } = Queries;

class ArtistShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      options: null, 
      section: null ,
      bool: false
    };
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
    this.updateLike = this.updateLike.bind(this);
    this.updateUnlike = this.updateUnlike.bind(this);
    this.handleLike = this.handleLike.bind(this);
  }

  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = int % 60 < 10 ? `0${int % 60}` : int % 60;
    return `${minutes}:${seconds}`;
  }

  toggleSongOptions(e, songId, section) {
    e.stopPropagation();
    this.state.options === songId
      ? this.setState({ options: null, section: null })
      : this.setState({ options: songId, section: section });
  }

  isLiked(songId, likedSongs) {
    for (let i = 0; i < likedSongs.length; i++) {
      let likedSong = likedSongs[i];
      if (likedSong._id === songId) return true;
    }

    return false;
  }

  updateLike(cache, data) {
    let artistShow;
    try {
      artistShow = cache.readQuery({
        query: FETCH_ARTIST,
        variables: {
          id: this.props.match.params.artistId,
          userId: this.props.userId
        }
      });
    } catch (err) {
      return;
    }

    if (artistShow) {
      let song = data.data.addLikedSong;
      let likedSongs = artistShow.user.likedSongs.concat(song);

      cache.writeQuery({
        query: FETCH_ARTIST,
        variables: {
          songId: this.props.match.params.artistId,
          userId: this.props.userId
        },
        data: {
          artist: artistShow.artist,
          user: {
            _id: this.props.userId,
            likedSongs,
            __typename: "UserType"
          }
        }
      });
    }
    this.setState({ bool: !this.state.bool });
  }

  updateUnlike(cache, data) {
    let artistShow;
    try {
      artistShow = cache.readQuery({
        query: FETCH_ARTIST,
        variables: {
          id: this.props.match.params.artistId,
          userId: this.props.userId
        }
      });
    } catch (err) {
      return;
    }

    if (artistShow) {
      let likedSongs = artistShow.user.likedSongs;
      let removedSong = data.data.removeLikedSong;
      let resArr = [];
      likedSongs.forEach(song => {
        if (song._id !== removedSong._id) {
          resArr.push(song);
        }
      });

      cache.writeQuery({
        query: FETCH_ARTIST,
        variables: {
          id: this.props.match.params.artistId,
          userId: this.props.userId
        },
        data: {
          artist: artistShow.artist,
          user: {
            _id: this.props.userId,
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
        userId: this.props.userId
      }
    });
  }

  render() {
    return (
      <Query
        query={FETCH_ARTIST}
        variables={{
          id: this.props.match.params.artistId,
          userId: this.props.userId
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return (
            <div className="album-show-loading">
              <Loader
                type="Bars"
                color="#2F5451"
                height={100}
                width={100}
              />
            </div>
          );
          if (error) {
            return <p>Error</p>;
          }

          const likedSongs = data.user.likedSongs;
          
          return (
            <div className="artist-show-div">
              <div className="artist-show-header">
                <img
                  className="artist-show-icon"
                  alt={data.artist.name}
                  src={data.artist.imageUrl}
                />
                <div className="artist-show-name-header">
                  <h1 className="artist-show-name-tag">ARTIST</h1>
                  <h1 className="artist-show-name">{data.artist.name}</h1>
                </div>
              </div>

              <h1 className="artist-show-songs-header">Popular</h1>

              <ul className="artist-show-songs">
                {data.artist.songs.map((song, i) => {
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
                      className="artist-show-song"
                      key={song._id}
                      onClick={() =>
                        this.props.playAlbumSongNow(data.artist.songs, i)
                      }
                    >
                      <div className="artist-show-song-header">
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
                                  this.handleLike(e, removeLikedSong, song._id)
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

                        <img
                          className="song-album-icon"
                          src={song.album.imageUrl}
                          alt="album"
                        />
                        <h1 className="song-index">{i + 1}</h1>
                        <h1 className="artist-show-song-name">{song.name}</h1>
                      </div>
                      <i
                        id="ellipsis-icon"
                        onClick={e =>
                          this.toggleSongOptions(e, song._id, "popular")
                        }
                        className="fas fa-ellipsis-h"
                      ></i>
                      {this.state.options === song._id &&
                        this.state.section === "popular" && (
                          <SongOptions
                            userPlaylists={this.props.userPlaylists}
                            section={"popular-song-options-container"}
                            songId={song._id}
                            toggleSongOptions={this.toggleSongOptions}
                          />
                        )}
                    </li>
                  );
                })}
              </ul>

              <h1 className="artist-show-albums-header">Albums</h1>

              <ul className="artist-show-albums">
                {data.artist.albums.map(album => (
                  <li className="artist-show-album" key={album._id}>
                    <div className="artist-show-album-header">
                      <img
                        className="album-icon"
                        src={album.imageUrl}
                        alt="album-icon"
                      />
                      <div className="artist-show-album-header-name">
                        <h1 className="artist-show-album-year">{album.year}</h1>
                        <Link to={`/album/${album._id}`}>
                          <h1 className="artist-show-album-name">
                            {album.name}
                          </h1>
                        </Link>
                      </div>
                    </div>
                    <div className="artist-show-album-songs">
                      <ul className="artist-show-album-songs-list">
                        {album.songs.map((song, i) => {
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
                              key={song._id}
                              id={songElement}
                              className="artist-show-album-song"
                              onClick={() => this.props.playSongNow(song)}
                            >
                              <div className="artist-show-album-song-header">
  
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
                                          this.handleLike(
                                            e,
                                            addLikedSong,
                                            song._id
                                          )
                                        }
                                      ></i>
                                    )}
                                  </Mutation>
                                )}
                                <h1 className="artist-show-album-song-name">
                                  {song.name}
                                </h1>
                              </div>
                              <h1 className="artist-show-album-song-duration">
                                {this.parseTime(song.duration)}
                              </h1>
                              <i
                                id="ellipsis-icon"
                                onClick={e =>
                                  this.toggleSongOptions(e, song._id, "album")
                                }
                                className="fas fa-ellipsis-h"
                              ></i>
                              {this.state.options === song._id &&
                                this.state.section === "album" && (
                                  <SongOptions
                                    userPlaylists={this.props.userPlaylists}
                                    section={"popular-song-options-container"}
                                    songId={song._id}
                                    toggleSongOptions={this.toggleSongOptions}
                                  />
                                )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ArtistShow;