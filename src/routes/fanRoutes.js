const { addNewFan } = require("../controllers/fanController");

const routes = (app) => {
  app.route("/fans").post(addNewFan);
};

module.exports = routes;
