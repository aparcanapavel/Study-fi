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
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  songUrl: {
    type: String,
    required: true
  }
});

// ArtistSchema.statics.addAlbum = (artistId, albumId) => {
//   const Artist = mongoose.model("artists");
//   const Album = mongoose.model("album");

//   return Artist.findById(artistId).then(artist => {
//     Album.findById(albumId).then(album => {
//       artist.albums.push(album);
//       album.artists.push(artist);
//       return Promise.all([artist.save(), album.save()]).then(
//         ([artist, album]) => artist
//       );
//     });
//   });
// };

SongSchema.statics.addSongToArtistAlbum = (songId, artistArr, albumId) => {
  const Artist = mongoose.model("artists");
  const Album = mongoose.model("album");

  return artistArr.forEach(artistId => {
    Artist.findById(artistId).then(artist=> {
      Album.findById(albumId).then(album => {
        artist.songs.push(songId);
        if(!album.songs.includes(songId)){
          album.songs.push(songId);
        }
        return Promise.all([artist.save(), album.save()])
          .then(([artist, album]) => artist)
      })
    })
  });
};

module.exports = mongoose.model("songs", SongSchema);