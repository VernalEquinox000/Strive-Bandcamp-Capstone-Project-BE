const { Schema, model } = require("mongoose");
//const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
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
    },
    artistName: {
      type: String,
    },

    albums: [{ type: Schema.Types.ObjectId, ref: "Album" }],

    //need to add URL
    location: {
      type: String,
    },
    url: {
      type: String,
    },
    role: {
      type: String,
      enum: ["fan", "artist"],
      required: true,
    },
    refreshTokens: [{ type: String }],
    //need to add terms check
    googleId: {
      type: String,
    },
    picture: {
      type: String,
    },
    background: {
      type: String,
    },
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
    else return null;
  } else {
    return { error: "Email/password incorrect" };
  }
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPassword = user.password;
  console.log(user);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPassword, 10);
  }
  next();
});

module.exports = UserSchema;
