import gql from "graphql-tag";

const Mutations = {
  LOGIN_USER: gql`
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        loggedIn
      }
    }
  `,
  VERIFY_USER: gql`
    mutation VerifyUser($token: String!) {
      verifyUser(token: $token) {
        loggedIn
      }
    }
  `,
  REGISTER_USER: gql`
    mutation RegisterUser($name: String!, $email: String!, $password: String!) {
      register(name: $name, email: $email, password: $password) {
        token
        loggedIn
      }
    }
  `,
  CREATE_SONG: gql`
    mutation CreateSong($name: String!, $author: String!, $album: String!, $URL: String!, $duration: Int!){
      createSong(name: $name, author: $authod, album: $album, songURL: $URL, duration: $duration){
        _id
        name
        artist
        album
        duration
      }
    }
  `
};
export default Mutations;
