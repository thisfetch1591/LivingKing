import React, { useEffect, useState } from "react";
import { message, List } from "antd";
import "./RecommendPost.css";
import axios from "axios";

function RecommendPost(props) {
  const [isLoading, setIsLoading] = useState(true);
  let [boardList, setboardList] = useState("");
  let [bIndex, setBIndex] = useState(-1);

  useEffect(() => {
    if (isLoading) {
      const onLoad = async () => {
        const res = await axios.get("/posts", {
          params: {
            category: props.category,
            access_token: JSON.parse(sessionStorage.getItem("token_info"))
              .access_token,
            type: JSON.parse(sessionStorage.getItem("token_info")).token_type,
          },
        });
        if (res.status === 200) {
          if (!res.data) {
            console.log("empty");
          } else {
            setboardList(res.data);
            console.log(res.data);
          }
        } else {
          message.error("불러오기 실패!");
        }
      };
      onLoad();
      setIsLoading(false);
    }
  }, [isLoading, props.category]);

  return (
    <List
      size="small"
      bordered
      dataSource={
        boardList
          ? boardList.map((c, index) => {
              bIndex++;
              return (
                <RecommendPostData
                  key={bIndex}
                  id={c._id}
                  category={c.category}
                  hits={c.hits}
                  create={c.created_At}
                  content={c.content}
                  writer={c.writer}
                  title={c.title}
                  link={"/detail/" + c._id}
                />
              );
            })
          : ""
      }
      renderItem={(item) => <List.Item>{item}</List.Item>}
    />
  );
}

const RecommendPostData = (props) => {
  return (
    <div className="content">
      [{props.category}]<a href={props.link}> {props.title}</a>
      <div className="right">{props.writer}</div>
      {/* {props.hits} */}
    </div>
  );
};

export default RecommendPost;
