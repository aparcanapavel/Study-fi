import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
import { Link } from "react-router-dom";
import SongOptions from "../../song/song_options";
const { FETCH_ALBUM } = Queries;

class ArtistShow extends React.Component {
  constructor(props){
    super(props);
    this.state = { options: null, section: null }
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
  }
  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = int % 60 < 10 ? `0${int % 60}` : int % 60;
    return `${minutes}:${seconds}`;
  }

  toggleSongOptions(e, songId, section) {
    e.stopPropagation();
    this.state.options === songId ? this.setState({ options: null, section: null }) : this.setState({ options: songId, section: section });
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {

    return (
      <Query
        query={FETCH_ALBUM}
        variables={{ id: this.props.match.params.albumId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;
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
                  if(currentSong){
                    songElement = currentSong._id === song._id ? "current-song-element" : null;
                  }
                  return (
                    <li
                      id={songElement}
                      className="album-show-song"
                      key={song._id}
                      onClick={() => this.props.playSongNow(song)}
                    >
                      <div className="album-show-song-start">
                        <h1 className="album-show-song-index">{i + 1}</h1>
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
                      <i onClick={(e) => this.toggleSongOptions(e, song._id, "album")} className="fas fa-ellipsis-h"></i>
                      {(this.state.options === song._id && this.state.section === "album") &&
                        <SongOptions
                          userPlaylists={this.props.userPlaylists}
                          section={"popular-song-options-container"}
                          songId={song._id}
                          toggleSongOptions={this.toggleSongOptions}
                        />}
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