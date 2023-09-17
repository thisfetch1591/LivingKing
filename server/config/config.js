const host = require("../config/host");
module.exports = {
  secret: "SeCrEtKeYfOrHaShInG",
  mongoURI:
    "mongodb+srv://dbUser:12456378@cluster0.afczn.mongodb.net/livingKing?retryWrites=true&w=majority",
  google_clientID:
    "544956299484-cb4buam4sdchdl5t28h7cmvq41hc99uq.apps.googleusercontent.com",
  google_client_secret: "DyqwJfBNa6oqZCeTp4foy80U",
  google_callbackURL: `${host.serverHost()}/auth/google/callback`,
  kakao_REST_API_KEY: "b9f68f9f12f221ea7f8a511c631102e9",
  google_email: "help.livingin@gmail.com",
  google_password: "injecs112!",
};
