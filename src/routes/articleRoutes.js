const {
  allArticles,
  articleById,
  addArticle,
  editArticle,
  deleteArticle,
} = require("../controllers/articleController");

const routes = (app) => {
  app.route("/articles").post(addArticle).get(allArticles);
  app.route("/articles/:id").get(articleById, editArticle, deleteArticle);
};

module.exports = routes;
