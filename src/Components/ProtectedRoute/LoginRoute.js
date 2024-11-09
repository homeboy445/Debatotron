import React from "react";
import { Navigate } from "react-router-dom";
const LoginRoute = ({ auth, HandleAuth, component: Component, ...rest }) => {
  console.log(">> ", auth);
  return auth ? (
    <Navigate to="/" />
  ) : (
    <Component HandleAuth={HandleAuth} />
  );
};

export default LoginRoute;
