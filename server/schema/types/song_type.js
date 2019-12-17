const mongoose = require("mongoose");
const graphql = require("graphql");
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
    artists: { type: new GraphQLList(GraphQLID) },
    album: { type: GraphQLID },
    duration: { type: GraphQLInt },
    songUrl: { type: GraphQLString }
  })
});

module.exports = MusicType