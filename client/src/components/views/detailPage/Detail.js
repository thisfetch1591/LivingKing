import React, { useState, useEffect, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import {
  Comment,
  Input,
  Form,
  List,
  Button,
  Avatar,
  BackTop,
  Skeleton,
  Tag,
  message,
  Spin,
} from "antd";
import {
  DownOutlined,
  CommentOutlined,
  HeartOutlined,
  DislikeOutlined,
  HeartFilled,
  DislikeFilled,
  LoadingOutlined,
} from "@ant-design/icons";
// import BackTop from "../../libs/BackTopButton";
import "./Detail.css";
import Verify from "../../libs/Verify";

import Header from "../../libs/Header/Header";
import axios from "axios";
import parse from "html-react-parser";
import getFormatDate from "../../libs/getFormatDate";
const { TextArea } = Input;

const timeForToday = (value) => {
  const today = new Date();
  let timeValue = new Date(value);
  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={3} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        댓글 달기
      </Button>
    </Form.Item>
  </>
);
const Detail = (props) => {
  const [visible, setVisible] = useState(false); // 댓글창 눌렀는지
  const [comments, setComments] = useState([]); // 댓글 state
  const [submitting, setSubmitting] = useState(false); // 댓글 달기 요청 중인지
  const [isCommentLoading, setIsCommentLoading] = useState(true); // 댓글 로딩 전인지
  const [islike, setIsLike] = useState(false); // 좋아요 눌렀는지
  const [likes, setLikes] = useState(0); // 좋아요 수
  const [isdislike, setIsDisLike] = useState(false); // 싫어요 눌렀는지
  const [dislikes, setDisLikes] = useState(0); // 싫어요 수
  const [value, setValue] = useState(""); // 댓글 입력 메시지

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [category, setCategory] = useState("");
  const [created_at, setCreated_At] = useState("");
  const [hits, setHits] = useState(0);
  const [hashTags, setHashTags] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const tagColor = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
  ];

  const getPost = async () => {
    const res = await axios.get(`/posts`, {
      params: {
        id: props.match.params.id,
        access_token: JSON.parse(sessionStorage.getItem("token_info"))
          .access_token,
        token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
      },
    });
    if (res.status === 200) return res.data;
  };

  const getComment = useCallback(async () => {
    const res = await axios.get("/comments", {
      params: {
        post_id: props.match.params.id,
      },
    });
    if (res.status === 200) {
      let result = [];
      for (let i = 0; i < res.data.length; i++) {
        result.push({
          id: res.data[i]._id,
          author: res.data[i].writer,
          avatar: res.data[i].icon,
          content: <p>{res.data[i].content}</p>,
          datetime: timeForToday(getFormatDate(res.data[i].created_At)),
        });
      }
      return result;
    }
  });

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
    if (isLoading) {
      const fetchPost = async () => {
        const res = await getPost();
        console.log(res);
        const post = res.post;
        await post.hash_Tags.map((value) => hashTags.push(value));
        setTitle(post.title);
        setContent(post.content);
        setWriter(post.writer);
        setCategory(post.category);
        setCreated_At(getFormatDate(post.created_At));
        setIsLike(res.like_state);
        setIsDisLike(res.dislike_state);
        setDisLikes(post.dislikes.length);
        setLikes(post.likes.length);
        setHits(post.hits);
        let result = {
          type: "score",
          active: sessionStorage.getItem("search")
            ? sessionStorage.getItem("search")
            : "view",
          category: post.category,
          access_token: JSON.parse(sessionStorage.getItem("token_info"))
            .access_token,
          token_type: JSON.parse(sessionStorage.getItem("token_info"))
            .token_type,
        };
        await axios.put("/users", {
          data: JSON.stringify(result),
        });
        sessionStorage.removeItem("search");
      };
      fetchPost();
      setId(props.match.params.id);
      setIsLoading(false);
    }
    if (isCommentLoading) {
      const fetchComment = async () => {
        const comment = await getComment();
        setComments(comment);
      };
      fetchComment();
      setIsCommentLoading(false);
    }
  }, [
    category,
    comments,
    getComment,
    getPost,
    hashTags,
    isCommentLoading,
    isLoading,
    props,
    props.match.params.id,
  ]);

  const toggle = () => {
    setVisible(!visible);
  };

  const handleSubmit = async () => {
    if (!value) {
      return;
    }
    setSubmitting(true);

    setValue("");
    const res = await axios.post("/comments", {
      post_id: id,
      content: value,
      access_token: JSON.parse(sessionStorage.getItem("token_info"))
        .access_token,
      token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
    });
    if (res.status === 200) {
      const comment = await getComment();
      setComments(comment);
    }
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const updateLike = async () => {
    const res = await axios.put("/posts", {
      data: {
        type: "liked",
        id: id,
        access_token: JSON.parse(sessionStorage.getItem("token_info"))
          .access_token,
        token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
      },
    });
    if (res.status === 200) {
      setLikes(res.data.length);
      setIsLike(res.data.like_state);
    }
  };
  const updateDisLike = async () => {
    const res = await axios.put("/posts", {
      data: {
        type: "disliked",
        id: id,
        access_token: JSON.parse(sessionStorage.getItem("token_info"))
          .access_token,
        token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
      },
    });
    if (res.status === 200) {
      setDisLikes(res.data.length);
      setIsDisLike(res.data.dislike_state);
    }
  };
  const handleLike = async () => {
    if (isdislike) await updateDisLike();
    await updateLike();
  };

  const handleDisLike = async () => {
    if (islike) await updateLike();
    await updateDisLike();
  };

  const deleteComment = async (e) => {
    const res = await axios.delete("/comments", {
      params: {
        access_token: JSON.parse(sessionStorage.getItem("token_info"))
          .access_token,
        token_type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
        id: e.target.getAttribute("comment-id"),
      },
    });
    if (res.status === 200) {
      const comments = await getComment();
      setComments(comments);
    }
  };
  return (
    <section className="view__container">
      <Header />
      {isLoading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      ) : (
        <div>
          <content>
            <div className="backimg">
              <h3 className="cate">{category}</h3>
              <h1 className="title_text"> {title}</h1>
              <div className="nick_box">{writer}</div>
              <span className="date">{created_at} </span>
              <span className="count">조회 {hits}</span>
              <div className="hashtag">
                {hashTags.map((tag, i) => (
                  <Tag key={i} color={tagColor[i]}>
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="backcover"></div>
            </div>
            <div id="rectangle">{parse(content)}</div>
            <div
              style={{ display: "flex", justifyContent: "space-around" }}
            ></div>

            <BackTop />
          </content>
          <footer>
            {!visible && (
              <div className="outer">
                <ul className="menu">
                  <li className="menu__list">
                    {islike ? (
                      <HeartFilled
                        className="menu__icon"
                        onClick={handleLike}
                        style={{ color: "#e23b3b" }}
                      />
                    ) : (
                      <HeartOutlined
                        className="menu__icon"
                        onClick={handleLike}
                      />
                    )}
                    <h3>{likes}</h3>
                  </li>
                  <li className="menu__list">
                    {isdislike ? (
                      <DislikeFilled
                        className="menu__icon"
                        onClick={handleDisLike}
                        style={{ color: "#F44336" }}
                      />
                    ) : (
                      <DislikeOutlined
                        className="menu__icon"
                        onClick={handleDisLike}
                      />
                    )}

                    <h3>{dislikes}</h3>
                  </li>
                  <li className="menu__list">
                    <CommentOutlined className="menu__icon" onClick={toggle} />
                    <h3>{comments.length}</h3>
                  </li>
                </ul>
              </div>
            )}

            <CSSTransition
              classNames="inner__animation"
              timeout={300}
              unmountOnExit
              in={visible}
            >
              <div className="inner">
                {visible && (
                  <div className="menu">
                    <DownOutlined className="menu__icon" onClick={toggle} />
                  </div>
                )}
                <Comment
                  className="comment__box"
                  avatar={
                    JSON.parse(sessionStorage.getItem("user")).icon === "" ? (
                      <Avatar>
                        {JSON.parse(sessionStorage.getItem("user")).nickname}
                      </Avatar>
                    ) : (
                      <Avatar
                        size="large"
                        src={JSON.parse(sessionStorage.getItem("user")).icon}
                      >
                        {JSON.parse(sessionStorage.getItem("user")).nickname}
                      </Avatar>
                    )
                  }
                  content={
                    <Editor
                      onChange={handleChange}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      value={value}
                    />
                  }
                />
                <div className="comment__list">
                  {isCommentLoading ? (
                    <Skeleton avatar paragraph={{ rows: 4 }} active />
                  ) : (
                    <List
                      header={`댓글 ${comments.length}`}
                      itemLayout="horizontal"
                    >
                      {comments.length > 0 &&
                        comments.map((comment, i) => {
                          return (
                            <Comment
                              key={i}
                              actions={
                                JSON.parse(sessionStorage.getItem("user"))
                                  .nickname === comment.author && [
                                  <span
                                    key={comment.id}
                                    comment-id={comment.id}
                                    onClick={deleteComment}
                                  >
                                    삭제
                                  </span>,
                                ]
                              }
                              avatar={
                                comment.avatar ? (
                                  comment.avatar
                                ) : (
                                  <Avatar>{comment.author}</Avatar>
                                )
                              }
                              author={comment.author}
                              content={comment.content}
                              datetime={comment.datetime}
                            />
                          );
                        })}
                    </List>
                  )}
                </div>
              </div>
            </CSSTransition>
          </footer>
        </div>
      )}
    </section>
  );
};

export default Detail;
