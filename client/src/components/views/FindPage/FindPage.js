import React, { useState } from "react";
import { Tabs, Form, Input, Button, DatePicker, Space, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import moment from "moment";

const { TabPane } = Tabs;

const FindPage = () => {
  const [id_find, setId_find] = useState(false);
  const [pw_find, setPw_find] = useState(false);
  const [date, setDate] = useState();
  const [email, setEmail] = useState("");
  const [activeKey, setActiveKey] = useState("1");

  const onClose = () => {
    window.open("", "_self").close();
  };
  const changeTab = (activeKey) => {
    setActiveKey(activeKey);
  };
  const onIdFinish = async (values) => {
    const res = await fetch(
      `/users/forgot/id/?name=${values.name}&birthday=${date}`,
      {
        method: "GET",
      }
    );
    if (res.status === 200) {
      const result = await res.json();
      setEmail(result);
      setId_find(true);
    } else {
      message.error("알맞은 회원정보를 찾을 수 없습니다!");
    }
  };

  const onPwFinish = async (values) => {
    setEmail(values.email);
    const res = await fetch(`users/forgot/password/?email=${values.email}`);
    if (res.status === 200) setPw_find(true);
  };
  const handleChange = (activeKey) => {
    setActiveKey(activeKey);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Tabs
      activeKey={activeKey}
      onChange={handleChange}
      style={{ marginLeft: "5vh" }}
    >
      <TabPane
        onClick={() => {
          changeTab("1");
        }}
        tab={
          <span>
            <MailOutlined />
            이메일 찾기
          </span>
        }
        key="1"
      >
        {id_find ? (
          <div>
            <p>이메일 찾기를 성공하였습니다!</p>
            <p>
              이메일 :<b>{email}</b>
            </p>
            <Button
              type="primary"
              onClick={() => {
                changeTab("2");
              }}
            >
              비밀번호 찾기
            </Button>
            <Button style={{ marginLeft: "30px" }} onClick={onClose}>
              닫기
            </Button>
          </div>
        ) : (
          <Form
            layout="vertical"
            name="basic"
            style={{ marginLeft: "5vh" }}
            onFinish={onIdFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item name="birthday" label="생년월일" rules={[]}>
              <Space direction="vertical" size={12}>
                <DatePicker
                  locale="ko-kr"
                  onChange={(value) => {
                    setDate(moment(value._d).format("yyyy-MM-DD"));
                  }}
                />
              </Space>
            </Form.Item>

            <Form.Item
              name="name"
              label="이름"
              rules={[{ required: true, message: "이름 입력하세요." }]}
            >
              <Space direction="vertical" size={12}>
                <Input />
              </Space>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                확인
              </Button>
              <Button style={{ marginLeft: "50px" }} onClick={onClose}>
                닫기
              </Button>
            </Form.Item>
          </Form>
        )}
      </TabPane>
      <TabPane
        onClick={() => {
          changeTab("2");
        }}
        tab={
          <span>
            <LockOutlined />
            비밀번호 찾기
          </span>
        }
        key="2"
      >
        {pw_find ? (
          <div>
            <p>
              <b>{email}</b>로 발송하였습니다.
            </p>
            <Button onClick={onClose} danger>
              닫기
            </Button>
          </div>
        ) : (
          <Form
            layout="vertical"
            name="basic"
            style={{ marginLeft: "5vh" }}
            onFinish={onPwFinish}
            initialValues={{ email: email }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "이메일 형식으로 입력해주세요.",
                },
                {
                  required: true,
                  message: "이메일을 입력하세요!",
                },
              ]}
            >
              <Input
                style={{ width: "80%" }}
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="이메일"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                확인
              </Button>
              <Button style={{ marginLeft: "50px" }} onClick={onClose}>
                닫기
              </Button>
            </Form.Item>
          </Form>
        )}
      </TabPane>
    </Tabs>
  );
};

export default FindPage;
