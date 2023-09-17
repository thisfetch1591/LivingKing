const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const verifyUser = require("../libs/verifyUser");
const { default: Axios } = require("axios");
const host = require("../config/host");

// 글 생성 api
router.post("/", async (req, res) => {
  const {
    title,
    content,
    access_token,
    token_type,
    tags,
    category,
    thumbnail,
  } = req.body;
  const user = await verifyUser(token_type, access_token);
  let views = [];
  views.push(user._id);
  Post.create(
    title,
    content,
    user.nickname,
    tags,
    category,
    thumbnail,
    views
  ).then(async () => {
    let result = {
      type: "score",
      active: "create",
      category: category,
      access_token: access_token,
      token_type: token_type,
    };
    const update = await Axios.put(host.serverHost() + `/users`, {
      data: JSON.stringify(result),
    });
    if (update.status === 200) {
      res.status(200).json({
        message: "post successfully",
      });
    }
  });
});

// 글 조회 api
router.get("/", async (req, res) => {
  try {
    if (Object.keys(req.query).length !== 0) {
      const { id, access_token, token_type } = req.query;
      if (id) {
        const post = await Post.findById(id);
        if (post) {
          const user = await verifyUser(token_type, access_token);
          if (!post.views.includes(user._id)) {
            post.views.push(user._id);
          }
          await Post.updateOne({ _id: post._id }, { views: post.views });
          post.hits = post.hits + 1;
          let like_state = false;
          let dislike_state = false;
          post.save();
          if (post.likes.includes(user._id)) like_state = true;
          if (post.dislikes.includes(user._id)) dislike_state = true;
          return res.status(200).json({
            post: post,
            like_state: like_state,
            dislike_state: dislike_state,
          });
        }
      }
      const { category } = req.query;
      if (category) {
        let post;
        if (req.query.access_token) {
          const { access_token, type } = req.query;
          const user = await verifyUser(type, access_token);
          const user_id = user._id;
          post = await Post.find({
            $and: [{ views: { $nin: user_id } }, { category: category }],
          })
            .sort({
              hits: -1,
            })
            .limit(5);
        } else {
          post = await Post.find({ category: category }).sort({
            hits: -1,
          });
        }
        return res.status(200).json(post);
      }
      let length = Number(req.query.length);
      let sort_type = req.query.sort_type;
      if (!length) {
        length = 0;
      }
      if (!sort_type) {
        sort_type = "created_At";
      }
      let obj = {};
      obj[sort_type] = -1;
      const post = await Post.find().sort(obj).skip(length).limit(6);
      return res.status(200).json(post);
    } else {
      const post = await Post.find().sort({ created_At: -1 }).limit(5);
      return res.status(200).json(post);
    }
  } catch (err) {
    console.log(err);
  }
});

//글 수정 api
router.put("/", async (req, res) => {
  const {
    title,
    content,
    writer,
    tags,
    category,
    id,
    type,
    access_token,
    token_type,
  } = req.body.data;
  const user = await verifyUser(token_type, access_token);
  const post = await Post.findById(id);
  let like_state = false;
  let dislike_state = false;
  if (type === "liked" || type === "disliked") {
    let result = {
      type: "score",
      active: "liked",
      category: category,
      access_token: access_token,
      token_type: token_type,
    };
    await Axios.put(host.serverHost() + `/users`, {
      data: JSON.stringify(result),
    });
  }
  if (type === "liked") {
    if (!post.likes.includes(user._id)) {
      post.likes.push(user._id);
      await Post.updateOne({ _id: id }, { likes: post.likes });
      like_state = true;
    } else {
      post.likes.splice(post.likes.indexOf(user._id), 1);
      await Post.updateOne({ _id: id }, { likes: post.likes });
      like_state = false;
    }
    return res
      .status(200)
      .json({ length: post.likes.length, like_state: like_state });
  } else if (type === "disliked") {
    if (!post.dislikes.includes(user._id)) {
      post.dislikes.push(user._id);
      await Post.updateOne({ _id: id }, { dislikes: post.dislikes });
      dislike_state = true;
    } else {
      post.dislikes.splice(post.dislikes.indexOf(user._id), 1);
      await Post.updateOne({ _id: id }, { dislikes: post.dislikes });
      dislike_state = false;
    }
    return res
      .status(200)
      .json({ length: post.dislikes.length, dislike_state: dislike_state });
  }
});

//글 삭제 api
router.delete("/", async (req, res) => {
  const { id, access_token } = req.query;
});

module.exports = router;
