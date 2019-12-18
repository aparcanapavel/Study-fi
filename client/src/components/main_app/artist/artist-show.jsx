import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
const { FETCH_ARTIST } = Queries;

class ArtistShow extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <Query query={FETCH_ARTIST} variables={{id: this.props.match.params.artistId}}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;
          return (
            <div className="artist-show-div">
              <div className="artist-show-header">
                <img className="artist-show-icon" src="https://study-fi-public.s3.amazonaws.com/default-profile.png" />
                <div className="artist-show-name-header">
                <h1 className="artist-show-name-tag">ARTIST</h1>
                <h1 className="artist-show-name">{data.artist.name}</h1>
                </div>
              </div>


              <h1 className="artist-show-songs-header">Popular</h1>

              <ul className="artist-show-songs">
                {data.artist.songs.map((song, i) => (
                  <li className="artist-show-song" key={song._id}>
                    <img className="song-album-icon" src="https://study-fi-public.s3.amazonaws.com/3.jpg"/>
                    <h1 className="song-index">{i + 1}</h1>
                    <h1 className="artist-show-song-name">{song.name}</h1>
                  </li>
                ))}
              </ul>

              <h1 className="artist-show-albums-header">Albums</h1>

              <ul className="artist-show-albums">
              {data.artist.albums.map((album) =>(
                <li className="artist-show-album" key={album._id}>
                  <div className="artist-show-album-header">
                    <img className="album-icon" src="https://study-fi-public.s3.amazonaws.com/3.jpg" />
                    <div className="artist-show-album-header-name">
                      <h1 className="artist-show-album-year">{album.year}</h1>
                      <h1 className="artist-show-album-name">{album.name}</h1>
                    </div>
                  </div>
                </li>
              ))}
              </ul>
              
              
            </div>
          )
        }}
      </Query>
    )
  }
}

export default ArtistShow;