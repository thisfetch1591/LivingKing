import React, { useEffect, useState } from "react";
import { Avatar, Card, Modal, Skeleton } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./UserInfo.css";
import axios from "axios";
import PieChart from "../../libs/PieChart";

function UserInfo(props) {
  // 올렸을때 상태
  const [isLoading, setIsLoading] = useState(true);

  // 유저 아이콘 이메일 저장
  const [icon, setIcon] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNick] = useState("");
  const [Favcategory, setFavCategory] = useState("");

  const getUserInfo = async () => {
    const { access_token, token_type } = JSON.parse(
      sessionStorage.getItem("token_info")
    );
    const result = await axios.get("/api/userinfo", {
      params: {
        access_token: access_token,
        type: token_type,
      },
    });
    return result.data.user;
  };

  useEffect(() => {
    if (isLoading && sessionStorage.isLogin === "1") {
      console.log("reload");

      const getUser = async () => {
        const user = await getUserInfo();
        console.log(user);
        setIcon(user.icon);
        setEmail(user.email);
        setNick(user.nickname);
        setFavCategory(user.favorite_category);
        setIsLoading(false);
      };
      getUser();
    }
  }, [props, isLoading]);

  const { Meta } = Card;
  const info = () => {
    Modal.info({
      title: "나의 선호 카테고리 차트",
      content: <PieChart />,
      width: 800,
      onOk() {},
    });
  };
  return (
    <>
      {isLoading ? (
        <div style={{ width: 300 }}>
          <Skeleton avatar paragraph={{ rows: 4 }} active />
        </div>
      ) : (
        <Card
          style={{ width: 300 }}
          actions={[
            <Link
              to={{
                pathname: "/settings",
              }}
            >
              <SettingOutlined key="setting" />
            </Link>,
            <Link
              to={{
                pathname: "/write",
              }}
            >
              <EditOutlined key="edit" type="text" className="header__write" />
            </Link>,
            <EllipsisOutlined key="ellipsis" onClick={info} />,
          ]}
        >
          <Meta
            avatar={
              icon === "" ? (
                <Avatar>{nickname}</Avatar>
              ) : (
                <Avatar size="large" src={icon}>
                  {nickname}
                </Avatar>
              )
            }
            title={nickname + "님 환영환영^^*."}
            description={email}
          />
          <br></br>
          <span>
            선호하는 카테고리 :{" "}
            <b>{Favcategory ? Favcategory : "데이터 수집중!"}</b>
          </span>
        </Card>
      )}
    </>
  );
}

export default UserInfo;
