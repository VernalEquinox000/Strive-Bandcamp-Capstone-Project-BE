const {
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
  //convertAudio,
  convertIt,
  getSongLink,
} = require("../controllers/albumController");

const routes = (app) => {
  app.route("/albums").post(addAlbum).get(getAllAlbums);

  app
    .route("/albums/:albumId")
    .get(getSingleAlbum)
    .put(editAlbum)
    .delete(deleteAlbum);
  app
    .route("/albums/:albumId/songs")
    .post(addSongToAlbum)
    .get(getAllAlbumSongs);
  app
    .route("/albums/:albumId/songs/:songId")
    .get(getSingleAlbumSong)
    .put(editAlbumSong)
    .delete(deleteAlbumSong);
  app
    .route("/albums/:albumId/albumCover")
    .post(cloudMulterCovers.single("cover"), addAlbumCover);
  app
    .route("/albums/:albumId/songs/:songId/audioFile")
    .post(cloudMulterSongs.single("audioFile"), addSongFile);
  //app.route("/albums/convertAudio").post(convertAudio);
  app.route("/albums/:albumId/songs/:songId/convertIt").post(convertIt);
  app.route("/albums/:albumId/songs/:songId/getSongLink").get(getSongLink);
};

module.exports = routes;
