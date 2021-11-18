import React, { useState, useContext, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
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

const MenuFiles = () => {
  const [DisplayText, ToggleDisplay] = useState({ text: "", status: false });
  const Auth = useContext(AuthContext);
  const HandleAuth = (data_object) => {
    if (data_object.data != null) {
      sessionStorage.setItem("name", data_object.data);
      Auth.toAuth(true);
      return (window.location.href = "/");
    }
    Auth.toAuth(false);
  };

  const SignOut = async () => {
    await axios
      .delete(`${Auth.uri}/signout`, {
        refreshToken: sessionStorage.getItem("refreshToken"),
      })
      .then((response) => {})
      .catch(err=>{});
    window.location.href = "/";
    sessionStorage.clear();
  };

  useEffect(() => {
    if (!DisplayText.status) {
      return;
    }
    setTimeout(() => {
      ToggleDisplay(false);
    }, 5000);
  }, [DisplayText]);

  return (
    <div>
      {Auth.loading ? (
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
      {Auth.Auth ? <Navigation /> : null}
      {Auth.TutorialBox.status ? <TutorialBox /> : null}
      <main
        className="App"
        style={{
          opacity:
            Auth.loading || Auth.TutorialBox.status
              ? Auth.TutorialBox.status
                ? 0.4
                : 0
              : 1,
          pointerEvents:
            Auth.loading || Auth.TutorialBox.status ? "none" : "all",
        }}
      >
        <Switch>
          <Route
            path="/"
            exact
            render={() =>
              !Auth.Auth ? <Home auth={Auth.Auth} /> : <UserFeed />
            }
          />
          <Route path="/signout" render={() => SignOut()} />
          <ProtectedRoute
            path="/new"
            pageName="debateform"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            component={DebateForm}
          />
          <ProtectedRoute
            path="/DebPage/:id"
            pageName="debatepage"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            component={DebatePage}
          />
          <ProtectedRoute
            path="/OngoingDebs"
            pageName="ongoingdeb"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            component={OngoingDebs}
          />
          <ProtectedRoute
            path="/Inbox"
            pageName="inbox"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            component={Inbox}
          />
          <ProtectedRoute
            path="/Profile/:user"
            pageName="profile"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            FriendsList={Auth.FriendsList}
            component={ProfilePage}
          />
          <LoginRoute
            path="/signIn"
            auth={Auth.Auth}
            HandleAuth={HandleAuth}
            component={SignIn}
          />
          <LoginRoute
            path="/register"
            auth={Auth.Auth}
            HandleAuth={HandleAuth}
            component={Register}
          />
          <LoginRoute path="/fp" auth={Auth.Auth} component={ForgotPassword} />
          <Redirect to="/" from="*" />
        </Switch>
      </main>
    </div>
  );
};

export default MenuFiles;
