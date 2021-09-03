import React from "react";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({
  auth,
  userInfo,
  FriendsList,
  ToggleDisplay,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={() => {
        return auth ? (
          <Component
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
