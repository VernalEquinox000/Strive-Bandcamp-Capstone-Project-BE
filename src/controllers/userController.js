const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const bcrypt = require("bcryptjs");
const { authenticate, refreshTokenUtil } = require("../middleware/authTools");

//SIGNUP
const signup = async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    console.log(user);
    //insert if?
    const tokens = await authenticate(user);
    await user.save();
    res.send(tokens);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Logout
const logout = async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (token) => token.token !== req.body.refreshToken
    );
    res.send("bye");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Logout
const logoutAll = async (req, res, next) => {
  try {
    req.user.refreshToken = [];
    await req.author.save();
    res.send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//POST Refresh Token
const refreshToken = async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken;
  if (!oldRefreshToken) {
    const err = new Error("Refresh token missing");
    err.httpStatusCode = 400;
    next(err);
  } else {
    try {
      const newTokens = await refreshTokenUtil(oldRefreshToken);
      res.send(newTokens);
    } catch (error) {
      console.log(error);
      const err = new Error(error);
      err.httpStatusCode = 403;
      next(err);
    }
  }
};

//GET all users
const allUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
};

//GET user profile
const meUser = async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
};

//PUT user
const updateUser = (req, res, next) => {
  UserModel.findOneAndUpdate(
    { _id: req.user._id },
    req.body,
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    }
  );
};

//DELETE User
const deleteUser = (req, res, next) => {
  UserModel.findOneAndDelete({ _id: req.user._id }, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.send(`${req.user._id} deleted`);
    }
  });
};

//GET single user
const getSingleUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    /*       need to add.populate([
      {
        path: "following",
        select: ["_id", "username", "picture"],
      },
      {
        path: "followers",
        select: ["_id", "username", "picture"],
      },
    ]); */
    res.send(user);
  } catch (error) {
    error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

//GET User By Id
const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    /* .populate([
      {
        path: "following",
        select: ["_id", "username", "picture"],
      },
      {
        path: "followers",
        select: ["_id", "username", "picture"],
      },
    ]); */
    if (user) {
      res.status(200).send(user);
    } else {
      let error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  allUsers,
  meUser,
  updateUser,
  deleteUser,
  refreshToken,
  getSingleUser,
  getUserById,
};
