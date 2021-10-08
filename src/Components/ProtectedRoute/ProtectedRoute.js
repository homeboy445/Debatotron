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
      render={(props) => {
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
