import React from "react";
import Queries from "../../../graphql/queries";
import Mutations from "../../../graphql/mutations";
import { Query, Mutation } from "react-apollo";
import SongOptions from "../../song/song_options";
import Loader from "react-loader-spinner";
// import SongOptions from "../../song/song_options";
const { FIND_LIKED_SONGS } = Queries;
const { UNLIKE_SONG, LIKE_SONG } = Mutations;

class LikedSongs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      options: null,
      section: null,
      bool: false
    };
    this.toggleSongOptions = this.toggleSongOptions.bind(this);
  }

  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = int % 60 < 10 ? `0${int % 60}` : int % 60;
    return `${minutes}:${seconds}`;
  }

  toggleSongOptions(e, songId, section) {
    e.stopPropagation();
    this.state.options === songId
      ? this.setState({ options: null, section: null })
      : this.setState({ options: songId, section: section });
  }

  isLiked(songId, likedSongs) {
    for (let i = 0; i < likedSongs.length; i++) {
      let likedSong = likedSongs[i];
      if (likedSong._id === songId) return true;
    }

    return false;
  }


  handleLike(e, mutation, songId) {
    e.stopPropagation();

    mutation({
      variables: {
        songId,
        userId: this.props.userId
      }
    });
  }

  render() {
    return (
      <ul className="liked-library-ul">
        <Query query={ FIND_LIKED_SONGS } 
          variables={{id: this.props.currentUserId}}
          fetchPolicy="no-cache"
        >
          {({ loading, error, data }) => {
            if (loading) {
              return (
              <div className="album-show-loading">
                <Loader
                  type="Bars"
                  color="#2F5451"
                  height={100}
                  width={100}
                />
              </div>
              )
            };
            if (error) {
            return <p>error</p>
          };


              return data.user.likedSongs.map((song, i) => {
              
                const currentSong = this.props.currentSong;
                let songElement;
                if (currentSong) {
              songElement =
                currentSong._id === song._id
                  ? "current-song-element"
                  : null;
              }
              return (
                <li
                  id={songElement}
                  className="artist-show-song"
                  key={song._id}
                  onClick={() => this.props.playSongNow(song)}
                >
                <div className="artist-show-song-header">


                    {/* <Mutation
                      mutation={UNLIKE_SONG}
                      update={(cache, data) =>
                        this.updateUnlike(cache, data)
                      }
                    >
                      {(removeLikedSong, { data }) => (
                        <i
                          key="song-heart"
                          className="fas fa-heart"
                          onClick={e =>
                            this.handleLike(e, removeLikedSong, song._id)
                          }
                        ></i>
                      )}
                    </Mutation> */}
                    <i
                      key="song-heart"
                      id="song-heart"
                      className="fas fa-heart"
                    ></i>

                  <img
                    className="song-album-icon"
                    src={song.album.imageUrl}
                    alt="album"
                  />
                  <h1 className="song-index">{i + 1}</h1>
                  <h1 className="artist-show-song-name">{song.name}</h1>
                </div>
                <i
                  id="ellipsis-icon"
                  onClick={e =>
                    this.toggleSongOptions(e, song._id, "popular")
                  }
                  className="fas fa-ellipsis-h"
                ></i>
                {this.state.options === song._id &&
                  this.state.section === "popular" && (
                    <SongOptions
                      userPlaylists={this.props.userPlaylists}
                      section={"popular-song-options-container"}
                      songId={song._id}
                      toggleSongOptions={this.toggleSongOptions}
                    />
                  )}
              </li>
              )
            });
          }}
        </Query>
      </ul>
    )
  }
}

export default LikedSongs;