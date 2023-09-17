import React, { useEffect, useState } from "react";
import { message, List, Spin } from "antd";
import "./CategoryPost.css";
import gold from "./gold.png";
import silver from "./silver.png";
import bronze from "./bronze.png";
import blank from "./blank.png";
import getFormatDate from "../../../libs/getFormatDate";

function CategoryPost(props) {
  let [boardList, setboardList] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("요리");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const onLoad = async () => {
      const res = await fetch(`/posts/?category=${props.category}`, {
        method: "GET",
      });
      if (res.status === 200) {
        const result = await res.json();
        if (!result) {
          console.log("empty");
        } else {
          setboardList(result);
          console.log(boardList);
        }
      } else {
        message.error("불러오기 실패!");
      }
      setIsLoading(false);
    };
    if (isLoading) {
      onLoad();
    } else {
      if (category !== props.category) {
        setCategory(props.category);
        setPage(1);
        setIsLoading(true);
      }
    }
  }, [props.category, boardList, isLoading, category]);

  return (
    <>
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
        <List
          className="bb"
          pagination={{
            onChange: (e) => {
              console.log(e);
              setPage(e);
            },
            pageSize: 4,
            showSizeChanger: false,
            simple: true,
            position: "bottom",
            current: page,
          }}
          grid={{ gutter: 16, column: 4 }}
          dataSource={
            boardList
              ? boardList.map((c, index) => {
                  return (
                    <CategoryPostData
                      rank={index + 1}
                      key={index}
                      id={c._id}
                      category={c.category}
                      hits={c.hits}
                      create={getFormatDate(c.created_At)}
                      content={c.content}
                      writer={c.writer}
                      title={c.title}
                      likes={c.likes}
                      link={"/detail/" + c._id}
                      thumbnail={c.thumbnail}
                    />
                  );
                })
              : ""
          }
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      )}
    </>
  );
}

const CategoryPostData = (props) => {
  var v01 = props.title.substr(0, 8);
  var v02 = props.title.substr(8, 8);

  const arr1 = v01.split(" ");
  const arr2 = v02.split(" ");

  return (
    <li className="years_box oldhitL">
      <a
        href={props.link}
        className="link_thumb main_log"
        section_code="old_hit"
      >
        {props.thumbnail == null || props.thumbnail === "" ? (
          <div className="img">
            <div className="content">
              <h1>{arr1[0]}</h1>
              <h1>{arr1[1]}</h1>
              <h1>{arr2[0]}</h1>
              <h1>{arr2[1]}</h1>
            </div>
            <div className="img-cover"></div>
          </div>
        ) : (
          <img alt="thumbnail" src={props.thumbnail} width="171" height="171" />
        )}

        <img
          src={
            props.rank === 1
              ? gold
              : props.rank === 2
              ? silver
              : props.rank === 3
              ? bronze
              : blank
          }
          className="sp_years icon_years7"
        />

        <div className="txt_box">
          <strong className="tit">{props.title}</strong>
          <br></br>
          <span className="writer">{props.writer}</span>
          <br></br>
          <span className="gall_name">{props.create}</span>
          <span className="info_num">
            <b>좋아요</b> {props.likes.length}개 <b>조회수</b> {props.hits}회{" "}
          </span>
        </div>
      </a>
    </li>
  );
};

export default CategoryPost;
