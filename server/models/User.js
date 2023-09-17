const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

mongoose.set("useCreateIndex", true);
const getCurrentDate = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
  return new Date(
    Date.UTC(year, month, today, hours, minutes, seconds, milliseconds)
  );
};

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  birthday: { type: Date },
  nickname: { type: String, required: true },
  created_At: { type: Date, default: getCurrentDate() },
  social_id: { type: String },
  icon: String,
  hashTags: { type: Array },
  refresh_token: String,
  is_admin: { type: Boolean, required: true, default: false },
  is_active: { type: Boolean, required: true, default: false },
  favorite_category: { type: String },
  favorite_score: { type: Array, default: [0, 0, 0, 0] },
});

userSchema.statics.create = function (
  email,
  password,
  nickname,
  icon,
  name,
  birthday,
  hashTags,
  social_id,
  is_admin
) {
  const user = new this({
    email,
    password,
    nickname,
    icon,
    name,
    birthday,
    hashTags,
    social_id,
    is_admin,
  });

  return user.save();
};

userSchema.statics.findOneByEmail = function (email) {
  return this.findOne({ email }).exec();
};

userSchema.statics.findOneByNick = function (nickname) {
  return this.findOne({ nickname }).exec();
};

userSchema.statics.findOneByName = function (name) {
  return this.findOne({ name }).exec();
};

userSchema.statics.findOneBySocialId = function (social_id) {
  return this.findOne({ social_id }).exec();
};
userSchema.methods.verify = function async(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

userSchema.methods.assginAdmin = function () {
  this.is_admin = true;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
