const mongoose = require("mongoose");
const FanSchema = require("../models/fanModel");
const Fan = mongoose.model("Fan", FanSchema);
const { authorizeFan } = require("../middleware/authMiddleware");
const { authenticateFan, refreshToken } = require("../middleware/authTools");
const bcrypt = require("bcryptjs");
//SIGNUP Fan
const signupFan = async (req, res, next) => {
  try {
    const fan = new Fan({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 8),
    });
    if (req.body.password && req.body.email && req.body.username) {
      await fan.save();
      const { _id } = await fan.save();
      res.status(201).send(fan);
    } else throw new Error("Email, username and password are required");
  } catch (error) {}
};

//GET Fans
const allFans = async (req, res, next) => {
  try {
    const fans = await Fan.find();
    res.send(fans);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

/* const thisFan = async (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
} */

const addNewFan = async (req, res, next) => {
  try {
    let newFan = new Fan(req.body);
    let fan = await newFan.save();
    console.log("fan", fan);

    //need to add cookie later
    res.status(201).send(fan);
  } catch (error) {
    error.httpStatusCode = 400;
    next(error);
  }
};

module.exports = { signupFan, allFans, addNewFan };
