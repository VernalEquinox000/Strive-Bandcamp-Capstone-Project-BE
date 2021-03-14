const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    //need to add terms check
  },
  { timestamps: true }
);

FanSchema.methods.toJSON = function () {
  const fan = this;
  const fanObject = fan.toObject();

  delete fanObject.password;
  delete fanObject.__V;
  delete fanObject.refreshTokens;

  return fanObject;
};

module.exports = FanSchema;
