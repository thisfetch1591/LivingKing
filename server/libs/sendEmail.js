const nodemailer = require("nodemailer");
const config = require("../config/config");
const welcome = require("./welcome");
const findPW = require("./findPW");
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.google_email,
    pass: config.google_password,
  },
});
module.exports = (email, token, nickname, type) => {
  let subject;
  let html;
  if (type === "welcome") {
    subject = `[자취인] ${nickname}님의 회원가입 인증메일입니다.`;
    html = welcome(nickname, token);
  } else if (type === "findPw") {
    subject = `[자취인] ${nickname}님의 비밀번호 변경메일입니다.`;
    html = findPW(nickname, token);
  }
  const sendEmail = transporter.sendMail({
    from: `"LivingIn Team" <${config.google_email}>`,
    to: email,
    subject: subject,
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: html,
  });
  return sendEmail;
};
