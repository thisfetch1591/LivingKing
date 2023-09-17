import React from "react";
import { Form, Input, Button } from "antd";
import Axios from "axios";
import bcrypt from "bcryptjs";

const ModifyPage = (props) => {
  const [form] = Form.useForm();
  let params = props.history.location.search.split("=");
  const onFinish = async (values) => {
    bcrypt.hash(values.password, 10, async (err, result) => {
      if (err) throw err;
      values.password = result;
      values.confirm = result;
      const res = await Axios.put("/users", {
        token: params[1],
        password: values.password,
      });
      if (res.status === 200) {
        props.history.push({
          pathname: "/confirm/success",
          state: { title: "password" },
        });
      } else {
        props.history.push({
          pathname: "/confirm/fail",
          state: { title: "password" },
        });
      }
    });
  };
  return (
    <section
      style={{
        display: "grid",
        gridTemplateRows: "1.2fr 0.6fr",
        gridTemplateColumns: "0.4fr 0.3fr 0.4fr",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gridRowStart: 2,
          gridColumnStart: 2,
          boxShadow:
            "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <h1>비밀번호를 변경해주세요!</h1>
        <h3>아래에 새 비밀번호를 입력해주세요.</h3>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="password"
            label="비밀번호"
            rules={[
              {
                required: true,
                message: "비밀번호 입력하세요.",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="비밀번호 재확인"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "비밀번호 일치하지 않습니다.",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "비밀번호가 일치하지 않습니다. 다시 시도해주세요."
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              변경하기
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default ModifyPage;
