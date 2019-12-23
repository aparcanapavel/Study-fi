const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const Playlist = mongoose.model("playlists");


const PlaylistType = new GraphQLObjectType({
  name: "PlaylistType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    user: {
      type: require("./user_type"),
      resolve(parentValue) {
        return Playlist.findUser(parentValue.id);
      }
    },
    songs: {
      type: new GraphQLList(require("./song_type")),
      resolve(parentValue) {
        return Playlist.findSongs(parentValue.id);
      }
    }
  })
});

module.exports = PlaylistType