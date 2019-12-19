import React from "react";
import { Query } from "react-apollo";
import Queries from "../../../graphql/queries";
import { Link } from "react-router-dom";
const { FETCH_ALBUM } = Queries;

class ArtistShow extends React.Component {
  constructor(props) {
    super(props);
  }

  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = (int % 60) < 10 ? `0${int % 60}` : (int % 60)
    return `${minutes}:${seconds}`
  }

  render() {
    return (
      <Query query={FETCH_ALBUM} variables={{ id: this.props.match.params.albumId }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;
          return (
            <div className="album-show">
              <div className="album-show-header">
                <img className="album-show-icon" src="https://study-fi-public.s3.amazonaws.com/3.jpg"/>
                <div className="album-show-header-details">
                <h1>Album</h1>
                <h1 className="album-show-name">{data.album.name}</h1>
                {Object.values(data.album.artists).length > 2 ? <h1> by various artists</h1> : 
                <div className="album-show-artists">
                  by
                  {data.album.artists.map((artist) => (
                    <Link to={`/artist/${artist._id}`}><h1 className="album-show-artist">{artist.name}</h1></Link>
                  ))}
                </div>}
                </div>
              </div>

                <ul className="album-show-songs">
                  <li className="album-show-song-header">
                    <h1 className="album-show-song-header-title">Title</h1>
                    <h1 className="album-show-song-header-artist">Artist</h1>
                    <h1>Length</h1>
                  </li>
                { data.album.songs.map((song, i) => (
                  <li className="album-show-song">
                    <div className="album-show-song-start">
                    <h1 className="album-show-song-index">{i + 1}</h1>
                    <h1 className="album-show-song-name">{song.name}</h1>
                    </div>
                    <div className="album-show-song-artists">
                      {song.artists.map((artist, i) => {
                        let comma = "";
                        if (i === 0 && song.artists.length > 1) {
                          comma = ","
                        }
                        return(
                      <Link to={`/artist/${artist._id}`}><h1 className="album-show-artist-name">{artist.name + comma}</h1></Link>
                        )
                      })}
                    </div>
                    <h1 className="album-show-song-duration">{this.parseTime(song.duration)}</h1>
                  </li>
                ))
                }
                </ul>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default ArtistShow;