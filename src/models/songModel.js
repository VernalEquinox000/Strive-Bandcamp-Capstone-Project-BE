const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema(
  {
    songName: {
      type: String,
      required: "Please enter song title",
    },
    artistName: {
      type: String,
      required: "Please enter artist name",
    },
    albumName: {
      type: String,
    },
    duration: {
      type: Number,
    },
    albumCover: {
      type: String,
    },
    straming: {
      type: Boolean,
    },
    download: {},
  },
  { timestamps: true }
);

module.exports = SongSchema;
