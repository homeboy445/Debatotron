import React from "react";
import "./InputBox.css";
import user from "../../../Images/user.svg";
import email from "../../../Images/email.svg";
import password from "../../../Images/password.svg";
import question from "../../../Images/question.png";

const InputBox = ({ placeholder, type, onChangeCallback, value }) => {
  return (
    <div className="inputbx">
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChangeCallback}
        value={value}
        required
      />
      <img
        src={
          type === "email"
            ? email
            : type === "text"
            ? placeholder === "username"
              ? user
              : question
            : password
        }
        alt={type}
      />
    </div>
  );
};

export default InputBox;
