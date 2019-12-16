const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;
const Album = mongoose.model("album");

const AlbumType = new GraphQLObjectType({
  name: 'AlbumType',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
    year: { type: GraphQLInt }
  })
});

module.exports = AlbumType