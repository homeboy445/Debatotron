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
            component={() => (
              <li
                onClick={() => {
                  window.location.href = "/";
                  ToggleIt();
                }}
              >
                Home
              </li>
            )}
          />
          <Link
            to="/new"
            component={() => (
              <li
                onClick={() => {
                  window.location.href = "/new";
                  ToggleIt();
                }}
              >
                New Deb
              </li>
            )}
          />
          <Link
            to="/OngoingDebs"
            component={() => (
              <li
                onClick={() => {
                  window.location.href = "/OngoingDebs";
                  ToggleIt();
                }}
              >
                OnGoing Debs
              </li>
            )}
          />
          <Link
            to="/Inbox"
            component={() => (
              <li
                onClick={() => {
                  window.location.href = "/Inbox";
                  ToggleIt();
                }}
              >
                Inbox
              </li>
            )}
          />
          <Link
            to={`/Profile/${Auth.userInfo[0].name}`}
            component={() => (
              <li
                onClick={() => {
                  window.location.href = `/Profile/${Auth.userInfo[0].name}`;
                  ToggleIt();
                }}
              >
                Profile
              </li>
            )}
          />
          <Link
            to="/signout"
            component={() => (
              <li
                onClick={() => {
                  window.location.href = "/signout";
                  ToggleIt();
                }}
              >
                Sign-Out
              </li>
            )}
          />
        </ul>
      </animated.nav>
    </div>
  );
};
export default Navigation;
