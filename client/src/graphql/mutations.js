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
      createPlaylist(name: $name, userId: $userId) {
        _id
        name
      }
    }
  `,
  ADD_SONG_TO_PLAYLIST: gql`
    mutation AddSongToPlaylist($playlistId: ID, $songId: ID) {
      addSongToPlaylist(playlistId: $playlistId, songId: $songId) {
        _id
        name
      }
    }
  `,
  REMOVE_USER_PLAYLIST: gql`
    mutation removeUserPlaylist($userId: ID, $playlistId: ID) {
      removeUserPlaylist(playlistId: $playlistId, userId: $userId) {
        _id
        name
      }
    }
  `,
  LIKE_SONG: gql`
    mutation addSongToUser($userId: ID!, $songId: ID!) {
      addLikedSong(userId: $userId, songId: $songId) {
        _id
        name
      }
    }
  `
};
export default Mutations;
