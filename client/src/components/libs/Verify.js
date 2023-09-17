import { message } from "antd";
import axios from "axios";
const Verify = async (token, token_type, props) => {
  try {
    let url;
    if (token_type === "local") url = "/auth/verify";
    else if (token_type === "google") url = "/auth/verify/google";
    else if (token_type === "kakao") url = "/auth/verify/kakao";
    const res = await axios({
      method: "POST",
      url: url,
      headers: {
        "x-access-token": token,
      },
    });
    const re_token = res.data.result.access_token;

    if (re_token) {
      message.info("토큰 재갱신", 1);
      return { access_token: re_token };
    }
  } catch (e) {
    return message.error(
      "로그인이 필요합니다.",
      2,
      props.history.push("/login")
    );
  }
};

export default Verify;
