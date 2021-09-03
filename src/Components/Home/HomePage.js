import React,{useState,useEffect,useRef} from 'react';
import {Redirect} from 'react-router-dom';
import {animated,useSpring} from 'react-spring';
import {Link} from 'react-scroll';
import debate from '../../Images/debate.jpg';
import discuss from '../../Images/discuss.jpg';
import group from '../../Images/group.jpg';
import Typist from 'react-typist';
import './HomePage.css';
import Register from './../Register/Register';
const LandingPage = ({auth}) => {
    return (
        <div className="home-page">
            <div className="hp1">
                <h1>Debatotron</h1>
                <div className="hp-btn1">
                    <button>SignIn</button>
                    <button>Register</button>
                </div>
            </div>
            <div className="hp2">
                <div className="hp2-1">
                    <h2>
                        A place where you can
                        right the wrongs.
                    </h2>
                    <h3>Being a part of debating has never been this easy.</h3>
                </div>
                <img src={debate} className="hp-debating"
                alt="debating..."/>
            </div>
            <div className="hp3">
                <img src={discuss} className="hp-debating"
                alt="debating..."/>
                <h2>
                    Express yourself like you have never before and
                    make awesome friends in the process.
                </h2>
            </div>
            <div className="hp4">
                <h2>
                    Start your own debate or join someone else’s, and become a long term
                    “All-hail-Debatotron” member.
                </h2>
                <img src={group} className="hp-debating-1"
                alt="debating..."/>
            </div>
            <div className="hp5">
                <h2>Search for people throughout the community.</h2>
                <Typist className="hp5-type">
                    <div>William</div>
                    <Typist.Delay ms="500ms"/>
                </Typist>
            </div>
        </div>
    );
}

export default LandingPage;
