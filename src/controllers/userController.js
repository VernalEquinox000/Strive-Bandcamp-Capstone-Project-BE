const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");
const User = mongoose.model("User", UserSchema);
const { authorize } = require("../middleware/authMiddleware");
const { authenticate, refreshToken } = require("../middleware/authTools");
const bcrypt = require("bcryptjs");
//SIGNUP
const signup = async (req, res, next) => {
  try {
    const user = new User({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 8),
    });
    if (req.body.password && req.body.email && req.body.username) {
      await user.save();
      const { _id } = await user.save();
      res.status(201).send(user);
    } else throw new Error("Email, username and password are required");
  } catch (error) {}
};

//GET users
const allUsers = async (req, res, next) => {
  try {
    const users = await User.find();
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

module.exports = { signup, allUsers };
