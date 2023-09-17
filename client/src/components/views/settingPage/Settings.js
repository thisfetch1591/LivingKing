import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  Tooltip,
  Button,
  message,
  Upload,
  DatePicker,
  Spin,
} from "antd";
import {
  QuestionCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Header from "../../libs/Header/Header";
import "./Settings.css";
import bcrypt from "bcryptjs";
import axios from "axios";
import moment from "moment";
import Tags from "../../libs/EditableTagGroup";
import API_KEY from "../../../config/key";
import Verify from "../../libs/Verify";

const Settings = (props) => {
  const [form] = Form.useForm();
  const u_key = "updatable";
  const iv_key = "invalid";
  const v_key = "valid";

  const [nickname, setNickName] = useState("");
  const [nick_checked, setNickChecked] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [is_nick_vaild, setIsNickVaild] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPwChange, setIsPwChange] = useState(false);
  const [isNickChange, setIsNickChange] = useState(false);
  const [isTagChange, setIsTagChange] = useState(false);
  const [hashTags, setHashTags] = useState([]);
  const emailInput = useRef();
  const nickInput = useRef();

  const [userinfo, setUserInfo] = useState([]);

  useEffect(() => {
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
    const getUserInfo = async () => {
      const { access_token, token_type } = JSON.parse(
        sessionStorage.getItem("token_info")
      );
      const result = await axios(
        `/api/userinfo?access_token=${access_token}&type=${token_type}`
      );
      console.log(result.data);
      setImageUrl(result.data.user.icon);
      result.data.user.birthday = moment(result.data.user.birthday);
      setUserInfo(result.data.user);
      setHashTags(result.data.user.hashTags);
      setIsLoading(false);
    };
    if (isLoading) getUserInfo();
  });

  const destory_message = (key) => {
    if (key === "all") {
      message.destroy(u_key);
      message.destroy(iv_key);
      message.destroy(v_key);
    } else {
      message.destroy(key);
    }
  };

  const onFinish = async () => {
    let result = {
      access_token: JSON.parse(sessionStorage.getItem("token_info"))
        .access_token,
      token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
    };
    if (imageUrl) {
      result = Object.assign(result, { imageUrl: imageUrl });
    }
    if (isNickChange) {
      if (nick_checked) result = Object.assign(result, { nickname: nickname });
    }
    if (isPwChange) {
      bcrypt.hash(password, 10, async (err, res) => {
        if (err) throw err;
        result = Object.assign(result, { password: res });
      });
    }
    if (isTagChange) {
      result = Object.assign(result, { hashTags: hashTags.values });
    }
    if (result) {
      sessionStorage.removeItem("user");
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          email: userinfo.email,
          nickname: nickname ? nickname : userinfo.nickname,
          icon: imageUrl,
        })
      );
      result = Object.assign(result, { type: "profile" });
      const res = await axios.put("/users", { data: JSON.stringify(result) });
      if (res.status === 200) {
        message.success("정상적으로 변경되었습니다!");
        props.history.goBack();
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const check = async (key, value) => {
    const url = "auth/vaild_check";
    const res = await axios.post(url, { [key]: value }).catch(() => {
      return { status: 409 };
    });
    return res;
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
    const isLt2M = file.size / 1024 / 1024 < 32;
    if (!isLt2M) {
      message.error("이미지는 32MB보다 작아야합니다!");
    }
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
    setIsTagChange(true);
  };
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <div>
          <PlusOutlined />
        </div>
      )}
      <div>Upload</div>
    </div>
  );
  return (
    <div className="settings__container">
      <Header />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "58.7vh",
          }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
          />
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          {(imageUrl || nick_checked || isPwChange || isTagChange) && (
            <Button
              type="primary"
              style={{
                marginBottom: "1rem",
                marginLeft: "30rem",
                borderRadius: "5px",
              }}
              onClick={onFinish}
              htmlType="submit"
            >
              저장하기
            </Button>
          )}
          <div className="profile">
            <div style={{ textAlign: "right" }}>
              <Button
                type="text"
                onClick={() => {
                  props.history.goBack();
                }}
              >
                취소 X
              </Button>
            </div>
            <div className="profile__form">
              <Form
                form={form}
                name="register"
                initialValues={{
                  email: userinfo.email,
                  nickname: userinfo.nickname,
                  name: userinfo.name,
                  birthday: userinfo.birthday,
                }}
                scrollToFirstError
              >
                <Form.Item label="">
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
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
                    ]}
                    style={{
                      display: "inline-block",
                      width: "calc(70% - 16px)",
                    }}
                  >
                    <Input ref={emailInput} disabled={true} />
                  </Form.Item>
                </Form.Item>
                <Form.Item label="비밀번호" style={{ marginBottom: "20px" }}>
                  {isPwChange && (
                    <Form.Item name="password" hasFeedback>
                      <Input.Password />
                    </Form.Item>
                  )}
                  {isPwChange && (
                    <Form.Item
                      name="confirm"
                      label="비밀번호 재확인"
                      dependencies={["password"]}
                      style={{ marginBottom: 0 }}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "비밀번호 일치하지 않습니다.",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue("password") === value) {
                              setPassWord(value);
                              return Promise.resolve();
                            }

                            return Promise.reject(
                              "비밀번호가 일치하지 않습니다."
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  )}

                  {!isPwChange && (
                    <Button
                      type="primary"
                      onClick={() => {
                        setIsPwChange(true);
                      }}
                    >
                      변경하기
                    </Button>
                  )}
                </Form.Item>
                <Form.Item name="name" label="이름">
                  <Input disabled={userinfo.name} />
                </Form.Item>
                <Form.Item name="birthday" label="생년월일">
                  <DatePicker
                    style={{ width: "31vh" }}
                    locale="ko-kr"
                    disabled={userinfo.name}
                  />
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
                  {isNickChange && (
                    <>
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
                              console.log(value);
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
                        style={{
                          display: "inline-block",
                          width: "calc(70% - 16px)",
                        }}
                      >
                        <Input
                          ref={nickInput}
                          disabled={nick_checked ? true : false}
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
                          onClick={checkNick}
                          disabled={nick_checked ? true : false}
                        >
                          중복체크
                        </Button>
                      </Form.Item>
                    </>
                  )}
                  {!isNickChange && (
                    <>
                      <Form.Item
                        style={{
                          display: "inline-block",
                          width: "calc(30% - 16px)",
                          margin: "0 8px",
                        }}
                      >
                        <Button
                          type="primary"
                          onClick={() => {
                            setIsNickChange(true);
                          }}
                        >
                          변경하기
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.Item>
                <Form.Item name="hashtag" label="관심 분야">
                  <Tags tags={hashTags} onTagsChange={tagHandleChange} />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(Settings);
