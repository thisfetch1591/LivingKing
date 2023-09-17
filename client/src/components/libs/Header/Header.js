import React, { useEffect, useState } from "react";
import { Popover } from "antd";
import { UserOutlined, CaretDownOutlined } from "@ant-design/icons";
import "./Header.css";
import UserInfo from "./UserInfo.js";
import QuickSearch from "./Drawer";

function Header(props) {
  // 스크롤 시 헤더 색 변경
  const [scroll, setScroll] = useState(1);
  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY < 30;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  const content = <UserInfo {...props} />;

  return (
    <header className={scroll ? "header" : "header_scroll"}>
      <section className="headermain">
        <a className="header__mainhome" href="/">
          자취인
        </a>

        <Popover
          placement="bottomRight"
          content={content}
          trigger="hover"
          className="top"
        >
          <CaretDownOutlined className="header__info" />
        </Popover>
        <UserOutlined className="header__person" />

        <QuickSearch />
      </section>
    </header>
  );
}

export default Header;
