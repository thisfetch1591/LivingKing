import React from "react";
import { Result } from "antd";
import { Link } from "react-router-dom";

const SuccessPage = (props) => {
  let title;
  if (
    !props.history.location.state ||
    Object.keys(props.history.location.state).length === 0
  ) {
    title = "이메일 인증 성공!";
  } else {
    title = props.history.location.state.title;
    if (title === "password") title = "비밀번호 변경 성공!";
  }
  return (
    <Result
      status="success"
      title={title}
      subTitle="로그인 페이지에서 로그인 해주세요."
      extra={[<Link to="/login">로그인하기</Link>]}
    />
  );
};

export default SuccessPage;
