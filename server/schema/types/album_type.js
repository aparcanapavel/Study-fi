const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;
const Album = mongoose.model("album");

const AlbumType = new GraphQLObjectType({
  name: "AlbumType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: {
      type: new GraphQLList(require("./artist_type")),
      resolve(parentValue) {
        return Album.findArtists(parentValue.id);
      }
    },
    year: { type: GraphQLInt }
  })
});

module.exports = AlbumType