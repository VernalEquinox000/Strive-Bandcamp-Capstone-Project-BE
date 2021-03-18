const {
  signup,
  login,
  logout,
  allUsers,
} = require("../controllers/userController");
const { authorize } = require("../middleware/authMiddleware");

const routes = (app) => {
  app.route("/users/signup").post(signup);
  app.route("/users/login").post(login);
  app.route("/users/logout").post(authorize, logout);
  app.route("/users").get(allUsers);
};

module.exports = routes;
