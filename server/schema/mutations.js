const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;
const mongoose = require("mongoose");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {}
});

module.exports = mutation;