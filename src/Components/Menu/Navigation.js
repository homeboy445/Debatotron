import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";
import { animated, useSpring } from "react-spring";

const Navigation = () => {
  const [on, turn] = useState(true);
  const Auth = useContext(AuthContext);
  const ToggleIt = () => {
    turn(!on);
  };
  const { x1, x2, x3, x4, evt } = useSpring({
    x1: on ? [0, 0, 0] : [-45, -3, 6],
    x2: on ? 1 : 0,
    x3: on ? [0, 0, 0] : [45, -2, -15],
    x4: on ? [-100, 0, 0] : [0, 1, 0],
    evt: on ? "none" : "all",
  });
  return (
    <div>
      <div className="Ham-menu" onClick={ToggleIt}>
        <animated.div
          className="bar1"
          style={{
            transform: x1.interpolate(
              (x, y, z) => `translate(${y}px,${z}px) rotate(${x}deg)`
            ),
          }}
        ></animated.div>
        <animated.div
          className="bar2"
          style={{
            opacity: x2.interpolate((x) => x),
          }}
        ></animated.div>
        <animated.div
          className="bar3"
          style={{
            transform: x3.interpolate(
              (x, y, z) => `translate(${y}px,${z}px) rotate(${x}deg)`
            ),
          }}
        ></animated.div>
      </div>
      <animated.nav
        className="nav-menu"
        style={{
          transform: x4.interpolate((x, y, z) => `translate(${x}%,${z}%)`),
          opacity: x4.interpolate((x, y, z) => y),
          pointerEvents: evt.interpolate((str) => str),
        }}
      >
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        <ul>
          <Link
            to="/"
            onClick={() => {
              ToggleIt();
            }}
          >
            <li>Home</li>
          </Link>
          <Link
            to="/new"
            onClick={() => {
              ToggleIt();
            }}
          >
            <li>New Deb</li>
          </Link>
          <Link
            to="/OngoingDebs"
            onClick={() => {
              ToggleIt();
            }}
          >
            <li>OnGoing Debs</li>
          </Link>
          <Link
            to="/Inbox"
            onClick={() => {
              ToggleIt();
            }}
          >
            <li>Inbox</li>
          </Link>
          <Link
            to={`/Profile/${Auth.userInfo[0].name}`}
            onClick={() => {
              ToggleIt();
            }}
          >
            <li>Profile</li>
          </Link>
          <Link
            to="/signout"
            onClick={() => {
              ToggleIt();
            }}
          >
            <li>Sign-Out</li>
          </Link>
        </ul>
      </animated.nav>
    </div>
  );
};
export default Navigation;
