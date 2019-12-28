import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
import { Link } from "react-router-dom";
import SongOptions from "../../song/song_options";
const { FETCH_ARTIST } = Queries;

class ArtistShow extends React.Component {
  constructor(props){
    super(props);
    this.state = {options: null, section: null}
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
  }

  parseTime(int){
    let minutes = Math.floor(int/60);
    let seconds = (int%60) < 10 ? `0${int%60}` : (int%60)
    return `${minutes}:${seconds}`
  }

  toggleSongOptions(e, songId, section) {
    e.stopPropagation();
    this.state.options === songId ? this.setState({ options: null, section: null }) : this.setState({ options: songId, section: section });
  }

  render(){
    return(
      <Query query={FETCH_ARTIST} variables={{id: this.props.match.params.artistId}}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;
          return (
            <div className="artist-show-div">
              <div className="artist-show-header">
                <img className="artist-show-icon" alt={data.artist.name} src="https://study-fi-public.s3.amazonaws.com/default-profile.png" />
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
                      onClick={() => this.props.playSongNow(song)}
                    >
                      <div className="artist-show-song-header">
                      <img
                        className="song-album-icon"
                        src="https://study-fi-public.s3.amazonaws.com/3.jpg"
                        alt="album"
                      />
                      <h1 className="song-index">{i + 1}</h1>
                      {/* <i className="far fa-play-circle"></i> */}
                      <h1 className="artist-show-song-name">{song.name}</h1>
                      </div>
                      <i onClick={(e) => this.toggleSongOptions(e, song._id, "popular")} className="fas fa-ellipsis-h"></i>
                      {(this.state.options === song._id && this.state.section === "popular") && 
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

              <h1 className="artist-show-albums-header">Albums</h1>

              <ul className="artist-show-albums">
              {data.artist.albums.map((album) =>(
                <li className="artist-show-album" key={album._id}>
                  <div className="artist-show-album-header">
                    <img className="album-icon" src="https://study-fi-public.s3.amazonaws.com/3.jpg" alt="album-icon" />
                    <div className="artist-show-album-header-name">
                      <h1 className="artist-show-album-year">{album.year}</h1>
                      <Link to={`/album/${album._id}`}><h1 className="artist-show-album-name">{album.name}</h1></Link>
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

                        return <li 
                        id={songElement}
                        className="artist-show-album-song" 
                        onClick={() => this.props.playSongNow(song)}>
                          <div className="artist-show-album-song-header">
                            <h1 className="artist-show-album-index">{i + 1}</h1>
                            <h1 className="artist-show-album-song-name">{song.name}</h1>
                          </div>
                          <h1 className="artist-show-album-song-duration">{this.parseTime(song.duration)}</h1>
                          <i onClick={(e) => this.toggleSongOptions(e, song._id, "album")} className="fas fa-ellipsis-h"></i>
                          {(this.state.options === song._id && this.state.section === "album") && 
                          <SongOptions
                            userPlaylists={this.props.userPlaylists} 
                            section={"popular-song-options-container"} 
                            songId={song._id} 
                            toggleSongOptions={this.toggleSongOptions} 
                          />}
                        </li>
                      })}
                      </ul>
                    </div>
                  
                </li>
              ))}
              </ul>
              
              
            </div>
          )
        }}
      </Query>
    )
  }
}

export default ArtistShow;