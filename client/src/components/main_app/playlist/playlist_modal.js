import React from "react";
import { Query, Mutation } from "react-apollo";
import Queries from '../../../graphql/queries';
import Mutations from "../../../graphql/mutations";
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
            
              <button onClick={() => this.addSongToPlaylist(song._id)}>
                ADD
              </button>
            </li>
          );
        }
      });

      let albums = Object.values(data.albums).map(album => {
        if (this.doesMatch(search, album)) {
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
          return (
            <li key={album._id} className="playlist-search-album-item">
              <div className="playlist-search-album-detail">
                <img alt="" />
                <div className="album-detail-text">
                  <p>{album.name}</p>
                  <p>{albumArtists}</p>
                </div>
                <button onClick={() => this.addAlbumToPlaylist(album.songs)}>Add All</button>
              </div>
              <ul className="playlist-search-album-songs">
                {album.songs.map((song, i) => {
                  return (
                    <li key={song._id}>
                      <p>{i + 1}</p>
                      <p>{song.name}</p>
                      <button onClick={() => this.addSongToPlaylist(song._id)}>
                        ADD
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
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

  addAlbumToPlaylist(songs){
    songs.map(song => {
      this.addSongToPlaylist(song._id)
    })
  }

  addSongToPlaylist(songId) {
    const playlistId = this.props.playlistId;
    this.props.addSongToPlaylist({
      variables: {
        playlistId,
        songId
      }
    }).then(() => {
      const songs = this.state.playlistSongs;
      songs.push(songId);
      this.setState({ playlistSongs: songs })
    });
  }

  render() {
    console.log(this.state.playlistSongs);
    let songs, albums;
    if (this.state.songs && this.state.songs.length > 0) {
      songs = this.state.songs.slice(0, 6);
    }
    if (this.state.albums && this.state.albums.length > 0) {
      albums = this.state.albums.slice(0, 6);
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
                  <p>Loading...</p>
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
              </form>
            );
          }}
        </Query>
        {this.state.search === "" ? (
          <div className="playlist-nosearch">
            <h3>Start Typing to begin searching our library!</h3>
          </div>
        ) : (
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