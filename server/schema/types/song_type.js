const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean, GraphQLInt } = graphql;

const MusicType = new GraphQLObjectType({
  name: "MusicType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
    album: { type: GraphQLString },
    duration: { type: GraphQLInt }
  })
});