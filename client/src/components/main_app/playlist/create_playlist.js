import React from "react";
import { Mutation } from "react-apollo";
import Mutations from "../../../graphql/mutations";
import Queries from "../../../graphql/queries";
const { CREATE_PLAYLIST } = Mutations;
const { FETCH_USER_PLAYLISTS } = Queries;

class CreatePlaylist extends React.Component {
  constructor(props){
    super(props)
    this.state = {name: ""}
    this.updateCache = this.updateCache.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      this.setState({
        message: `New Playlist "${name}" created successfully`,
        name: "",
      });
    });
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_PLAYLIST}
        update={(cache, data) => this.updateCache(cache, data)}
      >
        {(createPlaylist, { data }) => (
          <section className="create-playlist-container">
            <form onSubmit={e => this.handleSubmit(e, createPlaylist)} className="create-playlist-form">
              <input
                onChange={this.update("name")}
                value={this.state.name}
                placeholder="Name"
              />
              <br/>
              <button type="submit">Create Playlist</button>
            </form>
            <p>{this.state.message}</p>
            {/* render search component uppon finish */}
          </section>
        )}
      </Mutation>
    );
  }
}

export default CreatePlaylist;