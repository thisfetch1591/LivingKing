import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import "./ModalButton.css";

function ModalButton(props) {
  // 팁 더보기
  const [visModal, setVisModal] = useState(false);
  const showModal = () => {
    setVisModal(true);
  };
  const handleOk = (e) => {
    console.log(e);
    setVisModal(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setVisModal(false);
  };

  return (
    <div>
      <a onClick={showModal} className="modal">
        <PlusOutlined /> 더보기
      </a>
      <Modal
        title="Basic Modal"
        visible={visModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}

export default ModalButton;
