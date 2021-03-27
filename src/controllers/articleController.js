const mongoose = require("mongoose");
const ArticleSchema = require("../models/articleModel");
const ArticleModel = mongoose.model("Article", ArticleSchema);

//GET all articles
const allArticles = async (req, res, next) => {
  try {
    const articles = await ArticleModel.find();
    if (articles.length !== 0) {
      res.status(200).send(articles);
    } else {
      let error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//GET article by id
const articleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await ArticleModel.findById(id);
    //need to add .populate("user");
    if (article) {
      res.send(article);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading articles list a problem occurred!");
  }
};

//POST article
const addArticle = async (req, res, next) => {
  try {
    const newArticle = new ArticleModel(req.body);
    const { _id } = await newArticle.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
};

//PUT article
const editArticle = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true, //new Parameters
        new: true,
      }
    );
    if (article) {
      res.send(article);
    } else {
      const error = new Error(`article not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//DELETE articles
const deleteArticle = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);
    if (article) {
      res.send("Deleted");
    } else {
      const error = new Error(`article with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allArticles,
  articleById,
  addArticle,
  editArticle,
  deleteArticle,
};
