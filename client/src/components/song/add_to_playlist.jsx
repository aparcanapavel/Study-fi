import React from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
import Queries from "../../graphql/queries";
const { FETCH_PLAYLIST } = Queries;
const { ADD_SONG_TO_PLAYLIST } = Mutations;

class AddToPlaylist extends React.Component {
  constructor(props){
    super(props);
    this.addSongToPlaylistFunction = this.addSongToPlaylistFunction.bind(this);
    this.updatePlaylistCache = this.updatePlaylistCache.bind(this);
  };

  addSongToPlaylistFunction(e, addSongToPlaylist, playlistId, songId) {
    e.stopPropagation();
    addSongToPlaylist({
        variables: {
          playlistId,
          songId
        }
    });
    this.props.toggleAddToPlaylist(e);
    this.props.toggleSongOptions(e);
  };

  updatePlaylistCache(cache, data, playlistId) {
    let playlist;
    try {
      playlist = cache.readQuery({
        query: FETCH_PLAYLIST,
        variables: { id: playlistId }
      });
    } catch (err) {
      return;
    }

    if (playlist) {
      let songs = playlist.songs;
      let newSong = data.data.addSongToPlaylist;

      cache.writeQuery({
        query: FETCH_PLAYLIST,
        data: {
          playlist: {
            _id: playlistId,
            songs: songs.concat(newSong)
          }
        }
      });
    }
  }

  render() {
    return(
      <div className="options-playlists-list">
        {this.props.userPlaylists.map((playlist) => {
          return(
            // <h1 className="options-playlists-name">
              <Mutation
                mutation={ADD_SONG_TO_PLAYLIST}
                update={(cache, data) =>
                  this.updatePlaylistCache(cache, data, playlist.id)
                }
              >
                {(addSongToPlaylist, { data }) => (
                  <button
                  className="options-playlists-name"
                  onClick={(e) => this.addSongToPlaylistFunction(e, addSongToPlaylist, playlist._id, this.props.songId)}>
                    {playlist.name}
                  </button>
                )}
              </Mutation>
              
            // </h1>
          )
        })}
      </div>
    )
  }
}

export default AddToPlaylist