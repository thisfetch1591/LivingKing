import moment from "moment-timezone";
const getFormatdate = (date) => {
  const date2 = new Date(date);
  let result = moment
    .utc(date2.toUTCString())
    .tz("Asia/Seoul")
    .format("YYYY-MM-DD HH:mm");
  return result;
};
export default getFormatdate;
