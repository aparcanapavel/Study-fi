import React from "react";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Queries from "../../../graphql/queries";
const { FETCH_ALBUMS } = Queries;

class AlbumIndex extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      
       <div className="album-index">
         <h1 className="album-index-header">Albums</h1>
         <ul className="album-list">
         <Query query={FETCH_ALBUMS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            return data.albums.map(({ _id, name, icon }) => (
              <Link to={`/album/${_id}`}>
                <li className="album-list-item" key={_id}>
                  <img className="album-list-icon" src="https://study-fi-public.s3.amazonaws.com/3.jpg" />
                  <h1 className="album-list-name">{name}</h1>
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

export default AlbumIndex;