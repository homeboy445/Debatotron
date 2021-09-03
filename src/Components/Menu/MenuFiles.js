import React, { useState, useContext, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../Home/HomePage";
import "./Nav.css";
import Cookie from "js-cookie";
import AuthContext from "../../Contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoginRoute from "../ProtectedRoute/LoginRoute";
import SignIn from "../SignIn/SignIn";
import Register from "../Register/Register";
import FriendsPage from "../FriendsPage/FriendsPage";
import ForgotPassword from "../ForgePassword/ForgotPass";
import Debpage from "../DebPage/DebPage";
import OngoingDebs from "../OngoingDebs/OngoingDebs";
import DebateForm from "../NewForm/DebateForm";
import Navigation from "./Navigation";
import Inbox from "../Inbox/Inbox";
import Profile from "../profile/Profile";
import DraftForm from "../NewForm/DraftForm";

const MenuFiles = () => {
  const [DisplayText, ToggleDisplay] = useState({ text: "", status: false });
  const Auth = useContext(AuthContext);
  const HandleAuth = (data_object) => {
    if (data_object.data != null) {
      Cookie.set("name", data_object.data);
      Auth.toAuth(true);
      return (window.location.href = "/");
    }
    Auth.toAuth(false);
  };

  const SignOut = () => {
    fetch("http://localhost:3005/signout?_method=DELETE", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((response) => {
        Cookie.remove("name");
        window.location.href = "/";
      });
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
      {Auth.Auth ? <Navigation /> : null}
      {DisplayText.status ? (
        <div
          className="Display-Text"
          style={{
            position: "absolute",
            top: "90%",
            left: "4%",
            fontSize: "1.7rem",
            padding: "0.2%",
            display: "flex",
            flexdirection: "column",
            color: "white",
            border: "2px solid blue",
            textShadow: "1px 1px 1px black",
            borderRadius: "4px",
            backgroundColor: "#4158D0",
            backgroundImage:
              "linear-gradient(125deg, #4158D0 0%, #C850C0 17%, #FFCC70 39%, #a4e2db 60%, #30bde0 80%, #4e08f9 100%)",
          }}
        >
          {DisplayText.text}
        </div>
      ) : null}
      <main className="App">
        <Switch>
          <Route path="/" exact render={() => <Home auth={Auth.Auth} />} />
          <Route path="/signout" render={() => SignOut()} />
          <ProtectedRoute
            path="/new"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            ToggleDisplay={ToggleDisplay}
            component={DebateForm}
          />
          <ProtectedRoute
            path="/Draft/:id"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            ToggleDisplay={ToggleDisplay}
            component={DraftForm}
          />
          <ProtectedRoute
            path="/DebPage/:id"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            ToggleDisplay={ToggleDisplay}
            component={Debpage}
          />
          <ProtectedRoute
            path="/OngoingDebs"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            ToggleDisplay={ToggleDisplay}
            component={OngoingDebs}
          />
          <ProtectedRoute
            path="/Inbox"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            ToggleDisplay={ToggleDisplay}
            component={Inbox}
          />
          <ProtectedRoute
            path="/Friends"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            FriendsList = {Auth.FriendsList}
            ToggleDisplay={ToggleDisplay}
            component={FriendsPage}
          />
          <ProtectedRoute
            path="/Profile/:user"
            auth={Auth.Auth}
            userInfo={Auth.userInfo}
            FriendsList = {Auth.FriendsList}
            ToggleDisplay={ToggleDisplay}
            component={Profile}
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
        </Switch>
      </main>
    </div>
  );
};

export default MenuFiles;
