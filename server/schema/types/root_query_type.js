const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

const UserType = require("./user_type");
const SongType = require("./song_type");
const AlbumType = require("./album_type");
const ArtistType = require("./artist_type");
const PlaylistType = require("./playlist_type")

const User = mongoose.model("users");
const Song = mongoose.model("songs");
const Artist = mongoose.model("artists");
const Album = mongoose.model("album");
const Playlist = mongoose.model("playlists");

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    user: {
      type: UserType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return User.findById(args._id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      }
    },
    song: {
      type: SongType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Song.findById(args._id);
      }
    },
    songs: {
      type: new GraphQLList(SongType),
      resolve() {
        return Song.find({});
      }
    },
    artist: {
      type: ArtistType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Artist.findById(args._id);
      }
    },
    artists: {
      type: new GraphQLList(ArtistType),
      resolve() {
        return Artist.find({});
      }
    },
    album: {
      type: AlbumType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Album.findById(args._id);
      }
    },
    albums: {
      type: new GraphQLList(AlbumType),
      resolve() {
        return Album.find({});
      }
    },
    playlist: {
      type: PlaylistType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return Playlist.findById(args._id);
      }
    },
    playlists: {
      type: new GraphQLList(PlaylistType),
      resolve() {
        return Playlist.find({});
      }
    }
  })
});

module.exports = RootQueryType;