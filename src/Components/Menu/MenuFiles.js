import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "react-loader-spinner";
import Home from "../Home/HomePage";
import "./Nav.css";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoginRoute from "../ProtectedRoute/LoginRoute";
import SignIn from "../SignIn/SignIn";
import DebateForm from "./../NewForm/DebateForm";
import Register from "../Register/Register";
import ForgotPassword from "../ForgePassword/ForgotPass";
import DebatePage from "../DebPage/DebatePage";
import OngoingDebs from "../OngoingDebs/OngoingDebs";
import Navigation from "./Navigation";
import Inbox from "../Inbox/Inbox";
import UserFeed from "./../Home/UserFeed";
import ProfilePage from "../Profile/ProfilePage";
import TutorialBox from "../Sub_Components/InputBox/TutorialBox";
import SignOut from "../SignOut";

const MenuFiles = () => {
  const globalContext = useContext(AuthContext);
  const HandleAuth = (data_object) => {
    if (data_object.data != null) {
      sessionStorage.setItem("name", data_object.data);
      globalContext.toAuth(true);
      return (window.location.href = "/");
    }
    globalContext.toAuth(false);
  };

  return (
    <div>
      {globalContext.loading ? (
        <div className="loader">
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={250}
            width={250}
            timeout={60 * 1000 * 2}
          />
        </div>
      ) : null}
      {globalContext.Auth ? <Navigation /> : null}
      {globalContext.TutorialBox.status ? <TutorialBox /> : null}
      <div
        className="dsp_bx"
        style={{
          top: globalContext.DisplayBox.status
            ? `${85 - Math.sqrt(globalContext.DisplayBox.text.length)}%`
            : "90%",
          opacity: globalContext.DisplayBox.status ? 1 : 0,
        }}
      >
        <h1>{globalContext.DisplayBox.text || "This is a test message."}</h1>
      </div>
      <main
        className="App"
        style={{
          opacity:
            globalContext.loading || globalContext.TutorialBox.status
              ? globalContext.TutorialBox.status
                ? 0.4
                : 0
              : 1,
          pointerEvents:
            globalContext.loading || globalContext.TutorialBox.status ? "none" : "all",
          minHeight: "100vh"
        }}
      >
        <Routes>
          <Route
            path="/"
            exact
            element={!globalContext.Auth ? <Home auth={globalContext.Auth} /> : <UserFeed />}
          />
          <Route path="/signout" element={<SignOut />} />
          <Route 
            path="/new" 
            element={
              <ProtectedRoute
                pageName="debateform"
                auth={globalContext.Auth}
                userInfo={globalContext.userInfo}
                component={DebateForm}
              />
            } 
          />
          <Route 
            path="/DebPage/:id" 
            element={
              <ProtectedRoute
                pageName="debatepage"
                auth={globalContext.Auth}
                userInfo={globalContext.userInfo}
                component={DebatePage}
              />
            } 
          />
          <Route 
            path="/OngoingDebs" 
            element={
              <ProtectedRoute
                pageName="ongoingdeb"
                auth={globalContext.Auth}
                userInfo={globalContext.userInfo}
                component={OngoingDebs}
              />
            } 
          />
          <Route 
            path="/Inbox" 
            element={
              <ProtectedRoute
                pageName="inbox"
                auth={globalContext.Auth}
                userInfo={globalContext.userInfo}
                component={Inbox}
              />
            } 
          />
          <Route 
            path="/Profile/:user" 
            element={
              <ProtectedRoute
                pageName="profile"
                auth={globalContext.Auth}
                userInfo={globalContext.userInfo}
                FriendsList={globalContext.FriendsList}
                component={ProfilePage}
              />
            } 
          />
          <Route
            path="/signin"
            element={
              <LoginRoute
                auth={globalContext.Auth}
                HandleAuth={HandleAuth}
                component={SignIn}
              />
            }
          />
          <Route
            path="/register"
            element={
              <LoginRoute
              auth={globalContext.Auth}
              HandleAuth={HandleAuth}
              component={Register}
            />
            }
          />
          <Route
            path="/fp"
            element={
              <LoginRoute
                auth={globalContext.Auth}
                component={ForgotPassword}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default MenuFiles;
