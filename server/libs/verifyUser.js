const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const axios = require("axios");

module.exports = async (token_type, access_token) => {
  let user, verify;
  if (token_type === "local") {
    verify = await jwt.verify(access_token, config.secret);
    user = await User.findOneByEmail(verify.email);
  } else if (token_type === "kakao") {
    verify = await axios({
      method: "GET",
      url: "https://kapi.kakao.com./v1/user/access_token_info",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    user = await User.findOneBySocialId(verify.data.id);
  } else if (token_type === "google") {
    verify = await axios({
      method: "GET",
      url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,
    });
    user = await User.findOneByEmail(verify.data.email);
  }
  return user;
};
