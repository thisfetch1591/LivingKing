import React from "react";
import { Link } from "react-router-dom";
import { EyeFilled, HeartFilled } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import getFormatDate from "../getFormatDate";
import "./Post.css";

const FoodSvg = () => (
  <svg
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
  >
    <path d="M18.496 24h-.001c-.715 0-1.5-.569-1.5-1.5v-8.5s-1.172-.003-2.467 0c.802-6.996 3.103-14 4.66-14 .447 0 .804.357.807.851.01 1.395.003 16.612.001 21.649 0 .828-.672 1.5-1.5 1.5zm-11.505-12.449c0-.691-.433-.917-1.377-1.673-.697-.56-1.177-1.433-1.088-2.322.252-2.537.862-7.575.862-7.575h.6v6h1.003l.223-6h.607l.173 6h1.003l.242-6h.562l.199 6h1.003v-6h.549s.674 5.005.951 7.55c.098.902-.409 1.792-1.122 2.356-.949.751-1.381.967-1.381 1.669v10.925c0 .828-.673 1.5-1.505 1.5-.831 0-1.504-.672-1.504-1.5v-10.93z" />
  </svg>
);
const BathSvg = () => (
  <svg
    height="24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    x="0px"
    y="0px"
  >
    <g>
      <polygon points="38 45 38 4 34 4 34 31 34 35 34 48 38 48 38 45"></polygon>
      <rect x="12" y="42" width="10" height="2"></rect>
      <polygon points="52 35 52 31 52 4 50 4 50 44 52 44 52 35"></polygon>
      <rect x="24" y="32" width="8" height="2"></rect>
      <rect x="40" y="4" width="2" height="40"></rect>
      <polygon points="48 45 48 4 44 4 44 45 44 48 48 48 48 45"></polygon>
      <path d="M46,59a1,1,0,0,0,2,0V58H46Z"></path>
      <polygon points="22 35 22 32 12 32 12 35 12 40 22 40 22 35"></polygon>
      <polygon points="54 34 59 34 60 34 60 32 54 32 54 34"></polygon>
      <path d="M16,59a1,1,0,0,0,2,0V58H16Z"></path>
      <path d="M54,45a1,1,0,0,1-1,1H50v3a1,1,0,0,1-1,1H43a1,1,0,0,1-1-1V46H40v3a1,1,0,0,1-1,1H33a1,1,0,0,1-1-1V36H24v9a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V36H6V47a9.01,9.01,0,0,0,9,9H49a9.01,9.01,0,0,0,9-9V36H54Z"></path>
      <polygon points="10 32 4 32 4 34 5 34 10 34 10 32"></polygon>
      <path d="M6.858,7H32V5H6.858A4,4,0,0,0,3,2,1,1,0,0,0,2,3V9a1,1,0,0,0,1,1A4,4,0,0,0,6.858,7Z"></path>
      <path d="M61,2a4,4,0,0,0-3.858,3H54V7h3.142A4,4,0,0,0,61,10a1,1,0,0,0,1-1V3A1,1,0,0,0,61,2Z"></path>
      <path d="M11,20a2,2,0,0,1,2,2v1h2V22a4,4,0,0,0-8,0v9H9V28h2V26H9V22A2,2,0,0,1,11,20Z"></path>
    </g>
  </svg>
);

