const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema(
  {
    artistName: {
      type: String,
      required: "Please enter your band name",
    },
    username: {
      type: String,
      required: "Please enter your username",
    },
    password: {
      type: String,
      required: "Please enter your password",
    },
    //password must be of 3 chars
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: "Please enter your email",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "That email address doesn’t look right.",
      ],
    },

    //need emailcheck + terms check
  },
  { timestamps: true }
);

module.exports = ArtistSchema;
