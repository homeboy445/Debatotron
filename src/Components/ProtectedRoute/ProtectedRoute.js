import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import AuthContext from "../../Contexts/AuthContext";

const ProtectedRoute = ({
  auth,
  userInfo,
  FriendsList,
  ToggleDisplay,
  pageName,
  component: Component,
  ...rest
}) => {
  const Main = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        Main.updatePage(pageName);
        return auth ? (
          <Component
            {...props}
            userInfo={userInfo}
            FriendsList={FriendsList}
            ToggleDisplay={ToggleDisplay}
          />
        ) : (
          <Redirect to="/SignIn" />
        );
      }}
    />
  );
};

export default ProtectedRoute;
