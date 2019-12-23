import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
import {Link} from "react-router-dom";
import SongOptions from "../../song/song_options";
const { FETCH_PLAYLIST } = Queries;

class PlaylistShow extends React.Component{
  constructor(props){
    super(props)
    this.state = { options: null, section: null }
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
  }

  toggleSongOptions(e, songId, section) {
    e.stopPropagation();
    this.state.options === songId ? this.setState({ options: null, section: null }) : this.setState({ options: songId, section: section });
  }

  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = (int % 60) < 10 ? `0${int % 60}` : (int % 60)
    return `${minutes}:${seconds}`
  }

  render(){
    return (
      <div>
        <Query query={FETCH_PLAYLIST} variables={{id: this.props.match.params.playlistId }}>
          {({loading, error, data}) => {
            if (loading) {
              return <h1>loading</h1>
            } else if (error) {
              return <h1>error</h1>
            } else {
              return (
                <div className="playlist-show">
                  <h1 className="playlist-show-name">{data.playlist.name}</h1>
                  <ul className="" >
                    {data.playlist.songs.map((song, i) => {
                      const currentSong = this.props.currentSong;
                      let songElement;
                      if (currentSong) {
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

                          <i onClick={(e) => this.toggleSongOptions(e, song._id, "popular")} className="fas fa-ellipsis-h"></i>
                          {(this.state.options === song._id && this.state.section === "popular") && <SongOptions section={"popular-song-options-container"} songId={song._id} />}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            }
          }}
        </Query>
      </div>
    )
  }
};

export default PlaylistShow;