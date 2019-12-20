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
        _id
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
  CREATE_PLAYLIST: gql`
    mutation CreatePlaylist($name: String!, $userId: ID!) {
      createPlaylist(name: $name, userId: $userId){
        _id
        name
      }
    }
  `
};
export default Mutations;
