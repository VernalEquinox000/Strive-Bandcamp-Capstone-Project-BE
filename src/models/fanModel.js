const mongoose = require("mongoose");
const Schema = moongose.Schema;

const FanSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "That email address doesn’t look right.",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    //password must be of 3 chars
    username: {
      type: String,
      required: "Please choose your username",
    },
    //need check
  },
  { timestamps: true }
);

module.exports = FanSchema;
