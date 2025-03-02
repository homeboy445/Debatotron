import React, { useState, useContext } from "react";
import InputBox from "../Sub_Components/InputBox/InputBox";
import Loader from "react-loader-spinner";
import signin_Image from "../../Images/signin.jpg";
import axios from "axios";
import "./SignIn.css";
import AuthContext from "../../Contexts/AuthContext";

const SignIn = ({ HandleAuth, Change_Display }) => {
  const Main = useContext(AuthContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [stat, set] = useState("");
  const [isLoading, toggleLoader] = useState(false);

  const HandleName = (e) => {
    setName(e.target.value.trim());
  };
  const HandlePassword = (e) => {
    setPassword(e.target.value.trim());
  };
  const HandleSubmit = (event) => {
    event.preventDefault();
    if (!(name.trim() && password.trim())) {
      return;
    }
    toggleLoader(true);
    // Main.toggleLoader(true);
    axios
      .post(`${Main.serverURL}/signin`, {
        email: name,
        password: password,
      })
      .then((response) => {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        sessionStorage.setItem("id", response.data.id);
        Main.toAuth(true);
        window.location.href = "/";
      })
      .catch((err) => {
        toggleLoader(false);
        try {
          if (err.response.status === 401) {
            return Main.toggleDisplayBox("Wrong credentials!");
          }
        } catch (e) {}
        Main.toggleDisplayBox("Error! please try again.");
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
          <form className="signInForm" onSubmit={HandleSubmit}>
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
              <button type="submit" className="sg-btn">
                {!isLoading ? (
                  "Sign In"
                ) : (
                  <Loader
                    type="TailSpin"
                    color="#cccccc"
                    height={30}
                    width={50}
                    timeout={60 * 1000 * 2}
                    // strokeWidth={5} // Add this line to increase the border size
                  />
                )}
              </button>
            </div>
          </form>
        </div>
        <div id="sg_img_div">
          <img src={signin_Image} alt="" className="sg_img" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
