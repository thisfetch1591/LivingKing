import React, { useEffect } from "react";
import { Spin, message } from "antd";

function Login_Callback(props) {
  useEffect(() => {
    let params = props.history.location.search.split("=");
    params = params[1].split("&");
    const code = { code: params[0] };
    fetch("/auth/login/google/callback", {
      method: "POST",
      body: JSON.stringify(code),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "logged in successfully") {
          new Promise((resolve, reject) => {
            console.log(res);
            sessionStorage.setItem("isLogin", 1);
            sessionStorage.setItem(
              "user",
              JSON.stringify({
                email: res.email,
                nickname: res.nickname,
                icon: res.icon,
              })
            );
            sessionStorage.setItem(
              "token_info",
              JSON.stringify({
                token_type: "google",
                access_token: res.access_token,
              })
            );
            resolve(1);
          }).then((value) => {
            if (value === 1) {
              message.info(res.nickname + "님 반갑습니다!", 1);
              return props.history.push("/");
            }
          });
        }
      });
  });

  return (
    <div>
      <Spin size="large" />
      로그인 중입니다...
    </div>
  );
}

export default Login_Callback;
