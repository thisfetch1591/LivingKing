import React, { useState, useRef } from "react";
import {
  Form,
  Input,
  Tooltip,
  Checkbox,
  Button,
  message,
  Upload,
  DatePicker,
} from "antd";
import {
  QuestionCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "./logo.png";
import "./Register.css";
import axios from "axios";
import Tags from "../../libs/EditableTagGroup";
import API_KEY from "../../../config/key";

function RegistrationPage(props) {
  const [form] = Form.useForm();
  const u_key = "updatable";
  const iv_key = "invalid";
  const v_key = "valid";

  const [email, setEmail] = useState("");
  const [nickname, setNickName] = useState("");
  const [email_checked, setEmailChecked] = useState(false);
  const [nick_checked, setNickChecked] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [is_email_vaild, setIsEmailVaild] = useState(false);
  const [is_nick_vaild, setIsNickVaild] = useState(false);
  const [hashTags, setHashTags] = useState([]);
  const emailInput = useRef();
  const nickInput = useRef();

  const destory_message = (key) => {
    if (key === "all") {
      message.destroy(u_key);
      message.destroy(iv_key);
      message.destroy(v_key);
    } else {
      message.destroy(key);
    }
  };
  const onFinish = (values) => {
    console.log(hashTags);
    const result = Object.assign(
      { imageUrl: imageUrl, hashTags: hashTags.values },
      values
    );
    if (!email_checked)
      return message.error({
        content: "이메일 중복체크를 실시해주시기 바랍니다.",
        iv_key: iv_key,
      });
    if (!nick_checked)
      return message.error({
        content: "닉네임 중복체크를 실시해주시기 바랍니다.",
        iv_key: iv_key,
      });

    message.loading({ content: "Loading...", u_key });

    bcrypt.hash(values.password, 10, async (err, res) => {
      if (err) throw err;
      result.password = res;
      result.confirm = res;
      const res2 = await axios.post("/users", result);
      if (res2.status === 200) {
        message
          .success(
            "회원가입에 성공하였습니다! 이메일 인증을 진행해주세요!",
            2,
            destory_message("all")
          )
          .then(props.history.push("/login"));
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    });
  };

  const check = async (key, value) => {
    const url = "auth/vaild_check";
    const res = await axios.post(url, { [key]: value }).catch(() => {
      return { status: 409 };
    });
    return res;
  };

  const checkEmail = async () => {
    if (!is_email_vaild) {
      return message.error("이메일을 입력해주세요.");
    }
    const res = await check("email", email);
    if (res.status === 200) {
      setEmailChecked(true);
      message.destroy(iv_key);
      return message.success({ content: "사용 가능한 이메일입니다.", v_key });
    } else {
      emailInput.current.focus();
      return message.error({ content: "이미 등록된 이메일입니다.", iv_key });
    }
  };

  const checkNick = async () => {
    if (!is_nick_vaild) {
      return message.error("닉네임은 2글자 이상 해야합니다.");
    }
    const res = await check("nickname", nickname);
    if (res.status === 200) {
      setNickChecked(true);
      message.destroy(iv_key);
      return message.success({ content: "사용 가능한 닉네임입니다.", v_key });
    } else if (res.status === 409) {
      nickInput.current.focus();
      return message.error({ content: "이미 등록된 닉네임입니다.", iv_key });
    }
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("JPG/PNG 파일만 업로드 가능합니다!");
    }
    const isLt2M = file.size / 1024 / 1024 < 16;
    if (!isLt2M) {
      message.error("이미지는 32MB보다 작아야합니다!");
    }
    console.log(isJpgOrPng, isLt2M);
    return isJpgOrPng && isLt2M;
  }

  const handleChange = async (info) => {
    setLoading(true);
    let body = new FormData();
    body.set("key", API_KEY.imgbb_API_KEY);
    body.append("image", info.file.originFileObj);

    const res = await axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    });
    console.log("done");
    setImageUrl(res.data.data.thumb.url);
    setLoading(false);
  };
  const tagHandleChange = (values) => {
    setHashTags({ values });
    console.log(values);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <section className="Register">
      <div className="container">
        <img src={logo} className="logo" alt="logo" />
        <div className="RegisterForm">
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              prefix: "82",
            }}
            scrollToFirstError
          >
            <Form.Item label="아이콘">
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              label="이메일"
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                },
              ]}
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
                    message: "Email 주소를 입력하세요.",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const pattern = new RegExp(
                        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
                      );

                      if (pattern.test(value)) {
                        setEmail(value);
                        setIsEmailVaild(true);
                        return Promise.resolve();
                      } else {
                        setIsEmailVaild(false);
                      }
                    },
                  }),
                ]}
                style={{ display: "inline-block", width: "calc(70% - 16px)" }}
              >
                <Input
                  ref={emailInput}
                  disabled={email_checked ? true : false}
                />
              </Form.Item>
              <Form.Item
                style={{
                  display: "inline-block",
                  width: "calc(30% - 16px)",
                  margin: "0 8px",
                }}
              >
                <Button
                  type="primary"
                  onClick={checkEmail}
                  disabled={email_checked ? true : false}
                >
                  중복체크
                </Button>
              </Form.Item>
            </Form.Item>
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
            <Form.Item
              name="name"
              label="이름"
              rules={[{ required: true, message: "이름 입력하세요." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="birthday"
              label="생년월일"
              rules={[
                {
                  required: true,
                  message: "생년월일을 입력하세요.",
                },
              ]}
            >
              <DatePicker style={{ width: "31vh" }} locale="ko-kr" />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  닉네임&nbsp;
                  <Tooltip title="자취인에서 이름 대신 사용합니다!">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                name="nickname"
                rules={[
                  {
                    required: true,
                    message: "닉네임을 입력하세요.",
                    whitespace: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (value.replace(/\s/gi, "").length >= 2) {
                        setNickName(value);
                        setIsNickVaild(true);
                        return Promise.resolve();
                      } else {
                        setIsNickVaild(false);
                        return Promise.reject(
                          "닉네임은 공백을 제외한 2글자 이상 입력해야합니다."
                        );
                      }
                    },
                  }),
                ]}
                style={{ display: "inline-block", width: "calc(70% - 16px)" }}
              >
                <Input ref={nickInput} disabled={nick_checked ? true : false} />
              </Form.Item>
              <Form.Item
                style={{
                  display: "inline-block",
                  width: "calc(30% - 16px)",
                  margin: "0 8px",
                }}
              >
                <Button
                  type="primary"
                  onClick={checkNick}
                  disabled={nick_checked ? true : false}
                >
                  중복체크
                </Button>
              </Form.Item>
            </Form.Item>
            <Form.Item name="hashtag" label="관심 분야">
              <Tags
                tags={hashTags}
                onTagsChange={tagHandleChange}
                className="tgs"
              />
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("Should accept agreement"),
                },
              ]}
            >
              <Checkbox>
                {/* <a
                href=""
                onClick="window.open(this.href, '_blank,'width=600,height=400'); return false"
              > */}
                이용약관
                {/* </a> */}에 동의합니다.
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                회원가입
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default withRouter(RegistrationPage);
