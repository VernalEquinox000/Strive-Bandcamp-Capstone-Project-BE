const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);

//authentication
const authenticate = async (fan) => {
  try {
    const newAccessToken = await generateAccessToken({ _id: user._id });
    const refreshToken = await generateRefreshToken({ _id: user._id });
    user.refreshTokens = user.refreshTokens.concat(refreshToken);
    await user.save();
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
    const user = await UserModel.findOne({ _id: decoded._id });
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
