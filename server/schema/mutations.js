const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");
const UserType = require("./types/user_type");
const MusicType = require("./types/song_type");
const Song = require("../models/Song");
const Album = require("../models/Album");
const User = require("../models/User");
const AlbumType = require("./types/album_type");
const ArtistType = require("./types/artist_type");
const Artist = require('../models/Artist');
const PlaylistType = require("./types/playlist_type");
const Playlist = mongoose.model("playlists")

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },
    createSong: {
      type: MusicType,
      args: {
        name: { type: GraphQLString },
        artists: { type: new GraphQLList(GraphQLID) },
        album: { type: GraphQLID },
        duration: { type: GraphQLInt },
        songUrl: { type: GraphQLString }
      },
      resolve(_, args) {
        return new Song({
          name: args.name,
          artists: args.artists,
          album: args.album,
          duration: args.duration,
          songUrl: args.songUrl
        })
          .save()
          .then(song => {
            console.log(song);
            Song.addSongToArtistAlbum(song.id, song.artists, song.album);
          });
      }
    },
    createAlbum: {
      type: AlbumType,
      args: {
        name: { type: GraphQLString },
        year: { type: GraphQLInt }
      },
      resolve(_, { name, year }) {
        return new Album({ name: name, year: year }).save();
      }
    },
    createArtist: {
      type: ArtistType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(_, args) {
        return new Artist({ name: args.name }).save();
      }
    },
    addArtistAlbum: {
      type: ArtistType,
      args: {
        artistId: { type: GraphQLID },
        albumId: { type: GraphQLID }
      },
      resolve(_, { artistId, albumId }) {
        return Artist.addAlbum(artistId, albumId);
      }
    },
    createPlaylist: {
      type: PlaylistType,
      args: {
        name: { type: GraphQLString },
        userId: { type: GraphQLID }
      },
      resolve(_, args) {
        return new Playlist({ name: args.name, user: args.userId })
          .save()
          .then(playlist => {
            Playlist.addPlaylistToUser(playlist._id, playlist.user);
            return playlist;
          });
      }
    },
    addSongToPlaylist: {
      type: PlaylistType,
      args: {
        playlistId: { type: GraphQLID },
        songId: { type: GraphQLID }
      },
      resolve(_, args) {
        return Playlist.addSong(args.playlistId, args.songId);
      }
    },
    removeUserPlaylist: {
      type: UserType,
      args: {
        playlistId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(_, { playlistId, userId }) {
        return User.removePlaylist(userId, playlistId);
      }
    },
    addLikedSong: {
      type: MusicType,
      args: {
        userId: { type: GraphQLID },
        songId: { type: GraphQLID }
      },
      resolve(_, { userId, songId }) {
        return Song.addSongToUser(userId, songId).then(songId => {
          return { _id: songId }
        });
      }
    },
    removeLikedSong: {
      type: MusicType,
      args: {
        userId: { type: GraphQLID },
        songId: { type: GraphQLID }
      },
      resolve(_, { userId, songId }) {
        return Song.removeSongFromUser(userId, songId).then(songId => {
          return { _id: songId }
        });
      }
    }
  }
});

module.exports = mutation;