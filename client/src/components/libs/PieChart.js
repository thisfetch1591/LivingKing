import React, { useState } from "react";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Pie } from "react-chartjs-2";
import axios from "axios";
const labels = ["가전", "요리", "생활", "욕실"];
const colors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
];
const getUserInfo = async () => {
  const { access_token, token_type } = JSON.parse(
    sessionStorage.getItem("token_info")
  );
  const result = await axios.get("/api/userinfo", {
    params: {
      access_token: access_token,
      type: token_type,
    },
  });
  return result.data.user;
};
const PieChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const user = await getUserInfo();
      let values = [];
      let datasets = [];
      await user.favorite_score.map((score, index) => {
        return values.push(score);
      });
      datasets.push({
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      });
      setData(Object.assign({}, { labels: labels, datasets: datasets }));
      setIsLoading(false);
    };
    if (isLoading) {
      getUser();
    }
  }, [data, isLoading]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!isLoading ? (
        <Pie data={data} />
      ) : (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      )}
    </div>
  );
};

export default PieChart;
