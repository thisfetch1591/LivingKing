import React, { useState, useEffect } from "react";
import QuillEditor from "../../libs/QuillEditor";
import Tags from "../../libs/EditableTagGroup";
import Header from "../../libs/Header/Header";
import Verify from "../../libs/Verify";
import {
  Typography,
  Input,
  Select,
  Divider,
  Button,
  Popconfirm,
  message,
  Upload,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import "./createPage.css";
import { withRouter } from "react-router-dom";
import axios from "axios";
import API_KEY from "../../../config/key";

const { Title } = Typography;
const { Option } = Select;
const text = "글 작성을 취소하시겠습니까?";

const CreatePost = (props) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thumbnailUrl, setThunbnailUrl] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("isLogin")) {
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
  }, [props]);

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

  const contentHandleChange = (value) => {
    setContent(value);
  };
  const titleHandleChange = (e) => {
    setTitle(e.target.value);
  };
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
    setThunbnailUrl(res.data.data.url);
    setLoading(false);
  };
  const onTest = async (e) => {
    e.preventDefault();
    console.log(title);
    console.log(category);
    console.log(tags);
    console.log(content);
    const res = await axios.post("/posts", {
      title: title,
      content: content,
      access_token: JSON.parse(sessionStorage.getItem("token_info"))
        .access_token,
      token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
      tags: tags.values,
      category: category,
      thumbnail: thumbnailUrl,
    });
    if (res.status === 200) {
      message.success("글 작성 성공!");
      return props.history.push({
        pathname: "/",
        state: { tokeninfo: props.tokeninfo, nickname: props.nickname },
      });
    }
  };

  const selectHandleChange = (value) => {
    switch (value) {
      case "1":
        setCategory("가전");
        break;
      case "2":
        setCategory("요리");
        break;
      case "3":
        setCategory("생활");
        break;
      case "4":
        setCategory("욕실");
        break;
      default:
        setCategory("");
        break;
    }
  };
  const tagHandleChange = (values) => {
    setTags({ values });
    console.log(values);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <div className="total__container">
      <Header {...props} />
      <section className="write__container">
        <form className="writeForm" onSubmit={onTest}>
          <div className="container__title">
            <Title level={3}>제목</Title>
            <Input
              placeholder="제목을 입력하세요"
              value={title}
              name="title"
              onChange={titleHandleChange}
              className="title__Input"
              allowClear
            />
            <Select
              defaultValue="카테고리를 선택해 주세요."
              onChange={selectHandleChange}
            >
              <Option value="1">가전</Option>
              <Option value="2">요리</Option>
              <Option value="3">생활</Option>
              <Option value="4">욕실</Option>
            </Select>
          </div>
          <Divider />
          <Title level={3}>썸네일</Title>
          <div className="container__thumbnail">
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div className="container__Description">
            <Divider />
            <div className="container__editor">
              <QuillEditor
                value={content}
                onTextChange={contentHandleChange}
                placeholder={"내용을 입력하세요!"}
                className="description__Editor"
              />
            </div>
          </div>
          <div className="container__tags">
            <Divider />
            <Title level={3}>#해시태그</Title>
            <Tags tags={tags} onTagsChange={tagHandleChange} className="tgs" />
          </div>
          <div className="container__Button">
            <Divider />
            <Button type="primary" htmlType="submit" className={"buttons"}>
              작성하기
            </Button>
            <Popconfirm placement="right" title={text}>
              <Button className={"buttons"}>취소</Button>
            </Popconfirm>
          </div>
        </form>
      </section>
    </div>
  );
};

export default withRouter(CreatePost);
