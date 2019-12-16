import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Query, ApolloConsumer, Mutation } from "react-apollo";
import Queries from "../../graphql/queries";
import Mutations from '../../graphql/mutations';
const { CREATE_SONG } = Mutations;
 
class UserShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      name: "",
      artist: "",
      album: "",
      URL: "",
      duration: 0
    };
  }

  handleSubmit(e, createSong) {
    e.preventDefault();
    const minutes = Math.floor(this.state.duration / 60);
    const seconds = this.state.duration - minutes * 60;
    createSong({
      variables: {
        name: this.state.name,
        artist: this.state.artist,
        duration: this.state.duration,
        album: this.state.album
      }
    }).then(() => {
      this.setState({
        message: "",
        name: "",
        artist: "",
        album: "",
        URL: "",
        duration: 0
      });
    });
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_SONG}
        update={(cache, data) => this.updateCache(cache, data)}
        onCompleted={data => {
          const { name, artist, album } = data.createSong;
          this.setState({
            message: `${name} by ${artist} has been created`
          });
        }}
      >
        {(createSong, { data }) => (
          <div>
            <form onSubmit={e => this.handleSubmit(e, createSong)}>
              <input
                onChange={this.update("name")}
                value={this.state.name}
                placeholder="Song name"
              />
              <textarea
                onChange={this.update("artist")}
                value={this.state.artist}
                placeholder="artist"
              />
              <input
                onChange={this.update("duration")}
                value={this.state.duration}
                placeholder="duration in seconds"
                type="number"
              />

              <input
                onChange={this.update("album")}
                value={this.state.album}
                placeholder="album"
                type="text"
              />
              <button type="submit">Create Song</button>
            </form>
            <p>{this.state.message}</p>
          </div>
        )}
      </Mutation>
    );
  }
}

export default UserShow;