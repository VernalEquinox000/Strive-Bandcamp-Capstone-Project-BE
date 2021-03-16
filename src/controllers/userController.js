const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const UserModel = mongoose.model("User", UserSchema);
const bcrypt = require("bcryptjs");
const { authorize } = require("../middleware/authMiddleware");
const { authenticate, refreshToken } = require("../middleware/authTools");

//SIGNUP
const signup = async (req, res, next) => {
  try {
    const user = new UserModel({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 8),
    });
    if (req.body.password && req.body.email && req.body.username) {
      await user.save();
      const { _id } = await user.save();
      res.status(201).send(user);
    } else throw new Error("Email, username and password are required");
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

    if (user === null) {
      res.status(404).send({ error: "user not found" });
    } else if (user.error) {
      res.stauts(403).send(user);
    } else {
      const token = await authenticate(user);
      console.log(token);
      //add cookie
    }
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

/* const addNewUser = async (req, res, next) => {
  try {
    let newUser = new Fan(req.body);
    let user = await newUser.save();
    console.log("user", user);

    //need to add cookie later
    res.status(201).send(user);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
}; */

module.exports = { signup, login, allUsers };
