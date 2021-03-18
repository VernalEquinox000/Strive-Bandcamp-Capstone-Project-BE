const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const bcrypt = require("bcryptjs");
const { authorize } = require("../middleware/authMiddleware");
const { authenticate, refreshToken } = require("../middleware/authTools");

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

//LOGIN
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

//LOGOUT
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

//GET users
const allUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
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

module.exports = {
  signup,
  login,
  logout,
  getSingleUser,
  allUsers,
  getUserById,
};