const HomeSvg = () => (
  <svg
    height="24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 100 100"
    enable-background="new 0 0 100 100"
  >
    <path d="M61.684,33.166H13.593v62.051c0,2.246,1.374,3.615,3.617,3.615h40.856c2.243,0,3.849-1.369,3.617-3.615V33.166z   M22.636,50.287c0,0.999-0.81,1.809-1.809,1.809s-1.808-0.811-1.808-1.809V39.149c0-0.999,0.809-1.81,1.808-1.81  s1.809,0.811,1.809,1.81V50.287z M58.066,1.167H17.21c-2.243,0-3.617,1.374-3.617,3.617V30.21h48.091V4.785  C61.915,2.542,60.31,1.167,58.066,1.167z M22.636,20.567c0,0.999-0.81,1.81-1.809,1.81s-1.808-0.811-1.808-1.81v-9.081  c0-0.998,0.809-1.808,1.808-1.808s1.809,0.81,1.809,1.808V20.567z M64.689,62.771c0.498-0.064,1.001-0.109,1.517-0.109  c6.491,0,11.755,5.262,11.755,11.754c0,6.494-5.264,11.758-11.755,11.758c-0.516,0-1.019-0.045-1.517-0.109v7.244h19.662  c1.136,0,2.056-0.922,2.056-2.057v-37.01H64.689V62.771z M84.352,41.262H64.689v10.023h21.718v-7.967  C86.407,42.182,85.487,41.262,84.352,41.262z"></path>
  </svg>
);

const LifeSvg = () => (
  <svg
    height="24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    x="0px"
    y="0px"
    viewBox="0 0 48 48"
  >
    <path d="M40.3,13h-7.9V9.9c0-4.6-3.8-8.4-8.4-8.4s-8.4,3.8-8.4,8.4V13H7.7L4.2,46.5h39.6L40.3,13z M18.1,9.9C18.1,6.6,20.7,4,24,4  s5.9,2.7,5.9,5.9V13H18.1V9.9z M16.8,23.4c-1.5,0-2.7-1.2-2.7-2.7c0-1,0.6-1.9,1.4-2.4V13h2.5v5.3c0.9,0.4,1.4,1.3,1.4,2.4  C19.5,22.2,18.3,23.4,16.8,23.4z M31.2,23.4c-1.5,0-2.7-1.2-2.7-2.7c0-1,0.6-1.9,1.4-2.4V13h2.5v5.3c0.9,0.4,1.4,1.3,1.4,2.4  C33.8,22.2,32.6,23.4,31.2,23.4z"></path>
  </svg>
);
const componentSvg = (category) => {
  if (category === "가전") return HomeSvg;
  if (category === "요리") return FoodSvg;
  if (category === "욕실") return BathSvg;
  if (category === "생활") return LifeSvg;
};
const Post = (props) => {
  const FoodIcon = () => (
    <Icon component={componentSvg(props.category)} style={{ fill: "white" }} />
  );
  let v01 = props.title.substr(0, 8);
  let v02 = props.title.substr(8, 8);

  const arr1 = v01.split(" ");
  const arr2 = v02.split(" ");
  return (
    <div className="posts__post">
      <Link
        style={{
          position: "absolute",
          width: "320px",
          height: "440px",
          zIndex: "201",
        }}
        to={{
          pathname: `/detail/${props.id}`,
        }}
      />
      <div className="post__category">
        <FoodIcon style={{ fontSize: "20px" }} />
        <span>{props.category}</span>
      </div>
      <div className="post__thumbnail">
        {props.thumbnail == null || props.thumbnail === "" ? (
          <div className="no__thumbnail">
            <div className="content">
              <h1>{arr1[0]}</h1>
              <h1>{arr1[1]}</h1>
              <h1>{arr2[0]}</h1>
              <h1>{arr2[1]}</h1>
            </div>
            <div className="img-cover"></div>
          </div>
        ) : (
          <img src={props.thumbnail} alt="img" />
        )}
      </div>
      <div className="post__info">
        <div className="info__detail1">
          <p className="post__title">{props.title}</p>
          <p className="post__writer">{props.writer}</p>
          <p className="post__created_At">{getFormatDate(props.created_At)}</p>
        </div>
        <div className="info__detail2">
          <ul className="post__hashtag">
            {props.hashtags !== undefined ? (
              props.hashtags.map((hashtag, index) => {
                if (index === 2) return <li key={index}></li>;
                return <li key={index}>#{hashtag}</li>;
              })
            ) : (
              <></>
            )}
          </ul>
          <div className="post__etc">
            <HeartFilled style={{ fontSize: "20px" }} />
            <span>{props.likes}</span>
            <EyeFilled style={{ fontSize: "20px" }} />
            <span>{props.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
