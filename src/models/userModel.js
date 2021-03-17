const { Schema, model } = require("mongoose");
//const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true /* "Email address is required",
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "That email address doesn’t look right.",
      ], */,
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
    labelName: {
      type: String,
    },
    //need to add URL
    location: {
      type: String,
    },
    url: {
      type: String,
    },
    role: {
      type: String,
      enum: ["fan", "artist", "label"],
      required: true,
    },
    refreshTokens: [{ token: { type: String } }],
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

/* UserSchema.statics.findByCredentials = async (email, plainPassword) => {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (isMatch) return user;
    else return { error: "Email/password incorrect" };
  } else {
    return null;
  }
}; */

UserSchema.statics.findByCredentials = async function (email, password) {
  console.log(this);
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else {
    return null;
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

//module.exports = UserSchema;
module.exports = model("user", UserSchema);
