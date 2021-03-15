const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const { verifyAccessToken } = require("./authTools");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    //insert cookies here later
    const decoded = await verifyAccessToken(token);
    const user = await UserModel.findById({ _id: decoded._id });
    console.log(decoded);
    if (!fan) {
      const err = new Error({ error: "Please authenticate user!" });
      err.httpStautsCode = 403;
      next(err);
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error({ error: "Please authenticate" });
    err.httpStatusCode = 401;
    next(err);
  }
};

module.exports = { authorize };
