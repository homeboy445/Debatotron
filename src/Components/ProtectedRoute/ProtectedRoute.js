import React, { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";

function ProtectedRoute ({
  auth,
  userInfo,
  FriendsList,
  ToggleDisplay,
  pageName,
  component: Component,
  ...rest
}) {
  const Main = useContext(AuthContext);
  console.log("$$ ",arguments);
  if (auth) {
    Main.updatePage(pageName);
    return <Component
      {...rest}
      userInfo={userInfo}
      FriendsList={FriendsList || []}
      ToggleDisplay={ToggleDisplay}
    />;
  } else {
    return <Navigate to="/SignIn" />;
  }
};

export default ProtectedRoute;
