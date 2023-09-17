const express = require("express");
const router = express.Router();
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(config.google_clientID);
const tokenGenerator = require("../libs/tokenGenerator");
const qs = require("querystring");
const { resolve } = require("path");
const host = require("../config/host");
const { rejects } = require("assert");

const token_exp = "1h";
router.post("/vaild_check", (req, res) => {
  const { email, nickname } = req.body;
  const respond = (user) => {
    if (user) {
      throw new Error("already exist");
    } else {
      res.status(200).json({ success: true });
    }
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
      success: false,
    });
  };
  if (email !== undefined)
    User.findOneByEmail(email).then(respond).catch(onError);
  else if (nickname !== undefined)
    User.findOneByNick(nickname).then(respond).catch(onError);
});

router.post("/verify", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({ success: false, message: "not logged in" });
    }
    const result = await jwt.verify(token, config.secret);
    const exp = result.exp * 1000 - new Date().getTime();

    const respond = (result) => {
      res.status(200).json({ success: true, result });
    };

    if (!exp) {
      throw new Error("오류");
    } else if (exp <= 600000) {
      const user = await User.findOneByEmail(result.email);
      await jwt.verify(user.refresh_token, config.secret);
      const token = await tokenGenerator(user, token_exp);
      respond(token);
    } else {
      respond("");
    }
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/verify/google", (req, res) => {
  const access_token = req.headers["x-access-token"];
  const check_token = () => {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,
      }).then((res, err) => {
        if (err) reject(err);
        if (res.data.expires_in <= 600) {
          User.findOneByEmail(res.data.email).then((user) => resolve(user));
        } else resolve({ success: true });
      });
    });
  };
  const get_token = (res) => {
    return new Promise((resolve, reject) => {
      if (res._id !== undefined) {
        axios({
          method: "POST",
          url: "https://oauth2.googleapis.com/token",
          data: {
            client_id: config.google_clientID,
            client_secret: config.google_client_secret,
            refresh_token: res.refresh_token,
            grant_type: "refresh_token",
          },
        }).then((res, err) => {
          if (err) reject(err);
          const { access_token } = res.data;
          resolve({ access_token, type: "google" });
        });
      } else resolve("");
    });
  };
  const respond = (result) => {
    res.status(200).json({ success: true, result });
  };

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };
  check_token().then(get_token).then(respond).catch(onError);
});

router.post("/verify/kakao", (req, res) => {
  const access_token = req.headers["x-access-token"];
  const check_token = () => {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        url: "https://kapi.kakao.com./v1/user/access_token_info",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then((res, err) => {
        if (err) reject(err);
        if (res.data.expiresInMillis <= 600000) {
          User.findOneBySocialId(res.data.id).then((user) => resolve(user));
        } else resolve({ success: true });
      });
    });
  };

  const get_token = (res) => {
    return new Promise((resolve, reject) => {
      if (res._id !== undefined) {
        const data = {
          grant_type: "refresh_token",
          client_id: config.kakao_REST_API_KEY,
          refresh_token: res.refresh_token,
        };
        axios({
          method: "POST",
          url: "https://kauth.kakao.com/oauth/token",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify(data),
        }).then((res, err) => {
          if (err) reject(err);
          const { access_token, refresh_token } = res.data;
          if (refresh_token !== undefined) {
            user.refresh_token = refresh_token;
            user.save();
          }
          resolve({ access_token, type: "kakao" });
        });
      } else resolve("");
    });
  };

  const respond = (result) => {
    res.status(200).json({ success: true, result });
  };

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };
  check_token().then(get_token).then(respond).catch(onError);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const check = (user) => {
    if (!user) {
      throw new Error("user not exist");
    } else {
      return user.verify(password).then((result) => {
        if (result) {
          return new Promise((resolve, reject) => {
            if (!user.is_active) throw new Error("uncertified");
            tokenGenerator(user, "14d").then((result) => {
              user.refresh_token = result.access_token;
              user.save();
              tokenGenerator(user, token_exp).then((result) => {
                resolve(result);
              });
            });
          });
        } else throw new Error("password incorrect");
      });
    }
  };
  const respond = (result) => {
    const { access_token, nickname, email, icon } = result;
    res.status(200).json({
      message: "logged in successfully",
      nickname,
      email,
      icon,
      access_token,
    });
  };
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(check).then(respond).catch(onError);
});

