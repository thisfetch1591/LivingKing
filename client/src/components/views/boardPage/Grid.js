import React from "react";
import { Row, Col } from "antd";

function Grid() {
  return (
    <Row>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
      <Col span={6}>col-6</Col>
    </Row>
  );
}

export default Grid;
