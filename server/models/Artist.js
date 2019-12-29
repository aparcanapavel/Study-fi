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
  ],
  imageUrl: {
    type: String,
  }
});

ArtistSchema.statics.findAlbums = function(id) {
  return this.findById(id)
    .populate('album')
    .then(artist => {
      const Album = mongoose.model("album");
      const albumArr = artist.albums;
      let returnArr = [];
      albumArr.forEach(artistAlbum => {
        returnArr.push(Album.findById(artistAlbum))
      });
      return returnArr;
    })
}

ArtistSchema.statics.findSongs = function(id) {
  return this.findById(id)
    .populate("songs")
    .then(artist => {
      const Song = mongoose.model("songs");
      const songArr = artist.songs;
      let returnArr = [];
      songArr.forEach(artistSong => {
        returnArr.push(Song.findById(artistSong));
      });
      return returnArr;
    });
};

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

ArtistSchema.statics.addImage = (artistId, imageUrl) => {
  const Artist = mongoose.model("artists");

  return Artist.findById(artistId)
    .then(artist => {
          artist.imageUrl = imageUrl;
          return Promise.all([artist.save()])
            .then(([artist]) => artist);
    });
}

module.exports = mongoose.model("artists", ArtistSchema);