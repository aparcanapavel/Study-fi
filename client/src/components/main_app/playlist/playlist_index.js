import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../../graphql/queries";
const { FETCH_USER_PLAYLISTS } = Queries;

class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    return(
      <Query query={FETCH_USER_PLAYLISTS} variables={{id: this.props.currentUserId}}>
        {({loading, error, data}) => {
          if (loading) {
            return <h1>loading</h1>;
          } else if (error) {
            return <h1>error</h1>;
          } else {
            // console.log(data);
            return (
              <div>
                <ul>
                {data.user.playlists.reverse().map((playlist) => {
                  return (
                  <Link to={`/playlist/${playlist._id}`}>
                    <h1>{playlist.name}</h1>
                  </Link>
                  )
                })}
                </ul>
              </div>
            )
          }
        }}
      </Query>
    )
  }
}

export default PlaylistIndex;