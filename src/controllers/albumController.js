const mongoose = require("mongoose");
const AlbumSchema = require("../models/albumModel");
const AlbumModel = mongoose.model("Album", AlbumSchema);
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../middleware/cloudinary");
//new below
const CloudmersiveVideoApiClient = require("cloudmersive-video-api-client");
const defaultClient = CloudmersiveVideoApiClient.ApiClient.instance;

//
const cloudStorageCovers = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "albumCovers",
  },
});

const cloudMulterCovers = multer({ storage: cloudStorageCovers });

const cloudStorageSongs = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "albumFiles",
    resource_type: "auto",
    allowed_formats: ["wav", "mp3", "flac", "m4a"],
  },
});

const cloudMulterSongs = multer({ storage: cloudStorageSongs });

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
    const album = await AlbumModel.findById(id).populate("albumSongs");
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
    const id = req.params.albumId;
    const album = await AlbumModel.findByIdAndUpdate(id, req.body, {
      runValidators: true, //new Parameters
      new: true,
    });
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
    const id = req.params.albumId;
    const album = await AlbumModel.findByIdAndDelete(id);
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
    const id = req.params.albumId;
    const album = await AlbumModel.findById(id, {
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
  const albumId = req.params.albumId;
  const songId = req.params.songId;
  try {
    const { songs } = await AlbumModel.findOne(
      {
        _id: mongoose.Types.ObjectId(albumId),
      },
      {
        _id: 0,
        songs: {
          $elemMatch: { _id: mongoose.Types.ObjectId(songId) },
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
        {
          $set: { "songs.$": songToReplace },
        },
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
    const id = req.params.albumId;
    const addPicture = await AlbumModel.findByIdAndUpdate(id, {
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
  /* try {
    const id = req.params.albumId;
    const addPicture = await AlbumModel.findByIdAndUpdate(id, {
      songs: {
        $set: {
          audioFile: req.file.path,
        },
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
}; */
  try {
    const albumId = req.params.albumId;
    const songId = req.params.songId;
    const { songs } = await AlbumModel.findOne(
      {
        _id: mongoose.Types.ObjectId(albumId),
      },
      {
        _id: 0,
        songs: {
          $elemMatch: { _id: mongoose.Types.ObjectId(songId) },
        },
      }
    );
    console.log(songs);
    if (songs && songs.length > 0) {
      const songToReplace = { ...songs[0].toObject(), ...req.file.path };
      console.log(songToReplace);
      mongoose.set("useFindAndModify", false);
      const fileToSong = await AlbumModel.findOneAndUpdate(
        { _id: albumId, "songs._id": songId },
        { $set: { "songs.$.audioFile": req.file.path } },
        { new: true }
      ).exec();
      /* mongoose.set("useFindAndModify", false);
    const modifiedSong = await AlbumModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(albumId),
        "songs._id": mongoose.Types.ObjectId(songId),
      },
      {
        songs: {
          $elemMatch: { _id: mongoose.Types.ObjectId(songId) },
          $set: { audioFile: req.file.path },
        },
      }
    );
    console.log(modifiedSong);*/
      res.send(fileToSong);
    } else {
      res.send("File not found!");
    }
  } catch (error) {
    console.log(error);
  }
};

const convertAudio = async (req, res, next) => {
  // Configure API key authorization: Apikey
  const Apikey = defaultClient.authentications["Apikey"];
  Apikey.apiKey = process.env.CM_API_KEY;

  var apiInstance = new CloudmersiveVideoApiClient.AudioApi();

  var opts = {
    //inputFile: Buffer.from(fs.readFileSync("C:\\temp\\inputfile").buffer), // File | Input file to perform the operation on.
    fileUrl:
      "https://res.cloudinary.com/vernalequinox000/video/upload/v1617778299/albumFiles/vqlcgsjycwuxfz6oek1g.wav", // String | Optional; URL of an audio file being used for conversion. Use this option for files larger than 2GB.
    bitRate: 320, // Number | Optional; Specify the desired bitrate of the converted audio file in kilobytes per second (kB/s). Value may be between 48 and 1,411. By default, the optimal bitrate will be chosen automatically.
  };

  var callback = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log("API called successfully. Returned data: " + data);
    }
  };
  const file = apiInstance.audioConvertToMp3(opts, callback);
  res.send(file);
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
  cloudMulterCovers,
  addAlbumCover,
  cloudMulterSongs,
  addSongFile,
  convertAudio,
};
