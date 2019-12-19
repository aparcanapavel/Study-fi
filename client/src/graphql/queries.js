import gql from "graphql-tag";

export default {
  IS_LOGGED_IN: gql`
    query IsUserLoggedIn {
      isLoggedIn @client
    }
  `,
  CURRENT_USER_ID: gql`
    query fetchCurrentUserId {
      currentUserId @client
    }
  `,
  FETCH_ARTISTS: gql`
    query fetchArtists {
      artists {
        name
        _id
      }
    }
  `,
  FETCH_SONGS: gql`
    query fetchSongs {
      songs {
        _id
        name
        songUrl
        artists {
          name
        }
      }
    }
  `,
  FETCH_ARTIST: gql`
    query fetchArtist($id: ID!) {
      artist(_id: $id) {
        name
        albums {
          _id
          name
          year
          songs {
            name
            duration

          }
        }
        songs {
          _id
          name
        }
      }
    }
  `,
  FETCH_ALBUMS: gql`
    query fetchAlbums{
      albums{
        _id
        name
        year
        artists{
          _id
          name
        }
      }
    }
  `,
  FETCH_ALBUM: gql`
    query fetchAlbum($id: ID!){
      album(_id: $id){
        _id
        name
        year
        artists{
          _id
          name
        }
        songs{
          _id
          name
          duration
          artists{
            _id
            name
          }
        }
      }
    }
  `,
  FETCH_USER_PLAYLISTS: gql`
    query fetchUser($id: ID!){
      user(_id: $id){
        _id
        playlists{
          _id
          name
        }
      }
    }
  `,
};