import React from "react";
import { Query } from "react-apollo";
import {Link} from "react-router-dom";
import Queries from "../../../graphql/queries";
const { FETCH_ARTISTS } = Queries;

class ArtistIndex extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className="artist-index">
        <h1 className="artist-index-header">Artists</h1>
        <ul className="artist-list">
        <Query query={FETCH_ARTISTS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return data.artists.map(({ _id, name, icon }) => (
              <Link to={`/artist/${_id}`}>
              <li className="artist-list-item" key={_id}>
                <img className="artist-list-icon" src="https://study-fi-public.s3.amazonaws.com/default-profile.png" />
                <h1 className="artist-list-name">{name}</h1>
              </li>
              </Link>
            ));
          }}
        </Query>
        </ul>
      </div>
    )
  }
}

export default ArtistIndex;