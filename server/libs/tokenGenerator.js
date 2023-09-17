const config = require("../config/config");
const jwt = require("jsonwebtoken");

const tokenGenerator = async (user, time) => {
  const secret = config.secret;
  token = await jwt.sign(
    {
      _id: user._id,
      email: user.email,
      admin: user.is_admin,
    },
    secret,
    {
      expiresIn: time,
      issuer: "LivingIn.com",
      subject: "userInfo",
    }
  );
  return {
    access_token: token,
    email: user.email,
    nickname: user.nickname,
    icon: user.icon,
  };
};

module.exports = tokenGenerator;
