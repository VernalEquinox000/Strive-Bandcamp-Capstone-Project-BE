const { signup, allUsers } = require("../controllers/userController");

const routes = (app) => {
  app.route("/user/signup").post(signup);
  app.route("/user").get(allUsers);
};

module.exports = routes;
