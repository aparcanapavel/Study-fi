const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;
const Album = mongoose.model("album");

const AlbumType = new GraphQLObjectType({
  name: "AlbumType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    artists: {
      type: new GraphQLList(require("./artist_type")),
      resolve(parentValue) {
        return Album.findArtists(parentValue.id);
      }
    },
    year: { type: GraphQLInt },
    songs: {
      type: new GraphQLList(require("./song_type")),
      resolve(parentValue) {
        return Album.findSongs(parentValue.id);
      }
    },
    imageUrl: { type: GraphQLString }
  })
});

module.exports = AlbumType