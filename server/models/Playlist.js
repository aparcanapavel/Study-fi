const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: "users"
  },
  songs: [
    {
      type: Schema.Types.ObjectId,
      ref: "songs"
    }
  ]
});

PlaylistSchema.statics.findSongs = function (id) {
  return this.findById(id)
    .populate("songs")
    .then(playlist => {
      const Song = mongoose.model("songs");
      const songArr = playlist.songs;
      let returnArr = [];
      songArr.forEach(playlistSong => {
        returnArr.push(Song.findById(playlistSong));
      });
      return returnArr;
    });
};

PlaylistSchema.statics.findUser = function (id) {
  return this.findById(id)
    .populate("user")
    .then(playlist => {
      const User = mongoose.model("users");
      return User.findById(playlist.user);
    })
};

PlaylistSchema.statics.addPlaylistToUser = function(playlistId, userId) {
  const User = mongoose.model("users");

  return User.findById(userId)
    .then(user => {
      user.playlists.push(playlistId);
      return Promise.all([user.save()])
        .then(([user]) => user)
    })
};

PlaylistSchema.statics.addSong = function(playlistId, songId) {
  const Song = mongoose.model("songs");
  const Playlist = mongoose.model("playlists");

  let playlist;
  return Playlist.findById(playlistId)
    .then(result => {
      playlist = result;

      Song.findById(songId)
        .then(song => {
          playlist.songs.push(song);
          song.playlists.push(playlist);

          return Promise.all([playlist.save(), song.save()])
            .then(([playlist, song]) => playlist)
            .catch(err => {console.log(err)});
        })
    });
};

module.exports = mongoose.model("playlists", PlaylistSchema);