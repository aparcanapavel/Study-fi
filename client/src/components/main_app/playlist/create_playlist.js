import React from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../../graphql/mutations";
import Queries from "../../../graphql/queries";
import PlaylistModal from './playlist_modal';
import { withRouter } from "react-router";
const { CREATE_PLAYLIST, ADD_SONG_TO_PLAYLIST } = Mutations;
const { FETCH_USER_PLAYLISTS } = Queries;

class CreatePlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      created: false,
      playlistId: null
    };
    this.updateCache = this.updateCache.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTransition = this.startTransition.bind(this);
    this.toPlaylist = this.toPlaylist.bind(this);
    this.updatePlaylistCache = this.updatePlaylistCache.bind(this);
  }

  toPlaylist() {
    const playlistId = this.state.playlistId;
    if (playlistId) {
      this.props.history.push(`/playlist/${playlistId}`);
      this.props.removeActive();
      const currentPlaylist = document.getElementById(`${playlistId}`);
      currentPlaylist.classList.add("active");

      this.props.closeModal();
    }
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(cache, data) {
    let playlists;
    try {
      playlists = cache.readQuery({
        query: FETCH_USER_PLAYLISTS,
        variables: { id: this.props.currentUserId }
      });
    } catch (err) {
      return;
    }
    
    if (playlists) {
      let playlistArray = playlists.user.playlists;
      let newPlaylist = data.data.createPlaylist;

      console.log("userPlaylists", playlistArray);
      console.log("newPlaylist", newPlaylist);
      
      cache.writeQuery({
        query: FETCH_USER_PLAYLISTS,
        data: {
          user: {
            _id: this.props.currentUserId,
            playlists: playlistArray.concat(newPlaylist)
          }
        }
      });
    }
  }

  updatePlaylistCache(cache, data) {
    let playlists;
    try {
      playlists = cache.readQuery({
        query: FETCH_USER_PLAYLISTS,
        variables: { id: this.props.currentUserId }
      });
    } catch (err) {
      return;
    }

    if (playlists) {
      let playlistArray = playlists.user.playlists;
      let newPlaylist = data.data.createPlaylist;

      cache.writeQuery({
        query: FETCH_USER_PLAYLISTS,
        data: {
          user: {
            _id: this.props.currentUserId,
            playlists: playlistArray.concat(newPlaylist)
          }
        }
      });
    }
  }

  startTransition() {
    const formContainer = document.getElementById("create-playlist-container");

    this.timer = setTimeout(() => {
      const songSearch = document.getElementById("add-songs-modal");
      songSearch.classList.add("show-search");
    }, 300);
    formContainer.classList.add("start-transition");
  }

  handleSubmit(e, createPlaylist) {
    e.preventDefault();
    let name = this.state.name;
    let user = this.props.currentUserId;
    createPlaylist({
      variables: {
        name: name,
        userId: user
      }
    }).then(data => {
      const playlistId = data.data.createPlaylist._id;
      const formTitle = document.getElementById("create-playlist-form");
      formTitle.classList.add("hide-form");

      this.timer2 = setTimeout(() => {
        this.setState(
          {
            message: `New Playlist "${name}" created successfully`,
            created: true,
            playlistId: playlistId
          },
          this.startTransition
        );
      }, 400);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_PLAYLIST}
        update={(cache, data) => this.updateCache(cache, data)}
      >
        {(createPlaylist, { data }) => (
          <section
            className="create-playlist-container"
            id="create-playlist-container"
          >
            {this.state.created ? (
              <div id="add-songs-modal">
                <h4>{this.state.name}</h4>
                <div className="add-songs-search">
                  <Mutation
                    mutation={ADD_SONG_TO_PLAYLIST}
                    // update={(cache, data) =>
                    //   this.updatePlaylistCache(cache, data)
                    // }
                  >
                    {(addSongToPlaylist, { data }) => (
                      <PlaylistModal
                        playlistId={this.state.playlistId}
                        addSongToPlaylist={addSongToPlaylist}
                        currentSong={this.props.currentSong}
                      />
                    )}
                  </Mutation>
                </div>
                <div className="modal-options">
                  <p onClick={this.toPlaylist}>Skip</p>
                  <button onClick={this.toPlaylist}>Done</button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={e => this.handleSubmit(e, createPlaylist)}
                className="create-playlist-form"
                id="create-playlist-form"
              >
                <input
                  id="playlist-name-input"
                  onChange={this.update("name")}
                  value={this.state.name}
                  placeholder="Name"
                />
                <br />
                <button type="submit">Create Playlist</button>
              </form>
            )}
          </section>
        )}
      </Mutation>
    );
  }
}

export default withRouter(CreatePlaylist);