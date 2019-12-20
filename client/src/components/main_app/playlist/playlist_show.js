import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
const { FETCH_PLAYLIST } = Queries;

class PlaylistShow extends React.Component{
constructor(props){
  super(props)
}

  render(){
    return (
      <div>
        <Query query={FETCH_PLAYLIST} variables={{id: this.props.match.params.playlistId }}>
          {({loading, error, data}) => {
            if (loading) {
              return <h1>loading</h1>
            } else if (error) {
              return <h1>error</h1>
            } else {
              return (
                <div>
                  <h1>{data.playlist.name}</h1>
                  {data.playlist.songs.map((song) => {
                    return (
                      <li key={song._id}>
                        <h1>{song.name}</h1>
                      </li>
                    )
                  })}
                </div>
              )
            }
          }}
        </Query>
      </div>
    )
  }
};

export default PlaylistShow;