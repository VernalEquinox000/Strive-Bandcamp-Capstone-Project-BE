const mongoose = require("mongoose");
const AlbumSchema = require("../models/albumModel");
const AlbumModel = mongoose.model("Album", AlbumSchema);

//POST album
const addAlbum = async (req, res, next) => {
  try {
    const newAlbum = new AlbumModel(req.body);
    const { _id } = await newAlbum.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
};

const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await AlbumModel.find();
    //also findOne or findById
    res.send(albums);
  } catch (error) {
    next(error);
  }
};

//GET albums query
const getAlbumQuery = async (req, res, next) => {
  try {
    const query = q2m(req.query);
    console.log(query);
    const totAlbums = await AlbumModel.countDocuments(query.criteria);

    const albums = await AlbumModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)
      .populate("albumSongs", { _id: 0, title: 1 });
    res.send({ links: query.links("/albums", totAlbums), albums });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//GET /albums/:albumId
const getSingleAlbum = async (req, res, next) => {
  try {
    const id = req.params.albumId;
    const album = await AlbumModel.findById(albumId).populate("albumSongs");
    if (album) {
      res.send(album);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading albums list a problem occurred!");
  }
};

//PUT albums/:albumId
const editAlbum = async (req, res, next) => {
  try {
    const album = await AlbumModel.findByIdAndUpdate(
      req.params.albumId,
      req.body,
      {
        runValidators: true, //new Parameters
        new: true,
      }
    );
    if (album) {
      res.send(album);
    } else {
      const error = new Error(`album with id ${req.params.albumId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//DELETE albums/:albumId
const deleteAlbum = async (req, res, next) => {
  try {
    const album = await AlbumModel.findByIdAndDelete(req.params.albumId);
    if (album) {
      res.send("Deleted");
    } else {
      const error = new Error(`album with id ${req.params.albumId} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAlbum,
  getAllAlbums,
  getAlbumQuery,
  getSingleAlbum,
  editAlbum,
  deleteAlbum,
};
