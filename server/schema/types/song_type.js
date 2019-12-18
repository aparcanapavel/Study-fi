const mongoose = require("mongoose");
const graphql = require("graphql");
const Song = mongoose.model("songs");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList
} = graphql;

const MusicType = new GraphQLObjectType({
  name: "MusicType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    artists: {
      type: new GraphQLList(require("./artist_type")),
      resolve(parentValue) {
        return Song.findArtists(parentValue.id);
      }
    },
    album: {
      type: require("./album_type"),
      resolve(parentValue) {
        return Song.findAlbum(parentValue.id);
      }
    },
    duration: { type: GraphQLInt },
    songUrl: { type: GraphQLString }
  })
});

module.exports = MusicType