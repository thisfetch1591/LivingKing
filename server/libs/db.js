const mongoose = require("mongoose");
const config = require("../config/config");

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => console.log("Connected to mongod server"));

mongoose.connect(config.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = db;
