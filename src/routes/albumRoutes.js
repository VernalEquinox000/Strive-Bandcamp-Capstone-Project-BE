const {
  addAlbum,
  getAllAlbums,
  getAlbumQuery,
  getSingleAlbum,
  editAlbum,
  deleteAlbum,
} = require("../controllers/albumController");

const routes = (app) => {
  app.route("/albums").post(addAlbum).get(getAllAlbums).get(getAlbumQuery);
  app
    .route("/albums/:albumId")
    .get(getSingleAlbum)
    .put(editAlbum)
    .delete(deleteAlbum);
};

module.exports = routes;
