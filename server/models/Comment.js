const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getCurrentDate = require("../libs/getCurrentDate");

mongoose.set("useCreateIndex", true);

const commentSchema = new Schema({
  post_id: { type: String, required: true },
  writer: { type: String, required: true },
  content: { type: String, required: true },
  icon: { type: String },
  created_At: { type: Date, default: Date.now },
  updated_At: { type: Date, default: Date.now },
  is_Deleted: { type: Boolean, default: false },
});

commentSchema.statics.create = function (post_id, writer, icon, content) {
  const comment = new this({
    post_id,
    writer,
    icon,
    content,
  });
  const date = getCurrentDate();
  comment.created_At = date;
  comment.updated_At = date;
  return comment.save();
};

commentSchema.statics.findByPostId = function (post_id) {
  return this.find({ post_id, is_Deleted: false })
    .sort({ created_At: -1 })
    .exec();
};

module.exports = mongoose.model("Comment", commentSchema);
