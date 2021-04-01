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
  cloudMulterCover,
  addAlbumCover,
  cloudMulterFile,
  addSongFile,
} = require("../controllers/albumController");

const routes = (app) => {
  app.route("/albums").post(addAlbum).get(getAllAlbums).get(getAlbumQuery);
  app
    .route("/albums/:albumId")
    .get(getSingleAlbum)
    .put(editAlbum)
    .delete(deleteAlbum);
  app
    .route("/albums/:albumId/songs")
    .post(addSongToAlbum)
    .get(getSingleAlbumSong);
  app
    .route("/albums/:albumId/songs/:songId")
    .get(getSingleAlbumSong)
    .put(editAlbumSong)
    .delete(deleteAlbumSong);
  app
    .route("/albums/cover")
    .post(cloudMulterCover.single("picture"), addAlbumCover);
  app
    .route("/albums/:albumId/songs/song:songId/file")
    .post(cloudMulterFile.single("albumCovers"), addSongFile);
};

module.exports = routes;
