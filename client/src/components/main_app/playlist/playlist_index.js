import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
const { FETCH_USER_PLAYLISTS } = Queries;

class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div>
        {this.props.currentUserId}
      </div>
    )
  }
}

export default PlaylistIndex;