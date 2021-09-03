import React,{useState,useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../Contexts/AuthContext';
import {animated,useSpring} from 'react-spring';

const Navigation=()=>{
    const [on,turn]=useState(true);
    const [user,change_user]=useState('random');
    const Auth=useContext(AuthContext);
    const ToggleIt=()=>{
        turn(!on);
    }
    const {x1,x2,x3,x4,x5,evt}=useSpring({
        x1:on?[0,0,0]:[-45,-9,6],
        x2:on?1:0,
        x3:on?[0,0,0]:[45,-8,-15],
        x4:on?[100,0,0]:[0,1,0],
        evt:on?"none":"all"
    })
    return (
        <div>
        <div class="Ham-menu" onClick={ToggleIt}>
            <animated.div class="bar1"
            style={{
                transform:x1.interpolate((x,y,z)=>`translate(${y}px,${z}px) rotate(${x}deg)`),
            }}></animated.div>
            <animated.div class="bar2"
            style={{
                opacity:x2.interpolate(x=>x)
            }}></animated.div>
            <animated.div class="bar3"
            style={{
                transform:x3.interpolate((x,y,z)=>`translate(${y}px,${z}px) rotate(${x}deg)`)
            }}></animated.div>
        </div>
        <animated.nav className="nav-menu" style={{
            transform:x4.interpolate((x,y,z)=>`translate(${x}%,${z}%)`),
            opacity:x4.interpolate((x,y,z)=>y),
            pointerEvents:evt.interpolate(str=>str)
        }}>
            <ul>
            <Link to="/">
                <li onClick={ToggleIt}>Home</li>
            </Link>
            <Link to="/new">
                <li onClick={ToggleIt}>New Deb</li>
            </Link>
            <Link to="/OngoingDebs">
                <li onClick={ToggleIt}>OnGoing Debs</li>
            </Link>
            <Link to="/Inbox">
                <li onClick={ToggleIt}>Inbox</li>
            </Link>
            <Link to={`/Profile/${Auth.userInfo[0].name}`}>
                <li onClick={ToggleIt}>Profile</li>
            </Link>
            <Link to="/signout">
                <li onClick={ToggleIt}>Sign-Out</li>
            </Link>
            </ul>
        </animated.nav>
    </div>
    )
}
export default Navigation;
