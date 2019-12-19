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

module.exports = mongoose.model("users", UserSchema);