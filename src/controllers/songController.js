const mongoose = require("mongoose");
const SongSchema = require("../models/songModel");
const SongModel = mongoose.model("Song", SongSchema);

const addSong = async (req, res, next) => {
  try {
    const newSong = new SongModel(req.body);
    const { _id } = await newSong.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
};

module.exports = { addSong };
