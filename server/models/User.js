const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  playlists: [
    {
      type: Schema.Types.ObjectId,
      ref: "playlists"
    }
  ],
  likedSongs: [
    {
      type: Schema.Types.ObjectId,
      ref: "songs"
    }
  ]
});

UserSchema.statics.findPlaylists = function(id) {
  return this.findById(id)
    .populate("playlists")
    .then(user => {
      const Playlist = mongoose.model("playlists");
      const playlistArr = user.playlists;
      let returnArr = [];
      playlistArr.forEach(playlist => {
        returnArr.push(Playlist.findById(playlist));
      });
      return returnArr;
    });
};

UserSchema.statics.removePlaylist = function(userId, playlistId){
  const User = mongoose.model("users");
  const Playlists = mongoose.model("playlists");

  return User.findById(userId)
    .then(user => {

      return Playlists.findById(playlistId)
        .then(playlist => {
          user.playlists.pull(playlist);
          return Promise.all([
            user.save(),
            Playlists.findByIdAndDelete({ _id: playlistId })
          ]).then(([ user, playlist ]) => {
            return playlist;
          });
        })
    })
}

UserSchema.statics.findLikedSongs = function(id) {
  return this.findById(id)
    .populate("songs")
    .then(user => {
      const Song = mongoose.model("songs");
      const likedSongsArr = user.likedSongs;
      let returnArr = [];

      likedSongsArr.forEach(playlist => {
        returnArr.push(Song.findById(playlist));
      });
      return returnArr;
    });
};

// UserSchema.statics.addLikedSong = function(userId, songId){
//   const User = mongoose.model("users");
//   const Song = mongoose.model("songs");

//   let user;
//   return User.findById(userId)
//     .then(user => {
//       user = user;
//       return Song.findById(songId)
//         .then(song => {
//           user.likedSongs.push(song);

//           return Promise.all([])
//         })
//     })
// }

module.exports = mongoose.model("users", UserSchema);