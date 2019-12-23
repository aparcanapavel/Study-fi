import React from "react";
import { Query } from 'react-apollo';
import { withRouter } from "react-router";
import Queries from '../../../graphql/queries';
import Loader from "react-loader-spinner";
const { FETCH_ALL } = Queries;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      albums: null,
      songs: null,
      artists: null,
      data: null
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.toArtist = this.toArtist.bind(this);
    this.toAlbum = this.toAlbum.bind(this);
    this.selectActive = this.selectActive.bind(this);
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
              <img alt="" src="" />
              <div className="song-item-details">
                <p>{song.name}</p>
                <p>{artists}</p>
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
              <img alt="" />
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
              <img alt="" />
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
              onClick={() => this.props.playSongNow(song)}
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
                    <label htmlFor="search-field" className="search-field-x">
                      X
                    </label>
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
                  <input
                    id="search-field"
                    type="text"
                    value={this.state.search}
                    onChange={this.updateSearch(data)}
                    placeholder="Search for Artists, Songs, or Albums"
                  />
                  <label htmlFor="search-field" className="search-field-x">
                    X
                  </label>
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
                          <p>SEE ALL</p>
                        </div>
                      ) : null}
                      {songs}
                    </ul>
                    <ul className="search-results-artists" key="6">
                      {artists ? (
                        <div className="search-result-header">
                          <h4>Artists</h4>
                          <p>SEE ALL</p>
                        </div>
                      ) : null}
                      {artists}
                    </ul>
                    <ul className="search-results-albums" key="7">
                      {albums ? (
                        <div className="search-result-header">
                          <h4>Albums</h4>
                          <p>SEE ALL</p>
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

export default withRouter(Search);