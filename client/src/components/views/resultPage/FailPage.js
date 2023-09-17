import React from "react";
import { Result, Button } from "antd";

const FailPage = (props) => {
  const closeWindow = () => {
    window.open("", "_self").close();
  };
  let { title } = props.history.location.state;
  let subtitle;
  if (title === "password") {
    title = "비밀번호 변경 실패";
    subtitle = "잘못된 인증 토큰이거나 인증시간이 만료되었습니다.";
  } else {
    title = "이메일 인증 실패";
    subtitle =
      "이미 이메일 인증을 시도하였거나 잘못된 인증 토큰이거나 인증시간이 만료되었습니다. 인증시간이 만료되었을 경우 해당 계정 정보를 파기합니다.";
  }
  return (
    <Result
      status="error"
      title={title}
      subTitle={subtitle}
      extra={[
        <Button onClick={closeWindow} danger>
          창닫기
        </Button>,
      ]}
    ></Result>
  );
};

export default FailPage;
