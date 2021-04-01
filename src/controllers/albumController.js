const mongoose = require("mongoose");
const AlbumSchema = require("../models/albumModel");
const AlbumModel = mongoose.model("Album", AlbumSchema);
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../middleware/cloudinary");

//
const cloudStorageCover = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "albumCovers",
  },
});

const cloudMulterCover = multer({ storage: cloudStorageCover });

const cloudStorageFile = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "albumCovers",
  },
});

const cloudMulterFile = multer({ storage: cloudStorageFile });

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

//GET /albums/:albumId/songs
const getAllAlbumSongs = async (req, res, next) => {
  try {
    const album = await AlbumModel.findById(req.params.albumId, {
      songs: 1,
      _id: 0,
    });
    res.send(album);
  } catch (error) {
    next(error);
  }
};

//GET /albums/:albumId/songs/:songId
const getSingleAlbumSong = async (req, res, next) => {
  try {
    const { songs } = await AlbumModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.albumId),
      },
      {
        _id: 0,
        songs: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.songId) },
        },
      }
    );

    if (songs && songs.length > 0) {
      res.send(songs[0]);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

//POST /albums/:albumId/songs
const addSongToAlbum = async (req, res, next) => {
  try {
    const songsAlbum = await AlbumModel.findByIdAndUpdate(req.params.albumId, {
      $push: {
        songs: {
          ...req.body,
        },
      },
    });
    res.status(201).send(songsAlbum);
  } catch (error) {
    next(error);
  }
};

//PUT /albums/:albumId/songs/:songId
const editAlbumSong = async (req, res, next) => {
  try {
    const { songs } = await AlbumModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.albumId),
      },
      {
        _id: 0,
        songs: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.songId) },
        },
      }
    );
    console.log(songs);
    if (songs && songs.length > 0) {
      const songToReplace = { ...songs[0].toObject(), ...req.body };
      console.log(songToReplace);
      mongoose.set("useFindAndModify", false);
      const modifiedSong = await AlbumModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.albumId),
          "songs._id": mongoose.Types.ObjectId(req.params.songId),
        },
        { $set: { "songs.$": songToReplace } },
        {
          runValidators: true,
          new: true,
        }
      );
      console.log(modifiedSong);
      res.send(modifiedSong);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteAlbumSong = async (req, res, next) => {
  try {
    const modifiedSong = await AlbumModel.findByIdAndUpdate(
      req.params.albumId,
      {
        $pull: {
          songs: { _id: mongoose.Types.ObjectId(req.params.songId) },
        },
      },
      {
        new: true,
      }
    );
    res.send(modifiedSong);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addAlbumCover = async (req, res, next) => {
  try {
    const addPicture = await AlbumModel.findByIdAndUpdate(req._id, {
      $set: {
        cover: req.file.path,
      },
    });
    if (addPicture) {
      res.status(200).send(addPicture);
    } else {
      res.send("Album not found!");
    }
  } catch (error) {
    console.log(error);
  }
};

const addSongFile = async (req, res, next) => {
  try {
    const addFile = await AlbumModel.findByIdAndUpdate(req._id, {
      $set: {
        albumFile: req.file.path,
      },
    });
    if (addFile) {
      res.status(200).send(addFile);
    } else {
      res.send("File not found!");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addAlbum,
  getAllAlbums,
  getAlbumQuery,
  getSingleAlbum,
  editAlbum,
  deleteAlbum,
  addSongToAlbum,
  getAllAlbumSongs,
  getSingleAlbumSong,
  editAlbumSong,
  deleteAlbumSong,
  cloudMulterCover,
  addAlbumCover,
  cloudMulterFile,
  addSongFile,
};
