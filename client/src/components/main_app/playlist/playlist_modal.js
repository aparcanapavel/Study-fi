import React from "react";
import { Query, Mutation } from "react-apollo";
import Queries from '../../../graphql/queries';
import Mutations from "../../../graphql/mutations";
import Loader from "react-loader-spinner";
const { ADD_SONG_TO_PLAYLIST } = Mutations;
const { FETCH_FOR_PLAYLIST } = Queries;


class PlaylistModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      albums: null,
      songs: null,
      playlistSongs: []
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.addAlbumToPlaylist = this.addAlbumToPlaylist.bind(this);
    this.popupateSongs = this.popupateSongs.bind(this);
    this.popupateAlbums = this.popupateAlbums.bind(this);
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
          return song;
        }
      });

      let albums = Object.values(data.albums).map(album => {
        if (this.doesMatch(search, album)) {
          return album;
        }
      });

      songs = Object.values(songs).filter(Boolean);
      albums = Object.values(albums).filter(Boolean);

      this.setState({
        search: search,
        songs: songs,
        albums: albums
      });
    };
  }

  addAlbumToPlaylist(songs) {
    songs.map(song => {
      if (!this.state.playlistSongs.includes(song._id)){
        this.addSongToPlaylist(song._id);
      }
    });
  }

  addSongToPlaylist(songId) {
    const playlistId = this.props.playlistId;
    this.props
      .addSongToPlaylist({
        variables: {
          playlistId,
          songId
        }
      })
      .then(() => {
        const songs = this.state.playlistSongs;
        songs.push(songId);
        this.setState({ playlistSongs: songs });
      });
  }

  popupateSongs(songs){
    return Object.values(songs).map(song => {
      let artists = "";
      if (Object.values(song.artists).length > 2) {
        artists = "Various Artists";
      } else {
        song.artists.map((artist, i) => {
          if (i === 0) {
            artists += artist.name;
          } else {
            artists += ", " + artist.name;
          }
        });
      }

      return (
        <li key={song._id} className="song-item">
          <img alt="" />
          <div className="song-item-details">
            <p key="8">{song.name}</p>
            <p key="9">{artists}</p>
          </div>

          {this.state.playlistSongs.includes(song._id) ? (
            null
          ) : (
            <button onClick={() => this.addSongToPlaylist(song._id)}>
            ADD
            </button>
          )}
          
        </li>
      );
    });
  }

  popupateAlbums(albums){
    return Object.values(albums).map(album => {
      let albumArtists = "";
      if (Object.values(album.artists).length > 2) {
        albumArtists = "Various Artists";
      } else {
        album.artists.map((artist, i) => {
          if (i === 0) {
            albumArtists += artist.name;
          } else if (i < 2) {
            albumArtists += ", " + artist.name;
          }
        });
      }
      let albumButton = album.songs.every(song => this.state.playlistSongs.includes(song._id));
      return (
        <li key={album._id} className="playlist-search-album-item">
          <div className="playlist-search-album-detail">
            <img alt="" />
            <div className="album-detail-text">
              <p>{album.name}</p>
              <p>{albumArtists}</p>
            </div>

            {albumButton ? null : (
              <button onClick={() => this.addAlbumToPlaylist(album.songs)}>
                ADD
              </button>
            )}
          </div>
          <ul className="playlist-search-album-songs">
            {album.songs.map((song, i) => {
              return (
                <li key={song._id}>
                  <p>{i + 1}</p>
                  <p>{song.name}</p>

                  {this.state.playlistSongs.includes(song._id) ? null : (
                    <button onClick={() => this.addSongToPlaylist(song._id)}>
                      ADD
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </li>
      );
    });
  }

  render() {
    let songs, albums;
    if (this.state.songs && this.state.songs.length > 0){
      songs = this.popupateSongs(this.state.songs).slice(0, 6);
    }
    if (this.state.albums && this.state.albums.length > 0) {
      albums = this.popupateAlbums(this.state.albums);
    }

      return (
        <div id="playlist">
          <Query query={FETCH_FOR_PLAYLIST}>
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <form>
                    <input
                      type="text"
                      id="playlist-search-bar"
                      placeholder="Search For Songs, Albums, Or Artists To Add To Your Playlist"
                      value={this.state.search}
                      onChange={e => console.log(e.target.value)}
                      disabled
                    />
                    <div className="loading-sym">
                      <Loader
                        type="Bars"
                        color="#2F5451"
                        height={100}
                        width={100}
                      />
                    </div>
                  </form>
                );

              if (error) return <p>Error</p>;

              return (
                <form>
                  <input
                    type="text"
                    id="playlist-search-bar"
                    placeholder="Search For Songs, Albums, Or Artists To Add To Your Playlist"
                    value={this.state.search}
                    onChange={this.updateSearch(data)}
                  />

                  {this.state.search === "" ? (
                    <div className="playlist-nosearch">
                      <h3>Start Typing to begin searching our library!</h3>
                    </div>
                  ) : null}
                </form>
              );
            }}
          </Query>
          {this.state.search === "" ? null : (
            <div className="playlist-search-results">
              <ul className="playlist-results-songs" key="5">
                {songs ? (
                  <div className="playlist-result-header">
                    <h4>Songs</h4>
                  </div>
                ) : null}
                {songs}
              </ul>
              <ul className="playlist-results-albums" key="6">
                {albums ? (
                  <div className="playlist-result-header">
                    <h4>Albums</h4>
                  </div>
                ) : null}
                {albums}
              </ul>
            </div>
          )}
        </div>
      );
  }
}

export default PlaylistModal;