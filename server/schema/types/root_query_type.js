const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

const UserType = require("./user_type");
const SongType = require("./song_type");
const ALbumType = require("./album_type");
const ArtistType = require("./artist_type");

const User = mongoose.model("users");
const Song = mongoose.model("songs");
const Artist = mongoose.model("artists");
const Album = mongoose.model("album");

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      }
    },
    user: {
      type: UserType,
      args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return User.findById(args._id);
      }
    },
    songs: {
      type: new GraphQLList(SongType),
      resolve() {
        return Song.find({});
      }
    },
    artists: {
      type: new GraphQLList(ArtistType),
      resolve() {
        return Artist.find({});
      }
    },
    albums: {
      type: new GraphQLList(AlbumType),
      resolve() {
        return Album.find({});
      }
    }
  })
});

module.exports = RootQueryType;