router.post("/login/google/callback", async (req, res) => {
  const respond = (result) => {
    const { access_token, nickname, email, icon } = result;
    res.status(200).json({
      message: "logged in successfully",
      access_token,
      nickname,
      email,
      icon,
    });
  };

  const logined = await axios({
    method: "POST",
    url: "https://oauth2.googleapis.com/token",
    data: {
      code: decodeURIComponent(req.body.code),
      client_id: config.google_clientID,
      client_secret: config.google_client_secret,
      redirect_uri: `${host.clientHost()}/login/callback`,
      grant_type: "authorization_code",
    },
  });
  const { access_token, refresh_token } = logined.data;
  const getInfo = await axios({
    method: "GET",
    url: `https://oauth2.googleapis.com/tokeninfo?id_token=${logined.data.id_token}`,
  });
  const { email } = getInfo.data;
  let user = await User.findOneByEmail(email);
  if (!user) {
    const data = {
      email: getInfo.data.email,
      nickname: getInfo.data.name,
      imageUrl: getInfo.data.picture,
    };
    const create = await axios({
      method: "post",
      url: `${host.serverHost()}/users/google`,
      data: {
        googledata: data,
      },
    });
    if (create.status === 200) {
      user = await User.findOneByEmail(email);
    }
  }
  user.access_token = access_token;
  user.refresh_token = refresh_token;
  user.save();
  respond({
    nickname: getInfo.data.name,
    access_token: access_token,
    email: user.email,
    icon: user.icon,
  });
});

router.post("/login/google", (req, res) => {
  const scopes = "email profile";
  const url = client.generateAuthUrl({
    scope: scopes,
    access_type: "offline",
    prompt: "consent",
    redirect_uri: `${host.clientHost()}/login/callback`,
    client_id: config.google_clientID,
  });
  res.json({ url: url });
});

router.post("/login/kakao", async (req, res) => {
  const email = req.body.profile.kakao_account.email;

  let user = await User.findOneByEmail(email);

  if (!user) {
    const create = await axios({
      method: "post",
      url: `${host.serverHost()}/users/kakao`,
      data: {
        kakaodata: req.body,
      },
    });
    if (create.status === 200) {
      user = await User.findOneByEmail(email);
    }
  }
  user.access_token = req.body.response.access_token;
  user.refresh_token = req.body.response.refresh_token;
  user.save();
  res.status(200).json({
    message: "logged in successfully",
    nickname: req.body.profile.properties.nickname,
    access_token: req.body.response.access_token,
    email: user.email,
    icon: user.icon,
  });
});

router.post("/logout", async (req, res) => {
  const { access_token } = req.body;
  const verify = await jwt.verify(access_token, config.secret);
  const user = await User.findOneByEmail(verify.email);
  user.refresh_token = "";
  user.access_token = "";
  await user.save();
  if (user.refresh_token === "" && user.access_token === "")
    res.status(200).json({ success: true, message: "로그아웃 성공!" });
  else res.status(500).json({ success: false });
});

router.post("/logout/google", async (req, res) => {
  const { access_token } = req.body;
  const userInfo = await axios({
    method: "GET",
    url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}`,
  });
  const revoke = await axios({
    method: "POST",
    url: `https://oauth2.googleapis.com/revoke?token=${access_token}`,
    headers: {
      "Content-type": "application / x-www-form-urlencoded",
    },
  });
  if (revoke.status === 200) {
    const user = await User.findOneByEmail(userInfo.data.email);
    user.refresh_token = "";
    user.access_token = "";
    await user.save();
    if (user.refresh_token === "" && user.access_token === "")
      res.status(200).json({ success: true, message: "로그아웃 성공!" });
    else onError;
  } else onError;
  const onError = () => {
    res.status(500).json({ success: false });
  };
});

router.post("/logout/kakao", async (req, res) => {
  const { access_token } = req.body;
  const revoke = await axios({
    method: "POST",
    url: "https://kapi.kakao.com/v1/user/logout",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (revoke.status === 200) {
    const user = await User.findOneBySocialId(revoke.data.id);
    user.refresh_token = "";
    user.access_token = "";
    await user.save();
    if (user.refresh_token === "" && user.access_token === "")
      res.status(200).json({ success: true, message: "로그아웃 성공!" });
    else onError;
  } else {
    onError;
  }
  const onError = () => {
    res.status(500).json({ success: false });
  };
});

module.exports = router;
