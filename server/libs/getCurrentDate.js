const moment = require("moment-timezone");
const getCurrentDate = () => {
  const date = new Date();

  let result;
  result = moment.utc(date.toUTCString()).tz("Asia/Seoul").format();
  return result;
};

module.exports = getCurrentDate;
