const { allFans, addNewFan } = require("../controllers/fanController");

const routes = (app) => {
  app.route("/fans").post(addNewFan).get(allFans);
};

module.exports = routes;
