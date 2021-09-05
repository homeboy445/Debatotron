import React, { useState } from "react";
import InputBox from "../Sub_Components/InputBox/InputBox";
import signin_Image from "../../Images/signin.jpg";
import "./SignIn.css";

const SignIn = ({ HandleAuth, Change_Display }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [stat, set] = useState("");
  const HandleName = (e) => {
    if (e.target.value.trim()) {
      setName(e.target.value);
    } else {
      setName("");
    }
  };
  const HandlePassword = (e) => {
    if (e.target.value.trim()) {
      setPassword(e.target.value);
    } else {
      setPassword("");
    }
  };
  const HandleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3005/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: name,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        var obj = {
          data: response.id,
          state: true,
        };
        HandleAuth(obj);
      })
      .catch((err) => {
        set("Something's Wrong!");
        setInterval(() => {
          set("");
        }, 3000);
      });
    setName("");
    setPassword("");
  };
  return (
    <div className="sg-wrapper">
      <div className="signin">
        <div className="sg-mainer">
          <div>
            <h1>Sign In to your account.</h1>
            <h3>
              New here? <a href="/register">Register.</a>
            </h3>
          </div>
          <form onSubmit={HandleSubmit}>
            <InputBox
              type="email"
              placeholder="email"
              onChangeCallback={HandleName}
              value={name}
            />
            <InputBox
              type="password"
              placeholder="password"
              onChangeCallback={HandlePassword}
              value={password}
            />
            <div className="sg-flx">
                <a href="/fp">Forgot password?</a>
                <button type="submit" className="sg-btn">Sign In</button>
            </div>
          </form>
        </div>
        <div className="sg-img">
          <img src={signin_Image} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
