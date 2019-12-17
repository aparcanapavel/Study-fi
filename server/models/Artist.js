const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  albums: [{
    type: Schema.Types.ObjectId,
    ref: "albums"
  }]
});

ArtistSchema.statics.findAlbums = function(id) {
  return this.findById(id)
    .populate('albums')
    .then(artist => artist.albums)
}

ArtistSchema.statics.addAlbum = (artistId, albumId) => {
  const Artist = mongoose.model("artists");
  const Album = mongoose.model("album");

  return Artist.findById(artistId)
    .then(artist => {
      Album.findById(albumId)
      .then(album => {
        artist.albums.push(album);
        album.artists.push(artist);
        return Promise.all([artist.save(), album.save()])
          .then(([artist, album]) => artist);
      })
    });
}

module.exports = mongoose.model("artists", ArtistSchema);