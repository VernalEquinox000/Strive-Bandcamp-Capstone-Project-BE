const { signup, allUsers } = require("../controllers/userController");

const routes = (app) => {
  app.route("/users/signup").post(signup);
  app.route("/users").get(allUsers);
};

module.exports = routes;
