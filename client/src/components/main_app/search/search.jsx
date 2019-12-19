import React from "react";
import { Query } from 'react-apollo';
import Queries from '../../../graphql/queries';
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
        if(this.doesMatch(search, song)){
          let artists = "";
          song.artists.map((artist, i) => {
            if (i === 0) {
              artists += artist.name;
            } else {
              artists += ", " + artist.name;
            }
          });
          return (
            <li key={song._id} className="song-item">
              <img alt="" />
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
            } else if(i < 2){
              albumArtists += ", " + artist.name;
            }
          });
          return (
            <li key={album._id} className="album-item">
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
            <li key={artist._id} className="artist-item">
              <img alt="" />
              <p>{artist.name}</p>
              <p>Artist</p>
            </li>
          );
        }
      });
      // console.log(songs);
      songs = Object.values(songs).filter(Boolean);
      albums = Object.values(albums).filter(Boolean);
      artists = Object.values(artists).filter(Boolean);

      this.setState({ 
        search: search, 
        songs: songs, 
        albums: albums, 
        artists: artists 
      });
    }
  }

  render() {
    let songs, artists, albums;
    if (this.state.songs && this.state.songs.length > 0) {
      // console.log(this.state.songs);
      songs = this.state.songs.slice(0, 6);
    }
    if (this.state.artists && this.state.artists.length > 0) {
      artists = this.state.artists.slice(0, 4);
    }
    if (this.state.albums && this.state.albums.length > 0) {
      albums = this.state.albums.slice(0, 4);
    }
    
    return (
      <section className="search-container">
        <Query query={FETCH_ALL}>
          {({ loading, error, data }) => {
            if (loading) return (
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
                  />
                  <label htmlFor="search-field" className="search-field-x">
                    X
                  </label>
                </form>
                <div className="empty-search">
                  <h3>Start typing to begin searching our library!</h3>
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
                  <div className="search-results">
                    <ul className="search-results-songs" key="5">
                      <div className="search-result-header">
                        <h4>Songs</h4>
                        <p>SEE ALL</p>
                      </div>
                      {songs}
                    </ul>
                    <ul className="search-results-artists" key="6">
                      <div className="search-result-header">
                        <h4>Artists</h4>
                        <p>SEE ALL</p>
                      </div>
                      {artists}
                    </ul>
                    <ul className="search-results-albums" key="7">
                      <div className="search-result-header">
                        <h4>Albums</h4>
                        <p>SEE ALL</p>
                      </div>
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

export default Search