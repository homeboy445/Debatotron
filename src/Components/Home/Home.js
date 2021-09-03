import React from 'react'
import './Display.css';
import { useSpring,animated } from 'react-spring';
const Home=({auth})=>{
    const props=useSpring({opacity: 1,transform:"scale(1)",from: {opacity: 0,transform:"scale(1.1)"}});
    console.log('auth=',auth);
    return (
        <div className="Home">
            {!auth?
            (<div className="btns">
            <a href="/register" className="btn1">Sign up</a>
            <a href="/signin" className="btn2">Log in</a>
            </div>):null}
            <div >
                <animated.h1 style={props} className="h11">Welcome Aboard,<span>to the Debatotron</span></animated.h1>
                <animated.h2 style={props}>Make Yourself Home! Mate!</animated.h2>
                <animated.h2 style={props}>Come Join Us,Within this Wonderfull Quest of Ours!</animated.h2>
                <div className="hfs">
                <a href="/new" className="btn1">Start New</a>
                <a href="/OngoingDebs" className="btn2">Contribute</a>
            </div>
            </div>
        </div>
    )
}

export default Home;
