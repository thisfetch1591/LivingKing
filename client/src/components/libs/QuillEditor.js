import React, { useMemo, useState, useRef } from "react";
import { message } from "antd";
import ReactQuill from "react-quill";
import Dropzone from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import API_KEY from "../../config/key";

const QuillEditor = (props) => {
  const [editorHtml, setEditorHtml] = useState("");
  const dropzoneRef = useRef();
  const quillRef = useRef();
  const onHandleChange = (value) => {
    setEditorHtml(value);
    props.onTextChange(value);
  };
  const imageHandler = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
    }),
    []
  );
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.addEventListener("load", () => callback(reader.result));
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type.indexOf("image/") === 0 ? true : false;
    if (!isJpgOrPng) {
      message.error("이미지 파일만 업로드 가능합니다!");
    }
    const isLt2M = file.size / 1024 / 1024 < 32;
    if (!isLt2M) {
      message.error("이미지는 32MB보다 작아야합니다!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadImage = async (imageUrl) => {
    let body = new FormData();
    body.set("key", API_KEY.imgbb_API_KEY);
    body.append("image", imageUrl.split("base64,")[1]);
    const res = await axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    });
    return res.data.data.url;
  };

  const onDrop = (acceptedFiles) => {
    for (let i = 0; i < acceptedFiles.length; i++) {
      if (beforeUpload(acceptedFiles[i])) {
        getBase64(acceptedFiles[i], async (imageUrl) => {
          const image = await uploadImage(imageUrl);
          const quill = quillRef.current.getEditor();
          var range = quillRef.current.getEditor().getSelection();
          if (acceptedFiles) {
            quill.insertEmbed(range.index, "image", image, "user");
            quill.setSelection(range.index + 1);
            quill.focus();
          }
        });
      }
    }
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme={"snow"}
        onChange={onHandleChange}
        value={editorHtml}
        modules={modules}
        formats={formats}
        placeholder={props.placeholder}
      />
      <Dropzone
        ref={dropzoneRef}
        onDrop={onDrop}
        accept={"image/*"}
        noClick
        noKeyboard
      >
        {({ getRootProps, getInputProps, acceptedFiles }) => {
          return (
            <div className="container">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
              </div>
            </div>
          );
        }}
      </Dropzone>
    </>
  );
};

export default QuillEditor;
