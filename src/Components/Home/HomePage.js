import React, { useState, useEffect, useContext } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import group_debate from "../../Images/group_debate.jpg";
import discuss from "../../Images/discuss.jpg";
import group from "../../Images/group.jpg";
import gradient1 from "../../Images/gradient.jpg";
import gradient2 from "../../Images/gradient1.jpg";
import gradient3 from "../../Images/gradient2.jpg";
import up_arrow from "../../Images/right-arrow.png";
import "./HomePage.css";
import AuthContext from "../../Contexts/AuthContext";

const LandingPage = ({ auth }) => {
  const Main = useContext(AuthContext);
  const [loop, varUpdate] = useState(1);
  const [scrollToTop, toggle] = useState(false);

  console.log("toggled loader to be false!");

  useEffect(() => {
    setTimeout(() => Main.toggleLoader(false), 1000);
    window.onload = () => {
      scroll.scrollToTop();
    };
    window.onscroll = () => {
      if (window.scrollY > 500) {
        toggle(true);
      } else {
        toggle(false);
      }
    };
    varUpdate(1);
  }, [loop]);

  return (
    <div className="home-page">
      <div className="hp2">
        <div className="hp2-sub">
          <h1 id="title">Debatotron</h1>
          <div className="hp_btn">
            <a href="/signin" id="register_btn">
              SignIn
            </a>
            <a href="/register" id="signin_btn">
              Register
            </a>
          </div>
        </div>
        <div className="hp2-1">
          <h2>A place where you can right the wrongs.</h2>
          <h3>Being a part of debating has never been this easy.</h3>
        </div>
      </div>
      <div className="hp3">
        <img src={discuss} className="hp-debating" alt="debating..." />
        <h2>
          Express yourself like you have never before and make awesome friends
          in the process.
        </h2>
        <img src={gradient1} className="grad1" alt="" />
        <img src={gradient2} className="grad2" alt="" />
      </div>
      <div className="hp4">
        <h2>
          Start your own debate or join someone else’s, and become a long term
          “All-hail-Debatotron” member.
        </h2>
        <img src={group} className="hp-debating-1" alt="debating..." />
        <img src={gradient3} className="grad3" alt="" />
      </div>
      <div className="hp5">
        <h2>Search for people throughout the community.</h2>
        {loop ? (
          "Any user you want!"
        ) : (
          ""
        )}
        <h2>And find your comrades.</h2>
      </div>
      <div className="hp6">
        <img src={group_debate} className="hp-debating-1" alt="group debate" />
        <h2>
          Introducing private debates. Now it's only you vs your friends. Invite
          as many friends as you want cause its time for a debate party.
        </h2>
        <img src={gradient1} className="grad4" alt="" />
      </div>
      <div className="hp7">
        <h1>So, What are you waiting for?</h1>
        <h1>Join In. ASAP.</h1>
      </div>
      {scrollToTop ? (
        <Link to="hp2" smooth={true} duration={1000}>
          <img src={up_arrow} className="up_arrow" alt="go-up" />
        </Link>
      ) : null}
    </div>
  );
};

export default LandingPage;
