const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const axios = require("axios");
const verifyUser = require("../libs/verifyUser");
const host = require("../config/host");
const Post = require("../models/Post");
// 댓글 생성 api
router.post("/", async (req, res) => {
  const { post_id, access_token, token_type, content } = req.body;
  const user = await verifyUser(token_type, access_token);
  Comment.create(post_id, user.nickname, user.icon, content).then(async () => {
    const post = await Post.findById(post_id);
    let result = {
      type: "score",
      active: "comment",
      category: post.category,
      access_token: access_token,
      token_type: token_type,
    };
    const update = await axios.put(host.serverHost() + `/users`, {
      data: JSON.stringify(result),
    });
    if (update.status === 200) {
      res.status(200).json({
        message: "comment successfully",
      });
    }
  });
});

// 댓글 조회 api
router.get("/", async (req, res) => {
  const { post_id } = req.query;
  let comment;
  if (post_id) {
    comment = await Comment.findByPostId(post_id);
  } else {
    comment = await Comment.find({ is_Deleted: false });
  }
  if (comment !== null) {
    return res.status(200).json(comment);
  }
});

router.delete("/", async (req, res) => {
  try {
    const { access_token, token_type, id } = req.query;
    const user = await verifyUser(token_type, access_token);
    const comment = await Comment.findOne({ _id: id });
    if (user.nickname === comment.writer) {
      comment.is_Deleted = true;
      comment.save();
      return res.status(200).json({ status: "success" });
    } else {
      return res.status(400).json({ status: "fail" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
