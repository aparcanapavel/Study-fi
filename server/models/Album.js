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
  ],
  imageUrl: {
    type: String
  }
});

AlbumSchema.statics.findArtists = function(id) {
  return this.findById(id)
    .populate("artists")
    .then(album => album.artists);
};

AlbumSchema.statics.findSongs = function(id) {
  return this.findById(id)
    .populate("songs")
    .then(album => {
      const Song = mongoose.model("songs");
      const songArr = album.songs;
      let returnArr = [];
      songArr.forEach(albumSong => {
        returnArr.push(Song.findById(albumSong));
      });
      return returnArr;
    });
};

AlbumSchema.statics.addImage = function (id, imageUrl) {
  return this.findById(id)
    .then(album => {
      album.imageUrl = imageUrl;
      album.save();
      return album;
    });
};

module.exports = mongoose.model("album", AlbumSchema);