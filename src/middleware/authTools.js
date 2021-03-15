const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const FanSchema = require("../models/fanModel");
const FanModel = mongoose.model("Fan", FanSchema);
const ArtistSchema = require("../models/artistModel");
const ArtistModel = mongoose.model("Artist", ArtistSchema);
const LabelSchema = require("../models/labelModel");
const LabelModel = mongoose.model("Label", LabelSchema);

//authentication for fans
const authenticateFan = async (fan) => {
  try {
    const newAccessToken = await generateAccessToken({ _id: fan._id });
    const refreshToken = await generateRefreshToken({ _id: fan._id });
    fan.refreshTokens = fan.refreshTokens.concat(refreshToken);
    await fan.save();
    return { token: newAccessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

//authentication for artists
const authenticateArtist = async (artist) => {
  try {
    const newAccessToken = await generateAccessToken({ _id: artist._id });
    const refreshToken = await generateRefreshToken({ _id: artist._id });
    artist.refreshTokens = artist.refreshTokens.concat(refreshToken);
    await artist.save();
    return { token: newAccessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

//authentication for labels
const authenticateLabel = async (label) => {
  try {
    const newAccessToken = await generateAccessToken({ _id: label._id });
    const refreshToken = await generateRefreshToken({ _id: label._id });
    label.refreshTokens = label.refreshTokens.concat(refreshToken);
    await label.save();
    return { token: newAccessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

const generateAccessToken = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT.SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyAccessToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      res(decoded);
    })
  );

const generateRefreshToken = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        rej(err);
      }
      res(decoded);
    })
  );

const refreshToken = async (oldRefreshToken) => {
  try {
    const decoded = await verifyRefreshToken(oldRefreshToken);
    const fan = await FanModel.findOne({ _id: decoded._id });
    const artist = await ArtistModel.findOne({ _id: decoded._id });
    const label = await LabelModel.findOne({ _id: decoded._id });
    if (fan) {
      const currentRefreshToken = fan.refreshTokens.find(
        (token) => token === oldRefreshToken
      );
      if (!currentRefreshToken) {
        throw new Error("Bad refresh token for fan profile provided");
      }
      const newAccessToken = await generateAccessToken({ _id: fan._id });
      const newRefreshToken = await generateRefreshToken({ _id: fan._id });

      const newRefreshTokensList = fan.refreshTokens
        .filter((token) => token !== oldRefreshToken)
        .concat(newRefreshToken);

      fan.refreshTokens = [...newRefreshTokensList];
      await fan.save();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } else if (artist) {
      const currentRefreshToken = artist.refreshTokens.find(
        (token) => token === oldRefreshToken
      );
      if (!currentRefreshToken) {
        throw new Error("Bad refresh token for artist profile provided");
      }
      const newAccessToken = await generateAccessToken({ _id: artist._id });
      const newRefreshToken = await generateRefreshToken({ _id: artist._id });

      const newRefreshTokensList = artist.refreshTokens
        .filter((token) => token !== oldRefreshToken)
        .concat(newRefreshToken);

      artist.refreshTokens = [...newRefreshTokensList];
      await artist.save();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } else if (label) {
      const currentRefreshToken = label.refreshTokens.find(
        (token) => token === oldRefreshToken
      );
      if (!currentRefreshToken) {
        throw new Error("Bad refresh token for label profile provided");
      }
      const newAccessToken = await generateAccessToken({ _id: label._id });
      const newRefreshToken = await generateRefreshToken({ _id: label._id });

      const newRefreshTokensList = label.refreshTokens
        .filter((token) => token !== oldRefreshToken)
        .concat(newRefreshToken);

      label.refreshTokens = [...newRefreshTokensList];
      await label.save();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  authenticateFan,
  authenticateArtist,
  authenticateLabel,
  verifyAccessToken,
  refreshToken,
};
