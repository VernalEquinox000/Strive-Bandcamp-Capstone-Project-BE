const mongoose = require("mongoose");
const FanSchema = require("../models/fanModel");
const Fan = mongoose.model("Fan", FanSchema);

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

module.exports = { addNewFan };
