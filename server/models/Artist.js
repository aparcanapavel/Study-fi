const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  albums: [
    {
      type: Schema.Types.ObjectId,
      ref: "album"
    }
  ],
  songs: [
    {
      type: Schema.Types.ObjectId,
      ref: "songs"
    }
  ]
});

ArtistSchema.statics.findAlbums = function(id) {
  return this.findById(id)
    .populate('album')
    .then(artist => {
      // console.log(artist)
      const Album = mongoose.model("album");
      const albumArr = artist.albums;
      let returnArr = [];
      albumArr.forEach(artistAlbum => {
        returnArr.push(Album.findById(artistAlbum))
      });
      return returnArr;
    })
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