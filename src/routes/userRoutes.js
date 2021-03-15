const {
  signupUser,
  allUsers,
  addNewUser,
} = require("../controllers/userController");

const routes = (app) => {
  app.route("/user/signup").post(signupUser);
  app.route("/user").post(addNewUser).get(allUsers);
};

module.exports = routes;
