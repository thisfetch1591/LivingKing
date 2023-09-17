import React from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./Menu.css";

const { SubMenu } = Menu;

const MenuItem = (e) => {
  console.log("click", e);

  return (
    <Menu
      className="menu__sideMenu"
      mode="inline"
      defaultOpenKeys={["all1", "sub1", "sub2", "sub3", "sub4"]}
    >
      <SubMenu key="all1" icon={<MailOutlined />} title="전체" disabled="true">
        <SubMenu key="sub1" icon={<MailOutlined />} title="음식">
          <Menu.ItemGroup title="백주부">
            <Menu.Item key="1">한식</Menu.Item>
            <Menu.Item key="2">양식</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="수미쌤">
            <Menu.Item key="3">한식</Menu.Item>
            <Menu.Item key="4">양식</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="가전">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>

        <SubMenu key="sub4" icon={<SettingOutlined />} title="생활">
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
      </SubMenu>
    </Menu>
  );
};
export default MenuItem;
