const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
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

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__V;
  delete userObject.refreshTokens;

  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return { error: "Username/password incorrect" };
  } else {
    return null;
  }
};

userSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;
  console.log(user);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

module.exports = UserSchema;
