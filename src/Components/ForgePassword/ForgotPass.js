import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";
import InputBox from "../Sub_Components/InputBox/InputBox";
import "./ForgotPass.css";

const ForgotPass = () => {
  const Main = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState("Email");
  const [recoveryQuestion, setRecoveryQuestion] = useState("Your question will appear here!");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [authState, setAuthState] = useState(
    "Once we identify your email, your recovery question will prompt!"
  );

  const handleInputChange = (setter) => (event) => {
    const { value } = event.target;
    setter(value.trim() ? value : "");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(Main.serverURL + "/ForgotPassword", { email }, Main.getAuthHeader());
      const data = response.data;
      if (data[0].recovery) {
        setState("recover");
        setAuthState("Make sure you enter the right answer!");
        setRecoveryQuestion(data[0].recovery);
      } else {
        setAuthState("Email Not found!");
        setTimeout(() => setAuthState("We'll Identify your email & your recovery question will prompt!"), 4000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        Main.refresh();
      }
      setState("Email");
      setAuthState("Email not found!");
      setTimeout(() => setAuthState("We'll Identify your email & your recovery question will prompt!"), 4000);
      setRecoveryQuestion("Your question will appear here!");
    }
  };

  const handleSubmitRecovery = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(Main.serverURL + "/CheckRecovery", { email, answer }, Main.getAuthHeader());
      const data = response.data;
      if (data == 1) {
        setState("Change");
        setAuthState("Make sure the two Fields Matches!");
      } else {
        setAuthState("Wrong Answer!");
        setTimeout(() => setAuthState("Make sure you enter the right answer!"), 4000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        Main.refresh();
      }
      setAuthState("An Error has occurred!");
      setTimeout(() => setAuthState("Make sure you enter the right answer!"), 4000);
    }
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (password1 === password2) {
      try {
        const response = await axios.post(Main.serverURL + "/ChangePassword", { email, password: password1 }, Main.getAuthHeader());
        const data = response.data;
        if (data == 1) {
          window.location.href = "/signin";
        } else {
          throw new Error("Password change failed");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          Main.refresh();
        }
        setAuthState("An error has occurred!");
        setTimeout(() => setAuthState("Make sure the two Fields Matches!"), 4000);
      }
    } else {
      setAuthState("Passwords are not matching!");
      setTimeout(() => setAuthState("Make sure the two Fields Matches!"), 4000);
    }
  };

  useEffect(() => {
    console.log("running at fp! ", state);
    Main.toggleLoader(false);
  }, [])

  const renderForm = () => {
    switch (state) {
      case "Email":
        return (
          <div className="wrp-forp">
            <form className="wrapper_2" onSubmit={handleSubmitEmail}>
              <h2>Enter your Email Id to Retrieve your password!</h2>
              <InputBox type="email" placeholder="email" onChangeCallback={handleInputChange(setEmail)} value={email} />
              <p className="AuthS">{authState}</p>
              <button className="btn4">Submit</button>
            </form>
          </div>
        );
      case "recover":
        return (
          <div className="wrp-forp">
            <form className="wrapper_2" onSubmit={handleSubmitRecovery}>
              <h2>{recoveryQuestion}</h2>
              <InputBox type="text" placeholder="Your Answer" onChangeCallback={handleInputChange(setAnswer)} value={answer} />
              <p className="AuthS">{authState}</p>
              <button className="btn4">Submit</button>
            </form>
          </div>
        );
      case "Change":
        return (
          <div className="wrp-forp">
            <form className="wrapper_2" onSubmit={handleSubmitPasswordChange}>
              <InputBox type="password" placeholder="enter new password" onChangeCallback={handleInputChange(setPassword1)} value={password1} />
              <InputBox type="password" placeholder="enter again" onChangeCallback={handleInputChange(setPassword2)} value={password2} />
              <p className="AuthS">{authState}</p>
              <button className="btn4">Submit</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return renderForm();
};

export default ForgotPass;
