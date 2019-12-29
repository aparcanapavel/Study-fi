const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList} = graphql;
const Artist = mongoose.model("artists");


const ArtistType = new GraphQLObjectType({
  name: "ArtistType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(require("./album_type")),
      resolve(parentValue) {
        return Artist.findAlbums(parentValue.id);
      }
    },
    songs: {
      type: new GraphQLList(require("./song_type")),
      resolve(parentValue) {
        return Artist.findSongs(parentValue.id);
      }
    },
    imageUrl: {type: GraphQLString}
  })
});

module.exports = ArtistType