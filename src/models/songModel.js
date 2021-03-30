const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema(
  {
    songName: {
      type: String,
      required: "Please enter song title",
    },
    number: {
      type: Number,
      min: [1],
    },
    artistName: {
      type: String, //add ref to User
    },
    albumName: {
      type: String, //add ref to Albums
    },
    duration: {
      type: Number,
    },
    price: {
      type: Number,
    },
    songFeatured: {
      //song which will appear as "cover"
      type: Boolean,
    },
    audioFile: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = SongSchema;
