const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: { type: String },
  year: { type: Number },
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: "artists"
    }
  ],
  songs: [
    {
      type: Schema.Types.ObjectId,
      ref: "songs"
    }
  ]
});

AlbumSchema.statics.findArtists = function(id) {
  return this.findById(id)
    .populate("artists")
    .then(album => album.artists);
};

module.exports = mongoose.model("album", AlbumSchema);