import React,{useState,useEffect,useRef} from 'react';
import {Redirect} from 'react-router-dom';
import {animated,useSpring} from 'react-spring';
import {Link} from 'react-scroll';
import arrow from '../../Images/arrow.png';
import './HomePage.css';
import Register from './../Register/Register';
const LandingPage = ({auth}) => {
    const [bit,toggle]=useState(false);
    const [hdr,toggleit]=useState(false);
    const props=useSpring({opacity:bit?1:0,transform:`translate(0%,${bit?0:30}%)`});
    const prop1=useSpring({opacity:hdr?1:0,transform:`scale(${hdr?1.5:1})`});
    useEffect(()=>{
        toggle(true);
        setTimeout(()=>{
            toggleit(true);
        },1900);
    },[]);
    return (
        <div className="center_page">
            {!auth?<div id="Welcome_text">
                <a className="butn4" href="/signin">SignIn</a>
                <a className="butn5" href="/register">Register</a>
            </div>:null}
            <animated.h1 className="Welcome_text" style={props}>Welcome Home,<br/>to the 
            <animated.span className="mn_hd" style={prop1}>Debatotron</animated.span></animated.h1>
            <Link to="Info_Page" smooth={true} duration={1000}><img src={arrow} className="arrow" style={{visibility:auth?"hidden":"visible",pointerEvents:auth?"none":"all"}}/></Link>
            {!auth?<div className="Info_Page" id="Info_Page">
                <h1 className="info_hdr">Where have you gotten yourself?</h1>
                <p className="info_text">Well,You must've been to places but this ain't like no where you've ever been to!
                    Welcome to the Kingdom of Awesomness, okay so listen you'll find a hell lotta 
                    young padawans like you here,Here-You debate,you make friends and most importantly
                    you become a better version of yourself. Well 'Nuff said!
                    Let's Roll!
                    <br/>(um.. Please Register If you're an untrained Jedi or Signin if you're a Master already)
                </p>
                <Link className="butn3" to="Welcome_text" smooth={true} duration={1000}>Lets Go!</Link>
            </div>:
            <div className="btns-page">
                <a className="butn1" href="/new">New</a>
                <a className="butn2" href="/OngoingDebs">Contribute</a>
            </div>
            }
        </div>
    )
}

export default LandingPage;
