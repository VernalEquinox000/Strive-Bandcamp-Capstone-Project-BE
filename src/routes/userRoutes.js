const { signup, login, allUsers } = require("../controllers/userController");

const routes = (app) => {
  app.route("/users/signup").post(signup);
  app.route("/users/login").post(login);
  app.route("/users").get(allUsers);
};

module.exports = routes;
