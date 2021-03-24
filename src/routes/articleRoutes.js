const {
  allArticles,
  articleById,
  addArticle,
} = require("../controllers/articleController");

const routes = (app) => {
  app.route("/articles").post(addArticle).get(allArticles);
};

module.exports = routes;
