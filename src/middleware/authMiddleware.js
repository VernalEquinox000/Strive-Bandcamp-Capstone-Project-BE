const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const FanSchema = require("../models/fanModel");
const FanModel = mongoose.model("Fan", FanSchema);
const ArtistSchema = require("../models/artistModel");
const ArtistModel = mongoose.model("Artist", ArtistSchema);
const LabelSchema = require("../models/labelModel");
const LabelModel = mongoose.model("Label", LabelSchema);
const { verifyAccessToken } = require("./authTools");

const authorizeFan = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    //insert cookies here later
    const decoded = await verifyAccessToken(token);
    const fan = await FanModel.findById({ _id: decoded._id });
    console.log(decoded);
    if (!fan) {
      const err = new Error({ error: "Please authenticate fan!" });
      err.httpStautsCode = 403;
      next(err);
    }
    req.token = token;
    req.user = fan;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error({ error: "Please authenticate" });
    err.httpStatusCode = 401;
    next(err);
  }
};

const authorizeArtist = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    //insert cookies here later
    const decoded = await verifyAccessToken(token);
    const artist = await ArtistModel.findById({ _id: decoded._id });
    console.log(decoded);
    if (!artist) {
      const err = new Error({ error: "Please authenticate fan!" });
      err.httpStautsCode = 403;
      next(err);
    }
    req.token = token;
    req.user = artist;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error({ error: "Please authenticate" });
    err.httpStatusCode = 401;
    next(err);
  }
};

const authorizeLabel = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    //insert cookies here later
    const decoded = await verifyAccessToken(token);
    const label = await LabelModel.findById({ _id: decoded._id });
    console.log(decoded);
    if (!label) {
      const err = new Error({ error: "Please authenticate fan!" });
      err.httpStautsCode = 403;
      next(err);
    }
    req.token = token;
    req.user = label;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error({ error: "Please authenticate" });
    err.httpStatusCode = 401;
    next(err);
  }
};

module.exports = { authorizeFan, authorizeArtist, authorizeLabel };
