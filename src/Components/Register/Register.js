import React, { useState, useRef, useContext } from "react";
import "./Register.css";
import axios from "axios";
import InputBox from "../Sub_Components/InputBox/InputBox";
import register_Image from "../../Images/register1.jpg";
import AuthContext from "../../Contexts/AuthContext";

const Register = ({ HandleAuth, Change_Display }) => {
  const Main = useContext(AuthContext);
  const [name, ChangeName] = useState("");
  const [email_1, ChangeEmail] = useState("");
  const [password_1, ChangePassword] = useState("");
  const [answer_1, ChangeAns] = useState("");
  const recovery_1 = useRef(null);

  setTimeout(() => Main.toggleLoader(false), 2000);

  const HandleChange_1 = (event) => {
    if (event.target.value.trim()) {
      ChangeName(event.target.value);
    } else {
      ChangeName("");
    }
  };
  const HandleChange_2 = (event) => {
    if (event.target.value.trim()) {
      ChangeEmail(event.target.value);
    } else {
      ChangeEmail("");
    }
  };
  const HandleChange_3 = (event) => {
    if (event.target.value.trim()) {
      ChangePassword(event.target.value);
    } else {
      ChangePassword("");
    }
  };
  const HandleChange_4 = (event) => {
    if (event.target.value.trim()) {
      ChangeAns(event.target.value);
    } else {
      ChangeAns("");
    }
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    Main.toggleLoader(true);
    axios
      .post(`${Main.serverURL}/register`, {
        user: name,
        password: password_1,
        email: email_1,
        recovery: recovery_1.current.value,
        answer: answer_1,
      })
      .then((response) => {
        if (response.data.name) {
          window.location.href = "/signin";
        } else {
          throw response;
        }
      })
      .catch((err) => {
        setTimeout(() => Main.toggleDisplayBox("Registration Failed!"), 2000);
      });
    ChangeAns("");
    ChangeEmail("");
    ChangeName("");
    ChangePassword("");
  };

  window.deb = { Main };

  return (
    <div className="rg-wrapper">
      <div className="register">
        <div id="rg_img_div">
          <img src={register_Image} alt="" className="rg_img" />
        </div>
        <div className="rg-mainer">
          <div>
            <h1>Register to debatotron.</h1>
            <h3>
              Already have an account? <a href="/signin">Log In.</a>
            </h3>
          </div>
          <form onSubmit={HandleSubmit}>
            <InputBox
              type="text"
              placeholder="username"
              onChangeCallback={HandleChange_1}
              value={name}
            />
            <InputBox
              type="email"
              placeholder="email"
              onChangeCallback={HandleChange_2}
              value={email_1}
            />
            <InputBox
              type="password"
              placeholder="password"
              onChangeCallback={HandleChange_3}
              value={password_1}
            />
            <div className="rg-sel">
              <select ref={recovery_1}>
                <option>choose your recovery question</option>
                <option value="What is you pet's name?">
                  What is you pet's name?
                </option>
                <option value="What is favourite game?">
                  What is favourite game?
                </option>
                <option value="What is your favourite dish?">
                  What is your favourite dish?
                </option>
                <option value="What is your hobby?">What is your hobby?</option>
              </select>
              <InputBox
                type="text"
                value={answer_1}
                placeholder="Your Answer"
                onChangeCallback={HandleChange_4}
              />
            </div>
            <button type="submit" className="rg-btn">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
