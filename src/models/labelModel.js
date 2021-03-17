const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    //also check for a "robot check?"
  },
  { timestamps: true }
);

LabelSchema.methods.toJSON = function () {
  const label = this;
  const labelObject = label.toObject();

  delete labelObject.password;
  delete labelObject.__V;
  delete labelObject.refreshTokens;

  return labelObject;
};

LabelSchema.statics.findByCredentials = async function (email, password) {
  const label = await this.findOne({ email });

  if (label) {
    const isMatch = await bcrypt.compare(password, label.password);
    if (isMatch) return label;
    else return { error: "Username/password incorrect" };
  } else {
    return null;
  }
};

LabelSchema.pre("save", async function (next) {
  const label = this;
  const plainPW = label.password;
  console.log(label);
  if (label.isModified("password")) {
    label.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

module.exports = LabelSchema;
