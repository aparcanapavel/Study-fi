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
  FETCH_USER_PLAYLISTS: gql`
    query fetchUser($id: ID!) {
      user(_id: $id) {
        _id
        playlists {
          _id
          name
        }
      }
    }
  `,
  FETCH_ALL: gql`
    query fetchAll {
      songs {
        _id
        name
        songUrl
        artists {
          name
        }
        album {
          imageUrl
        }
      }
      artists {
        _id
        name
        imageUrl
      }
      albums {
        _id
        name
        imageUrl
        artists {
          name
        }
      }
    }
  `,
  FETCH_FOR_PLAYLIST: gql`
    query fetchAll {
      songs {
        _id
        name
        artists {
          name
        }
        album {
          imageUrl
        }
      }
      albums {
        _id
        name
        imageUrl
        artists {
          name
        }
        songs {
          _id
          name
        }
      }
    }
  `,
  FETCH_ARTISTS: gql`
    query fetchArtists {
      artists {
        name
        _id
        imageUrl
      }
    }
  `,
  FETCH_SONGS: gql`
    query fetchSongs {
      songs {
        _id
        name
        songUrl
        duration
        artists {
          name
        }
        album {
          imageUrl
        }
      }
    }
  `,
  FETCH_ARTIST: gql`
    query fetchArtist($id: ID!, $userId: ID!) {
      artist(_id: $id) {
        name
        imageUrl
        albums {
          _id
          name
          year
          imageUrl
          songs {
            _id
            name
            duration
            songUrl
            artists {
              _id
              name
            }
          }
        }
        songs {
          _id
          name
          songUrl
          duration
          artists {
            _id
            name
          }
          album {
            imageUrl
          }
        }
      }
      user(_id: $userId) {
        _id
        likedSongs {
          _id
        }
      }
    }
  `,
  FETCH_ALBUMS: gql`
    query fetchAlbums {
      albums {
        _id
        name
        year
        imageUrl
        artists {
          _id
          name
        }
      }
    }
  `,
  FETCH_ALBUM: gql`
    query fetchAlbum($id: ID!, $userId: ID!) {
      album(_id: $id) {
        _id
        name
        year
        imageUrl
        artists {
          _id
          name
        }
        songs {
          _id
          name
          duration
          songUrl
          artists {
            _id
            name
          }
          album {
            imageUrl
          }
        }
      }
      user(_id: $userId) {
        _id
        likedSongs {
          _id
        }
      }
    }
  `,
  FETCH_PLAYLIST: gql`
    query fetchPlaylist($id: ID!, $userId: ID!) {
      playlist(_id: $id) {
        name
        songs {
          _id
          name
          duration
          artists {
            name
            _id
          }
          songUrl
          album {
            imageUrl
          }
        }
      }
      user(_id: $userId) {
        _id
        likedSongs {
          _id
        }
      }
    }
  `,
  FIND_LIKED_SONGS: gql`
    query findLikedSongs($id: ID!) {
      user(_id: $id) {
        _id
        likedSongs{
          _id
          name
          duration
          songUrl
          artists{
            _id
            name
          }
          album{
            _id
            name
            imageUrl
          }
        }
      }
    }
  `,
};
