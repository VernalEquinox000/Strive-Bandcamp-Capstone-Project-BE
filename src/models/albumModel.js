const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema(
  {
    artistName: {
      type: String, //insert ref to user
      required: true,
    },
    title: {
      type: String, //insert ref to user
      required: true,
    },
    description: {
      type: String, //insert ref to user
    },
    albumCover: {
      type: String, //insert ref to user
    },
    releaseDate: {
      type: Date,
    },
    albumSongs: [{ type: String }], //ref to tracks
    tags: [{ type: String }],
    //additionaFiles: [{type:String}] CHECK
    //releaseMail: {type:String} check
    //password must be of 3 chars
  },
  { timestamps: true }
);

module.exports = AlbumSchema;
