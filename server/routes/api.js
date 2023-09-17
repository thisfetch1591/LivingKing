const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("../config/config");

router.get("/userinfo", async (req, res) => {
  try {
    const { access_token, type } = req.query;
    let result;
    let email;
    let user;
    if (type === "local") {
      result = await jwt.verify(access_token, config.secret);
      email = result.email;
      user = await User.findOneByEmail(email);
    } else if (type === "google") {
      result = await axios({
        method: "GET",
        url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,
      });
      email = result.data.email;
      user = await User.findOneByEmail(email);
    } else if (type === "kakao") {
      result = await axios({
        method: "GET",
        url: "https://kapi.kakao.com./v1/user/access_token_info",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      user = await User.findOneBySocialId(result.data.id);
    }
    res.status(200).json({ result: "success", user: user });
  } catch (err) {
    res.status(404).json({ result: "fail" });
  }
});

router.get("/getUserIcon", async (req, res) => {
  const { nickname } = req.query;
  const user = await User.findOneByNick(nickname);
  User.findOne({ nickname: nickname }, (err, user) => {
    if (err) throw err;
    res.status(200).json(user);
  });
});

module.exports = router;
