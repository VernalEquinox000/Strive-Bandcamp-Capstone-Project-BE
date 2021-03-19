const {
  signup,
  login,
  logout,
  allUsers,
  meUser,
  updateUser,
  deleteUser,
  refreshToken,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authMiddleware");

const routes = (app) => {
  app.route("/users/signup").post(signup);
  app.route("/users/login").post(login);
  app.route("/users/logout").post(authorize, logout);
  app.route("/users").get(authorize, allUsers);
  app
    .route("/users/me")
    .get(authorize, meUser)
    .put(authorize, updateUser)
    .delete(authorize, deleteUser);
  app.route("/users/refreshToken").post(refreshToken);
};

module.exports = routes;
