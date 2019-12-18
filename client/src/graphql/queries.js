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
  `
};