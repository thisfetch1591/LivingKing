import axios from "axios";
import { message } from "antd";
const LogOut = async (props) => {
  let url;
  const { token_type, access_token } = JSON.parse(
    sessionStorage.getItem("token_info")
  );
  if (token_type === "local") {
    url = "/auth/logout";
  } else if (token_type === "google") {
    url = "auth/logout/google";
  } else if (token_type === "kakao") {
    url = "auth/logout/kakao";
  }
  sessionStorage.clear();
  axios.post(url, { access_token: access_token });
  message.success("로그아웃 완료!", 1);
  return props.history.push("/login");
};

export default LogOut;
