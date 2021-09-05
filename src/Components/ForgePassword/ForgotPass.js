import React, { useState } from "react";
import InputBox from "../Sub_Components/InputBox/InputBox";
import "./ForgotPass.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [state, setstate] = useState("Email");
  const [recovery_q, set_rec] = useState("You're question will appear here!");
  const [password_1, setPass_1] = useState("");
  const [password_2, setPass_2] = useState("");
  const [Auth_state, setAuth_state] = useState(
    "Once we identify your email, your recovery question will prompt!"
  );
  const HandleEmailChange = (event) => {
    if (event.target.value.trim()) {
      setEmail(event.target.value);
    } else {
      setEmail("");
    }
  };
  const HandleAnswerChange = (e) => {
    if (e.target.value.trim()) {
      setAnswer(e.target.value);
    } else {
      setAnswer("");
    }
  };
  const HandlePasswordChange = (e) => {
    if (e.target.value.trim()) {
      setPass_1(e.target.value);
    } else {
      setPass_1("");
    }
  };
  const HandlePasswordChange_1 = (e) => {
    if (e.target.value.trim()) {
      setPass_2(e.target.value);
    } else {
      setPass_2("");
    }
  };
  const HandleSubmit_1 = (e) => {
    e.preventDefault();
    fetch("http://localhost:3005/ForgotPassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response[0].recovery) {
          setstate("recover");
          setAuth_state("Make sure you enter the right answer!");
          return set_rec(response[0].recovery);
        } else {
          setAuth_state("Email Not found!");
          setTimeout(() => {
            setAuth_state(
              "We'll Identify your email & your recovery question will prompt!"
            );
          }, 4000);
        }
      })
      .catch((err) => {
        setstate("Email");
        setAuth_state("Email not found!");
        setTimeout(() => {
          setAuth_state(
            "We'll Identify your email & your recovery question will prompt!"
          );
        }, 4000);
        set_rec("You're question will appear here!");
      });
  };
  const HandleSubmit_2 = (e) => {
    e.preventDefault();
    fetch("http://localhost:3005/CheckRecovery", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        answer: answer,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response === "Found!") {
          setstate("Change");
          setAuth_state("Make sure the two Fields Matches!");
        } else {
          setAuth_state("Wrong Answer!");
          setTimeout(() => {
            setAuth_state("Make sure you enter the right answer!");
          });
        }
      })
      .catch((err) => {
        setAuth_state("An Error has occured!");
        setTimeout(() => {
          setAuth_state("Make sure you enter the right answer!");
        }, 4000);
      });
  };
  const HandleSubmit_3 = (e) => {
    e.preventDefault();
    if (password_1 === password_2) {
      fetch("http://localhost:3005/ChangePassword", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password_1,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response === "Successfull!") {
            window.location.href = "/signin";
          } else {
            throw response;
          }
        })
        .catch((err) => {
          setAuth_state("An error has occured!");
          setTimeout(() => {
            setAuth_state("Make sure the two Fields Matches!");
          }, 4000);
        });
    } else {
      setAuth_state("Passwords are not matching!");
      setTimeout(() => {
        setAuth_state("Make sure the two Fields Matches!");
      }, 4000);
    }
  };
  return state === "Email" ? (
    <div className="wrp-forp">
      <form className="wrapper_2" onSubmit={HandleSubmit_1}>
        <h2>Enter your Email Id to Retrieve your password!</h2>
        <InputBox
          type="email"
          placeholder="email"
          onChangeCallback={HandleEmailChange}
          value={email}
        />
        <p className="AuthS">{Auth_state}</p>
        <button className="btn4">Submit</button>
      </form>
    </div>
  ) : state === "recover" ? (
    <div className="wrp-forp">
      <form className="wrapper_2" onSubmit={HandleSubmit_2}>
        <h2>{recovery_q}</h2>
        <InputBox
          type="text"
          placeholder="Your Answer"
          onChangeCallback={HandleAnswerChange}
          value={answer}
        />
        <p className="AuthS">{Auth_state}</p>
        <button className="btn4">Submit</button>
      </form>
    </div>
  ) : (
    <div className="wrp-forp">
      <form className="wrapper_2" onSubmit={HandleSubmit_3}>
        <InputBox
          type="password"
          placeholder="enter new password"
          onChangeCallback={HandlePasswordChange}
          value={password_1}
        />
        <InputBox
          type="password"
          placeholder="enter again"
          onChangeCallback={HandlePasswordChange_1}
          value={password_2}
        />
        <p className="AuthS">{Auth_state}</p>
        <button className="btn4">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPass;
