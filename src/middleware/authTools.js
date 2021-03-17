const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
/*  */

//authentication
const authenticate = async (user) => {
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
      process.env.JWT_SECRET,
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
    if (user) {
      const currentRefreshToken = user.refreshTokens.find(
        (token) => token === oldRefreshToken
      );
      if (!currentRefreshToken) {
        throw new Error("Bad refresh token for user profile provided");
      }
      const newAccessToken = await generateAccessToken({ _id: user._id });
      const newRefreshToken = await generateRefreshToken({ _id: user._id });

      const newRefreshTokensList = user.refreshTokens
        .filter((token) => token !== oldRefreshToken)
        .concat(newRefreshToken);

      user.refreshTokens = [...newRefreshTokensList];
      await user.save();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } else {
      return "No user found!";
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  authenticate,
  verifyAccessToken,
  refreshToken,
};
