const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: { type: String },
  year: { type: Number },
  artist: { type: String }
})

module.exports = mongoose.model("album", AlbumSchema);