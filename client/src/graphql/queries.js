import gql from "graphql-tag";

export default {

  IS_LOGGED_IN: gql`
    query IsUserLoggedIn {
      isLoggedIn @client
    }
  `,
  FETCH_ARTISTS: gql`
    query fetchArtists {
      artists{
        name
        _id
      }
    }
  `,
  FETCH_ARTIST: gql`
    query fetchArtist($id: ID!){
      artist(_id: $id){
        name
        albums{
          _id
          name
          year
          songs{
            name
            duration

          }
        }
        songs{
          _id
          name
        }
      }
    }
  `
};