const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const { verifyAccessToken } = require("./authTools");

const authorize = async (req, res, next) => {
  try {
    //const token = req.header("Authorization").replace("Bearer ", "");
    const token = req.cookies.accessToken;
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

module.exports = { authorize };
