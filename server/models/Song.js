const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: "artists"
    }
  ],
  album: {
    type: Schema.Types.ObjectId,
    ref: "album"
  },
  duration: {
    type: Number,
    required: true
  },
  songUrl: {
    type: String,
    required: true
  },
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: "playlists"
  }]
});

SongSchema.statics.findArtists = function(id) {
  return this.findById(id)
    .populate("artists")
    .then(song => {
      const Artist = mongoose.model("artists");
      const artistsArr = song.artists;
      let returnArr = [];
      artistsArr.forEach(artist => {
        returnArr.push(Artist.findById(artist));
      });
      return returnArr;
    });
};

SongSchema.statics.findAlbum = function(id) {
  return this.findById(id)
    .populate("album")
    .then(song => {
      // console.log(song)
      const Album = mongoose.model("album");
      return Album.findById(song.album);
    });
};

SongSchema.statics.addSongToArtistAlbum = (songId, artistArr, albumId) => {
  const Artist = mongoose.model("artists");
  const Album = mongoose.model("album");

  return artistArr.forEach(artistId => {
    Artist.findById(artistId).then(artist=> {
      Album.findById(albumId).then(album => {
        console.log("adding song to artist...");
        artist.songs.push(songId);
        if(!album.songs.includes(songId)){
          console.log("adding song to album...");
          album.songs.push(songId);
        }
        console.log("--------------------------------------");
        return Promise.all([artist.save(), album.save()])
          .then(([artist, album]) => artist)
      })
    })
  });
};

module.exports = mongoose.model("songs", SongSchema);