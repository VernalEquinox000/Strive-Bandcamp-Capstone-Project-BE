const { Schema, model } = require("mongoose");

const ArticleSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: "Bandcamp",
    },
    artistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cover: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = ArticleSchema;
