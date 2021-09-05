import React, { useState, useEffect } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import Typist from "react-typist";
import group_debate from '../../Images/group_debate.jpg';
import discuss from "../../Images/discuss.jpg";
import group from "../../Images/group.jpg";
import gradient1 from '../../Images/gradient.jpg';
import gradient2 from '../../Images/gradient1.jpg';
import gradient3 from '../../Images/gradient2.jpg';
import up_arrow from '../../Images/right-arrow.png';
import "./HomePage.css";

const LandingPage = ({ auth }) => {
  const [loop, varUpdate] = useState(1);
  const [scrollToTop, toggle] = useState(false);

  useEffect(() => {
    window.onload=()=>{
        scroll.scrollToTop();
    }
    window.onscroll = () =>{
        if(window.scrollY > 500){
            toggle(true);
        }else{
            toggle(false);
        }
    }
    varUpdate(1);
  }, [loop]);

  return (
    <div className="home-page">
      <div className="hp2">
        <div className="hp2-sub">
            <h1 id="title">Debatotron</h1>
            <div className="hp-btn">
                <button onClick={()=>window.location.href="/Register"}>Register</button>
                <button onClick={()=>window.location.href="/signin"}>LogIn</button>
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
        <img src={gradient1} className="grad1" alt=""/>
        <img src={gradient2} className="grad2" alt=""/>
      </div>
      <div className="hp4">
        <h2>
          Start your own debate or join someone else’s, and become a long term
          “All-hail-Debatotron” member.
        </h2>
        <img src={group} className="hp-debating-1" alt="debating..." />
        <img src={gradient3} className="grad3" alt=""/>
      </div>
      <div className="hp5">
        <h2>Search for people throughout the community.</h2>
        {loop ? (
          <Typist
            avgTypingDelay={50}
            onTypingDone={() => varUpdate(0)}
            className="hp5-type"
          >
            <span>William</span>
            <Typist.Backspace count={30} delay={1000} />
            <span>Charlie</span>
            <Typist.Backspace count={30} delay={1000} />
            <span>Arvind</span>
            <Typist.Backspace count={30} delay={1000} />
            <span>Raghav</span>
            <Typist.Backspace count={30} delay={1000} />
            <span>Alice</span>
          </Typist>
        ) : (
          ""
        )}
        <h2>And find your comrades.</h2>
      </div>
      <div className="hp6">
            <img src={group_debate} className="hp-debating-1" alt="group debate"/>
            <h2>
                Introducing private debates.
                Now it's only you vs your friends.
                Invite as many friends as you want
                cause its time for a debate party.
            </h2>
            <img src={gradient1} className="grad4" alt=""/>
      </div>
      <div className="hp7">
            <h1>So, What are you waiting for?</h1>
            <h1>Join In. ASAP.</h1>
      </div>
      {scrollToTop?<Link to="hp2" smooth={true} duration={1000}>
          <img src={up_arrow} className="up_arrow" alt="go-up"/>
      </Link>:null}
    </div>
  );
};

export default LandingPage;
