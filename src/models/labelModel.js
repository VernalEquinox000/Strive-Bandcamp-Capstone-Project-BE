const mongoose = require("mongoose");
const Schema = moongose.Schema;

const LabelSchema = new Schema(
  {
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
    password: {
      type: String,
      required: "Please enter your password",
    },
    //password must be of 3 chars
    labelName: {
      type: String,
      required: "Please enter your label name",
    },
    //need to add URL
    location: {
      type: String,
      required: true,
    },
    //need to add format

    //need emailcheck + terms check
  },
  { timestamps: true }
);

module.exports = LabelSchema;
