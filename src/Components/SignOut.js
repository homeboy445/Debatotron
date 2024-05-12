import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from "../Contexts/AuthContext";

const SignOut = () => {
  const navigate = useNavigate();
  const serverURL = useContext(AuthContext).serverURL; // Make sure globalContext is available

  useEffect(() => {
    const signOutUser = async () => {
      try {
        await axios.delete(`${serverURL}/signout`, {
          data: {
            refreshToken: sessionStorage.getItem("refreshToken"),
          }
        });
        sessionStorage.clear();
        navigate('/'); // Redirect to home after clearing the session
      } catch (error) {
        console.error('Sign out failed:', error);
        // Handle errors, possibly redirect to an error page or display a message
      }
    };

    signOutUser();
  }, [navigate, serverURL]);

  return null; // This component does not render anything
};

export default SignOut;
