import React, { useEffect, useState } from "react";
import { message, Menu, Spin } from "antd";
import { withRouter } from "react-router-dom";
import Verify from "../../libs/Verify";
import "./Main.css";
import ModalButton from "./Modal/ModalButton.js";
import NewPost from "./Post/NewPost";
import RecommendPost from "./Post/RecommendPost";
import { PlusOutlined } from "@ant-design/icons";
import CategoryPost from "./Post/CategoryPost";
import Header from "../../libs/Header/Header";
import Footer from "../../libs/Footer/Footer";
import LogOut from "../../libs/LogOut";
import axios from "axios";

function MainPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [Favcategory, setFavCategory] = useState("");
  const [userID, setUserID] = useState("");

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
        setFavCategory(user.favorite_category);
        setUserID(user._id);
        setIsLoading(false);
      };
      getUser();
    }

    if (!sessionStorage.isLogin) {
      message.error("로그인이 필요합니다.");
      return props.history.push("/login");
    } else {
      const res = Verify(
        JSON.parse(sessionStorage.getItem("token_info")).access_token,
        JSON.parse(sessionStorage.getItem("token_info")).token_type,
        props
      );

      res.then((result) => {
        if (result !== undefined) {
          try {
            const token_type = JSON.parse(sessionStorage.getItem("token_info"))
              .token_type;
            sessionStorage.removeItem("token_info");
            sessionStorage.setItem(
              "token_info",
              JSON.stringify({
                token_type: token_type,
                access_token: result.access_token,
              })
            );
          } catch {}
        }
      });
    }
  }, [isLoading, props]);

  // 메인 젤 위 메뉴이동
  const [now, setNow] = useState("요리");
  const handleClick = (e) => {
    console.log("click ", e);
    setNow(e.key);
  };

  return (
    <div className="main_page">
      {/* header */}
      <Header {...props} />

      {/* navigation */}
      <section className="main">
        {Favcategory == null ? (
          <></>
        ) : (
          <article>
            <h2 className="blind">최신 팁</h2>
            <div className="tip">
              <header className="underline">
                <h3 className="art_title">
                  <a className="logout2">이런글 어때?</a>
                </h3>
                {isLoading ? (
                  <div></div>
                ) : (
                  <div>
                    <a
                      className="logout2"
                      onClick={() => {
                        LogOut(props);
                      }}
                    >
                      로그아웃
                    </a>
                  </div>
                )}
              </header>
              <div className="margin"></div>
              {/* <Divider orientation="left">Small Size</Divider> */}
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 318,
                  }}
                >
                  <Spin size="large" tip="Loading..." />
                </div>
              ) : (
                <div>
                  <RecommendPost category={Favcategory} id={userID} />
                  <div className="margin">
                    [조회수 높은 글 다섯개만 표시됩니다.]
                  </div>
                </div>
              )}
            </div>
            <div className="box3"></div>
          </article>
        )}

        <article>
          <h2 className="blind">최신 팁</h2>
          <div className="tip">
            <header className="underline2">
              {Favcategory != null ? (
                <div></div>
              ) : (
                <div>
                  <a
                    className="logout"
                    onClick={() => {
                      LogOut(props);
                    }}
                  >
                    로그아웃
                  </a>
                </div>
              )}
              <Menu
                onClick={handleClick}
                selectedKeys={[now]}
                mode="horizontal"
              >
                {now === "요리" ? (
                  <Menu.Item key="요리" className="content_title_select">
                    <b>요리</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="요리" className="content_title">
                    <b>요리</b>
                  </Menu.Item>
                )}

                {now === "가전" ? (
                  <Menu.Item key="가전" className="content_title_select">
                    <b>가전</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="가전" className="content_title">
                    <b>가전</b>
                  </Menu.Item>
                )}

                {now === "생활" ? (
                  <Menu.Item key="생활" className="content_title_select">
                    <b>생활</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="생활" className="content_title">
                    <b>생활</b>
                  </Menu.Item>
                )}

                {now === "욕실" ? (
                  <Menu.Item key="욕실" className="content_title_select">
                    <b>욕실</b>
                  </Menu.Item>
                ) : (
                  <Menu.Item key="욕실" className="content_title">
                    <b>욕실</b>
                  </Menu.Item>
                )}
              </Menu>
            </header>

            <div className="margin"></div>
            {isLoading ? <></> : <CategoryPost category={now} />}
          </div>
        </article>

        <br />
      </section>

      {/* main */}
      <section className="main">
        <article>
          <h2 className="blind">최신 팁</h2>
          <div className="tip">
            <header className="underline">
              <h3 className="art_title">
                <a href="/">NEW TIP</a>
              </h3>
              <a href="/board" className="modal">
                <PlusOutlined /> 더보기
              </a>
            </header>
            <div className="margin"></div>
            {/* <Divider orientation="left">Small Size</Divider> */}
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 318,
                }}
              >
                <Spin size="large" tip="Loading..." />
              </div>
            ) : (
              <NewPost />
            )}
            <div className="margin">[최신 글 다섯개만 표시됩니다.]</div>
          </div>
        </article>

        <div className="box4"></div>
      </section>
      <Footer />
    </div>
  );
}

export default withRouter(MainPage);
