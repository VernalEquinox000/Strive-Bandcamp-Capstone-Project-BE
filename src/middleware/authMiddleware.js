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
    const user = await UserModel.findOne({ _id: decoded._id });
    console.log(decoded);
    if (!user) {
      /* const err = new Error({ error: "Please authenticate user!" });
      err.httpStautsCode = 403;
      next(err); */
      throw new Error();
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

const artistOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "artist") next();
  else {
    const err = new Error("artists only");
    err.httpStatusCode = 403;
    next(err);
  }
};

const labelOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "label") next();
  else {
    const err = new Error("artists only");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authorize };
