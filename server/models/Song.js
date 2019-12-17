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
    type: String,
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

module.exports = mongoose.model("songs", SongSchema);