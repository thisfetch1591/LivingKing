const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getCurrentDate = require("../libs/getCurrentDate");

mongoose.set("useCreateIndex", true);

const postSchema = new Schema({
  writer: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  created_At: { type: Date },
  updated_At: { type: Date },
  likes: { type: Array, default: [] },
  dislikes: { type: Array, default: [] },
  hits: { type: Number, default: 0 },
  views: { type: Array, default: [] },
  hash_Tags: { type: Array, default: [] },
  is_Deleted: { type: Boolean, default: false },
  thumbnail: { type: String },
});

postSchema.statics.create = function (
  title,
  content,
  writer,
  hash_Tags,
  category,
  thumbnail,
  views
) {
  const post = new this({
    title,
    content,
    writer,
    hash_Tags,
    category,
    thumbnail,
    views,
  });
  const date = getCurrentDate();
  post.created_At = date;
  post.updated_At = date;
  return post.save();
};

postSchema.statics.findOneById = function (id) {
  return this.findOne({ id }).exec();
};

postSchema.statics.findOneByCategory = function (category) {
  return this.findOne({ category }).exec();
};

postSchema.statics.findOneByTitle = function (title) {
  return this.findOne({ title: { $regex: title } }).exec();
};

postSchema.statics.findOneByWriter = function (writer) {
  return this.findOne({ writer: { $regex: writer } }).exec();
};

postSchema.statics.findOneByValue = function (value) {
  return this.findOne({
    $or: [{ title: { $regex: value } }, { writer: { $regex: value } }],
  }).exec();
};

module.exports = mongoose.model("Post", postSchema);
