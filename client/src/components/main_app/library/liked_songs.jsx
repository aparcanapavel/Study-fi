import React from "react";
import Queries from "../../../graphql/queries";
import { Query } from "react-apollo";
// import SongOptions from "../../song/song_options";
const { FIND_LIKED_SONGS } = Queries;

class LikedSongs extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Query query={ FIND_LIKED_SONGS } 
        variables={{id: this.props.currentUserId}}
      >
        {({ loading, error, data }) => {
          console.log(data);
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;
            return data.songs.map(({ _id, name }) => (
              <h1>{name}</h1>
            ));
        }}
      </Query>
    )
  }
}

export default LikedSongs;