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

//GET all songs
const getAllSongs = async (req, res, next) => {
  try {
    const songs = await SongModel.find();
    //also findOne or findById
    res.send(songs);
  } catch (error) {
    next(error);
  }
};

//GET songs query
const getSongsQuery = async (req, res, next) => {
  try {
    const query = q2m(req.query);
    console.log(query);
    const totsongs = await SongModel.countDocuments(query.criteria);

    const songs = await SongModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    //.populate("songs", { _id: 0, title: 1 });
    res.send({ links: query.links("/songs", totSongs), songs });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//GET /songs/:songId
const getSingleSong = async (req, res, next) => {
  try {
    const id = req.params.songId;
    const song = await SongModel.findById(id);
    if (song) {
      res.send(song);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading songs list a problem occurred!");
  }
};

//PUT songs/:songId
const editSong = async (req, res, next) => {
  try {
    const id = req.params.songId;
    const song = await SongModel.findByIdAndUpdate(id, req.body, {
      runValidators: true, //new Parameters
      new: true,
    });
    if (song) {
      res.send(song);
    } else {
      const error = new Error(`song with id ${req.params.songId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//DELETE songs/:songId
const deleteSong = async (req, res, next) => {
  try {
    const id = req.params.songId;
    const song = await SongModel.findByIdAndDelete(id);
    if (song) {
      res.send("Deleted");
    } else {
      const error = new Error(`song with id ${req.params.songId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//DOWNLOAD song
const downloadSong = async (req, res, next) => {
  try {
    const fs = require("fs");
    const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

    const ffmpeg = createFFmpeg({ log: true });

    (async () => {
      await ffmpeg.load();
      ffmpeg.FS("writeFile", "test.wav", await fetchFile("./test.wav"));
      await ffmpeg.run("-i", "test.avi", "test.mp4");
      await fs.promises.writeFile(
        "./test.mp4",
        ffmpeg.FS("readFile", "test.mp4")
      );
      process.exit(0);
    })();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSong,
  getAllSongs,
  getSongsQuery,
  getSingleSong,
  editSong,
  deleteSong,
};
