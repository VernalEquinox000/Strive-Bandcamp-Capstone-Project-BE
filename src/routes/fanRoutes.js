const {
  signupFan,
  allFans,
  addNewFan,
} = require("../controllers/fanController");

const routes = (app) => {
  app.route("/fans/signup").post(signupFan);
  app.route("/fans").post(addNewFan).get(allFans);
};

module.exports = routes;
