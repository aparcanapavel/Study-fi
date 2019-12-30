import React from "react";
import { Query } from 'react-apollo';
import { withRouter } from "react-router";
import Queries from '../../../graphql/queries';
import Loader from "react-loader-spinner";
// import VoiceSearch from "../../voice_search/voice_search";
import SpeechRecognition from "react-speech-recognition";
import PropTypes from "prop-types";
import SearchSongOptions from "../../song/search_song_options"
const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  audioStart: PropTypes.bool
};

const options = {
  autoStart: false,
};
const { FETCH_ALL } = Queries;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      albums: null,
      songs: null,
      artists: null,
      data: null,
      voice: false,
      listening: false,
      transcript: this.props.transcript,
      voicePlaceholder: null,
      options: null, 
      section: null,
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.toArtist = this.toArtist.bind(this);
    this.toAlbum = this.toAlbum.bind(this);
    this.selectActive = this.selectActive.bind(this);
    this.voiceUpdateSearch = this.voiceUpdateSearch.bind(this);
    this.handleVoice = this.handleVoice.bind(this);
    this.stopVoice = this.stopVoice.bind(this);
  }

  toArtist(artistId) {
    return this.props.history.push(`/artist/${artistId}`);
  }

  toAlbum(albumId) {
    return this.props.history.push(`/album/${albumId}`);
  }

  doesMatch(search, data) {
    for (let i = 0; i < data.name.length; i++) {
      let nameSplit = data.name.slice(i, i + search.length).toLowerCase();
      if (nameSplit === search.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  updateSearch(data) {
    return e => {
      const search = e.target.value;
      let songs = Object.values(data.songs).map(song => {
        if (this.doesMatch(search, song)) {
          let artists = "";
          song.artists.map((artist, i) => {
            if (i === 0) {
              artists += artist.name;
            } else {
              artists += ", " + artist.name;
            }
          });
          
          return (
            <li
              key={song._id}
              className="song-item"
              onClick={() => this.props.playSongNow(song)}
            >
              <img alt="" src={song.album.imageUrl} />
              <div className="song-item-details">
                <p>{song.name}</p>
                <p>{artists}</p>
                
                
                  <SearchSongOptions
                    currentUserId={this.props.currentUserId}
                    userPlaylists={this.props.userPlaylists}
                    options={this.state.options}
                    songId={song._id}
                  />
                
              </div>
            </li>
          );
        }
      });

      let albums = Object.values(data.albums).map(album => {
        if (this.doesMatch(search, album)) {
          let albumArtists = "";
          album.artists.map((artist, i) => {
            if (i === 0) {
              albumArtists += artist.name;
            } else if (i < 2) {
              albumArtists += ", " + artist.name;
            }
          });
          return (
            <li
              key={album._id}
              className="album-item"
              onClick={() => this.toAlbum(album._id)}
            >
              <img alt="" src={album.imageUrl} />
              <p>{album.name}</p>
              <p>{albumArtists}</p>
            </li>
          );
        }
      });

      let artists = Object.values(data.artists).map(artist => {
        if (this.doesMatch(search, artist)) {
          return (
            <li
              key={artist._id}
              className="artist-item"
              onClick={() => this.toArtist(artist._id)}
            >
              <img alt="" src={artist.imageUrl}/>
              <p>{artist.name}</p>
              <p>Artist</p>
            </li>
          );
        }
      });

      songs = Object.values(songs).filter(Boolean);
      albums = Object.values(albums).filter(Boolean);
      artists = Object.values(artists).filter(Boolean);

      this.setState({
        search: search,
        songs: songs,
        albums: albums,
        artists: artists
      });
    };
  }

  voiceUpdateSearch(data, searchTerm) {
      const search = searchTerm;
      let songs = Object.values(data.songs).map(song => {
        if (this.doesMatch(search, song)) {
          let artists = "";
          song.artists.map((artist, i) => {
            if (i === 0) {
              artists += artist.name;
            } else {
              artists += ", " + artist.name;
            }
          });

          return (
            <li
              key={song._id}
              className="song-item"
              onClick={() => this.props.playSongNow(song)}
            >
              <img alt="" src={song.album.imageUrl} />
              <div className="song-item-details">
                <p>{song.name}</p>
                <p>{artists}</p>
                <SearchSongOptions
                  currentUserId={this.props.currentUserId}
                  userPlaylists={this.props.userPlaylists}
                  options={this.state.options}
                  songId={song._id}
                />
              </div>
            </li>
          );
        }
      });

      let albums = Object.values(data.albums).map(album => {
        if (this.doesMatch(search, album)) {
          let albumArtists = "";
          album.artists.map((artist, i) => {
            if (i === 0) {
              albumArtists += artist.name;
            } else if (i < 2) {
              albumArtists += ", " + artist.name;
            }
          });
          return (
            <li
              key={album._id}
              className="album-item"
              onClick={() => this.toAlbum(album._id)}
            >
              <img alt="" src={album.imageUrl} />
              <p>{album.name}</p>
              <p>{albumArtists}</p>
            </li>
          );
        }
      });

      let artists = Object.values(data.artists).map(artist => {
        if (this.doesMatch(search, artist)) {
          return (
            <li
              key={artist._id}
              className="artist-item"
              onClick={() => this.toArtist(artist._id)}
            >
              <img alt="" src={artist.imageUrl} />
              <p>{artist.name}</p>
              <p>Artist</p>
            </li>
          );
        }
      });

      songs = Object.values(songs).filter(Boolean);
      albums = Object.values(albums).filter(Boolean);
      artists = Object.values(artists).filter(Boolean);

      this.setState({
        search: search,
        songs: songs,
        albums: albums,
        artists: artists
      });
 
  };

  selectActive(songs) {
    const currentSong = this.props.currentSong;
    if (currentSong && songs) {
      songs = songs.map(song => {
        if (song.key === currentSong._id) {
          return (
            <li
              id="current-song-element"
              key={song.key}
              className={song.props.className}
            >
              <img alt="" src={song.props.children[0].props.src} />
              <div className="song-item-details">
                <p>{song.props.children[1].props.children[0].props.children}</p>
                <p>{song.props.children[1].props.children[1].props.children}</p>
              </div>
            </li>
          );
        } else {
          return song;
        }
      });
    }
    return songs;
  }

  componentDidUpdate(a, b) {
  
      if (this.state.transcript !== this.props.transcript) {
        this.setState(
          { transcript: this.props.transcript },
          this.voiceUpdateSearch(this.state.data, this.props.transcript)
        );
      } 
    
  }


  handleVoice(data) {
    if (this.state.voice ) {
      this.setState(
        { voicePlaceholder: "Click the Mic for Voice/X to Cancel!", micColor: "white"},
        this.props.stopListening()
        )
      
    } else {
      this.setState({ voice: true, voicePlaceholder: "Start Speaking to Search!", data: data, micColor: "rgb(55, 226, 112)" },
        this.props.startListening()
      );
      
    }
  }

  stopVoice() {
    this.props.resetTranscript();
    this.props.stopListening(); 
    this.setState({voice: false, micColor: "white"});
  }

  render() {
    let songs, artists, albums;
    if (this.state.songs && this.state.songs.length > 0) {
      songs = this.state.songs.slice(0, 6);
    }
    if (this.state.artists && this.state.artists.length > 0) {
      artists = this.state.artists.slice(0, 4);
    }
    if (this.state.albums && this.state.albums.length > 0) {
      albums = this.state.albums.slice(0, 4);
    }

    songs = this.selectActive(songs);

    return (
      <section className="search-container">
        <Query query={FETCH_ALL}>
          {({ loading, error, data }) => {
            if (loading)
              return (
                <div className="search-component">
                  <form className="search-bar">
                    <label htmlFor="search-field" className="search-field-icon">
                      <i className="fas fa-search"></i>
                    </label>
                    <input
                      id="search-field"
                      type="text"
                      value={this.state.search}
                      placeholder="Search for Artists, Songs, or Albums"
                      disabled
                    />
                    {/* <label htmlFor="search-field" className="search-field-x">
                      X
                    </label> */}
                  </form>
                  <div className="search-loading-sym">
                    <Loader
                      type="Bars"
                      color="#2F5451"
                      height={100}
                      width={100}
                    />
                  </div>
                </div>
              );
            if (error) return <p>Error</p>;

            return (
              <div className="search-component">
                <form className="search-bar">
                  <label htmlFor="search-field" className="search-field-icon">
                    <i className="fas fa-search"></i>
                  </label>
                  {this.state.voice || (
                    <input
                      id="search-field"
                      type="text"
                      value={this.state.search}
                      onChange={this.updateSearch(data)}
                      placeholder="Search for Artists, Songs, or Albums"
                    />
                  )}
                  
                  {this.state.voice && (
                    <div className="voice-search">
                      <input
                        readOnly={true}
                        className="voice-search-transcript"
                        value={this.props.transcript}
                        placeholder={this.state.voicePlaceholder}
                      />
                      
                    </div>
                  )}

                  <div className="voice-control-bar">
                  <button
                    id="mic-button"
                    style={{color: this.state.micColor}}
                    className="fas fa-microphone"
                    onClick={() => this.handleVoice(data)}
                  />
                  <button
                    id="mic-reset-button"
                    className="fas fa-redo-alt"
                    onClick={this.props.resetTranscript}
                  />
                  
                  <button
                    id="mic-stop-button" 
                    onClick={this.stopVoice}
                    className="fas fa-microphone-slash"
                  />
                  </div>
                    
                  
                </form>
                {this.state.search === "" ? (
                  <div className="empty-search">
                    <h3>Start typing to begin searching our library!</h3>
                  </div>
                ) : (
                  <div className="search-results" id="search-results">
                    <ul className="search-results-songs" key="5">
                      {songs ? (
                        <div className="search-result-header">
                          <h4>Songs</h4>
                        </div>
                      ) : null}
                      {songs}
                    </ul>
                    <ul className="search-results-artists" key="6">
                      {artists ? (
                        <div className="search-result-header">
                          <h4>Artists</h4>
                        </div>
                      ) : null}
                      {artists}
                    </ul>
                    <ul className="search-results-albums" key="7">
                      {albums ? (
                        <div className="search-result-header">
                          <h4>Albums</h4>
                        </div>
                      ) : null}
                      {albums}
                    </ul>
                  </div>
                )}
              </div>
            );
          }}
        </Query>
      </section>
    );
  }
}

Search.propTypes = propTypes;

export default withRouter(SpeechRecognition(options)(Search));