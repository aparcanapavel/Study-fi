import React from "react";
import { Query } from "react-apollo";
import {Link} from "react-router-dom";
import Queries from "../../../graphql/queries";
const { FETCH_ARTISTS } = Queries;

class ArtistIndex extends React.Component{
  render(){
    return(
      <div className="artist-index">
        <h1 className="artist-index-header">Artists</h1>
        <ul className="artist-list">
        <Query query={FETCH_ARTISTS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return data.artists.map(({ _id, name, imageUrl }) => (
              <Link to={`/artist/${_id}`} key={_id}>
              <li className="artist-list-item" key={_id}>
                  <img className="artist-list-icon" src={imageUrl} alt="artist-icon" />
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