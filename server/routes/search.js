const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/posts", async (req, res) => {
  try {
    let length = Number(req.query.length);
    let sort_type = req.query.sort_type;
    if (!length) length = 0;
    if (!sort_type) {
      sort_type = "created_At";
    }
    let obj = {};
    obj[sort_type] = -1;
    const { title } = req.query;
    const { writer } = req.query;
    const { tag } = req.query;
    const { all } = req.query;
    const { fav } = req.query;
    let post;
    if (fav) {
      if (title) {
        post = await Post.find({
          $and: [{ title: { $regex: title } }, { category: fav }],
        })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
      if (writer) {
        post = await Post.find({
          $and: [{ writer: { $regex: writer } }, { category: fav }],
        })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
      if (tag) {
        post = await Post.find({
          $and: [{ hash_Tags: { $regex: tag } }, { category: fav }],
        })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
      if (all) {
        post = await Post.find({
          $and: [
            { category: fav },
            {
              $or: [
                { title: { $regex: all } },
                { writer: { $regex: all } },
                { hash_Tags: { $regex: all } },
              ],
            },
          ],
        })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
    } else {
      if (title) {
        post = await Post.find({ title: { $regex: title } })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
      if (writer) {
        post = await Post.find({ writer: { $regex: writer } })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
      if (tag) {
        post = await Post.find({ hash_Tags: { $regex: tag } })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
      if (all) {
        post = await Post.find({
          $or: [
            { title: { $regex: all } },
            { writer: { $regex: all } },
            { hash_Tags: { $regex: all } },
          ],
        })
          .sort(obj)
          .skip(length)
          .limit(6);
      }
    }
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403);
  }
});

module.exports = router;
