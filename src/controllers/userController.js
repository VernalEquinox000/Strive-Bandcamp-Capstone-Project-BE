const mongoose = require("mongoose");
//const UserSchema = require("../models/userModel");
//const UserModel = mongoose.model("User", UserSchema);
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { authorize } = require("../middleware/authMiddleware");
const { authenticate, refreshToken } = require("../middleware/authTools");

//SIGNUP
const signup = async (req, res, next) => {
  try {
    const newUser = new UserSchema(
      req.body
      //password: await bcrypt.hash(req.body.password, 8),
    );
    const { _id } = await newUser.save();
    res.status(201).send(_id);
    /* if (req.body.password && req.body.email && req.body.username) {
      await user.save();
      const { _id } = await user.save();
      res.status(201).send(user);
    } else throw new Error("Email, username and password are required"); */
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    //const user = await UserModel.findByCredentials({ email, password });
    const user = await UserModel.findOne({ email });
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) res.send(user);
    else res.send("muori male");

    /* if (user === null) {
      res.status(404).send({ error: "user not found" });
    } else if (user.error) {
      res.status(403).send(user);
    } else { */

    /* const tokens = await authenticate(user);
    res.send(tokens);
    console.log(token); */
    //add cookie
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
    res.send(userMe);
  } catch (error) {
    error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

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

module.exports = { signup, login, getSingleUser, allUsers, getUserById };
