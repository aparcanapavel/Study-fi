import React from "react";
import { Query, Mutation } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import Queries from "../../../graphql/queries";
import { Link } from "react-router-dom";
import SongOptions from "../../song/song_options";
import Mutations from "../../../graphql/mutations";
import Loader from "react-loader-spinner";
const { LIKE_SONG, UNLIKE_SONG } = Mutations;
const { FETCH_ALBUM } = Queries;

class ArtistShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: null,
      section: null,
      bool: false
    };
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
    this.updateLike = this.updateLike.bind(this);
    this.updateUnlike = this.updateUnlike.bind(this);
    this.isLiked = this.isLiked.bind(this);
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

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  isLiked(songId, likedSongs){
    for(let i = 0 ; i < likedSongs.length; i++){
      let likedSong = likedSongs[i];
      if(likedSong._id === songId) return true;
    }

    return false
  }

  updateLike(cache, data) {
    let albumShow;
    try {
      albumShow = cache.readQuery({
        query: FETCH_ALBUM,
        variables: {
          id: this.props.match.params.albumId,
          userId: this.props.userId
        }
      });
    } catch (err) {
      return;
    }
    if (albumShow) {

      let song = data.data.addLikedSong;
      let likedSongs = albumShow.user.likedSongs;

      cache.writeQuery({
        query: FETCH_ALBUM,
        variables: {
          id: this.props.match.params.albumId,
          userId: this.props.userId
        },
        data: {
          album: albumShow.album,
          user: {
            _id: this.props.userId,
            likedSongs: likedSongs.push(song),
            __typename: "UserType"
          }
        }
      });
    }
    this.setState({ bool: !this.state.bool });
  }

  updateUnlike(cache, data) {
    let albumShow;
    try {
      albumShow = cache.readQuery({
        query: FETCH_ALBUM,
        variables: {
          id: this.props.match.params.albumId,
          userId: this.props.userId
        }
      });
    } catch (err) {
      return;
    }

    if (albumShow) {
      let likedSongs = albumShow.user.likedSongs;
      let removedSong = data.data.removeLikedSong;
      let resArr = [];
      likedSongs.forEach(song => {
        if(song._id !== removedSong._id){
          resArr.push(song);
        }
      });

      cache.writeQuery({
        query: FETCH_ALBUM,
        variables: {
          id: this.props.match.params.albumId,
          userId: this.props.userId
        },
        data: {
          album: albumShow.album,
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

  handleLike(e, mutation, songId){
    e.stopPropagation();

    mutation({
      variables: {
        songId,
        userId: this.props.userId
      }
    })
  }

  render() {
    return (
      <Query
        query={FETCH_ALBUM}
        variables={{
          id: this.props.match.params.albumId,
          userId: this.props.userId
        }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div className="album-show-loading">
                <Loader type="Bars" color="#2F5451" height={100} width={100} />
              </div>
            );
          if (error) return <p>Error</p>;

          const likedSongs = data.user.likedSongs;

          return (
            <div className="album-show">
              <div className="album-show-header">
                <img
                  className="album-show-icon"
                  src="https://study-fi-public.s3.amazonaws.com/3.jpg"
                  alt="album-icon"
                />
                <div className="album-show-header-details">
                  <h1>Album</h1>
                  <h1 className="album-show-name">{data.album.name}</h1>
                  {Object.values(data.album.artists).length > 2 ? (
                    <h1> by various artists</h1>
                  ) : (
                    <div className="album-show-artists">
                      by
                      {data.album.artists.map(artist => (
                        <Link to={`/artist/${artist._id}`} key={artist._id}>
                          <h1 className="album-show-artist">{artist.name}</h1>
                        </Link>
                      ))}
                    </div>
                  )}
                  <button
                    className="play-album-button"
                    onClick={() => this.props.playAlbumNow(data.album.songs)}
                  >
                    Play
                  </button>
                </div>
              </div>

              <ul className="album-show-songs">
                <li className="album-show-song-header">
                  <h1 className="album-show-song-header-title">Title</h1>
                  <h1 className="album-show-song-header-artist">Artist</h1>
                  <h1>Length</h1>
                </li>
                {data.album.songs.map((song, i) => {
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
                      key={song._id}
                      onClick={() => this.props.playSongNow(song)}
                    >
                      <div className="album-show-song-start">
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
                        <h1 className="album-show-song-name">{song.name}</h1>
                      </div>
                      <div className="album-show-song-artists">
                        {song.artists.map((artist, i) => {
                          let comma = "";
                          if (i === 0 && song.artists.length > 1) {
                            comma = ",";
                          }
                          return (
                            <Link to={`/artist/${artist._id}`} key={artist._id}>
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
          );
        }}
      </Query>
    );
  }
}

export default ArtistShow;