import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CommentOutlined, EyeFilled, HeartFilled } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import "./Content.css";
import ansung from './ansung.jpg';
import jin from './jin.jpg';
import ramen from './ramen.jpg';
import shin from './shin.jpg';

const Content = (props) => {

  const [liked, setLiked] = useState(props.liked);
  const [likes, setLikes] = useState(props.likes);

  // 좋아요 설정

  const image222 = props.Image;

  return (

    <div className="posts__post2">
      <Link
        style={{
          position: "absolute",
          width: "300px",
          height: "200px",
          zIndex: "201",
        }}
        to={{
          pathname: "/detail",
          search: `?id=${props.id}`,
        }}
      />
      {/* 페이지 이동 */}



      <div className="post__category">

        <span>{props.category}</span>
      </div>
      {/* 카테고리 */}

      

      <div className="post__thumbnail2">
        {props.Image==="ansung"?<img
          src={ansung}
          alt="img"
        />:props.Image==="jin"?<img
        src={ramen}
        alt="img"
      />:props.Image==="shin"?<img
      src={shin}
      alt="img"
    />:<img
      src={jin}
      alt="img"
    />}
      </div>
      {/* 이미지 미리보기 */}


      
      <div className="post__info2">

        <div className="info__detail3">
          <p className="post__title2">{props.title}</p>
          <span className="post__content2">
              {props.content}
          </span>
        </div>
        {/* 본문 내용 */}



        <div className="info__detail2">

          {/* 해시태그 */}



          <div className="post__etc2">
            <HeartFilled style={{ fontSize: "18px" }} />
            <span>{likes}</span>
            <EyeFilled style={{ fontSize: "18px" }} />
            <span>{props.views}</span>
            <CommentOutlined style={{ fontSize: "18px" }} />
            <span>{props.comments}</span>
          </div>
          {/* 좋아요 조회수 댓글수 */}



        </div>
      </div>



      <div className="post__like2">
        <span className="like__icon2" 
        onClick={() => setLiked(!liked)}

        >
          <svg
            className={liked ? "like__animation" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
          </svg>
        </span>
      </div>
      {/* 좋아요 */}



    </div>
  );
};

export default Content;