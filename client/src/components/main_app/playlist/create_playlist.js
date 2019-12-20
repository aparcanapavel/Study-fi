import React from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../../graphql/mutations";
import Queries from "../../../graphql/queries";
import PlaylistModal from './playlist_modal';
const { CREATE_PLAYLIST } = Mutations;
const { FETCH_USER_PLAYLISTS } = Queries;

class CreatePlaylist extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: "",
      created: false
    }
    this.updateCache = this.updateCache.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTransition = this.startTransition.bind(this);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(cache, { data }) {
    let playlists;
    try {
      playlists = cache.readQuery({ query: FETCH_USER_PLAYLISTS });
    } catch (err) {
      return;
    }

    if (playlists) {
      let playlistArray = playlists.playlists;
      let newPlaylist = data.newPlaylist;
      cache.writeQuery({
        query: FETCH_USER_PLAYLISTS,
        data: { playlists: playlistArray.concat(newPlaylist) }
      });
    }
  }

  startTransition() {
    const formContainer = document.getElementById("create-playlist-container");
    
    this.timer = setTimeout(() => {
      const songSearch = document.getElementById("add-songs-modal");
      songSearch.classList.add("show-search")
    }, 300);
    formContainer.classList.add("start-transition");
  }

  handleSubmit(e, createPlaylist) {
    e.preventDefault();
    let name = this.state.name;
    let user = this.props.currentUserId
    createPlaylist({
      variables: {
        name: name,
        userId: user
      }
    }).then(data => {
      const formTitle = document.getElementById("create-playlist-form");
      formTitle.classList.add("hide-form");
      this.timer2 = setTimeout(() => {
        this.setState({
            message: `New Playlist "${name}" created successfully`,
            created: true
          },
          this.startTransition
        );
      }, 400);
    });
  }

  componentWillUnmount(){
    clearTimeout(this.timer);
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
                  <PlaylistModal />
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

export default CreatePlaylist;