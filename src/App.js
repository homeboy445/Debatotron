import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Cookie from "js-cookie";
import AuthContext from "./Contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import Menu from "./Components/Menu/MenuFiles";
import Particles from "react-particles-js";

const App = () => {
  const [Auth, toAuth] = useState(false);
  const [userInfo, Change_Info] = useState([{ id: "", name: "user" }]);
  const [FriendsList, Update_List] = useState([]);

  const shouldRenderParticles = () =>{
    const uri = window.location.href;
    var endpoint = uri.substr(uri.lastIndexOf("/") + 1,);
    if (endpoint === "signin" || endpoint === "register" || endpoint === "fp")
    {
      document.body.style.backgroundColor = "rgb(17, 16, 16)";
      return true;
    }
    document.body.style.backgroundColor = "white";
    return false;
  }

  useState(() => {
    if (Cookie.get("name")) {
      toAuth(true);
      axios
        .get(`http://localhost:3005/profile/${Cookie.get("name")}`)
        .then((response) => {
          response = response.data;
          Change_Info(response);
          Cookie.set("username", response[0].name);
          axios
            .get(`http://localhost:3005/friendslist/${response[0].name}`)
            .then((response) => {
              if (response.data) {
                Update_List(response.data);
              }
            })
            .catch((err) => {
              return err;
            });
        })
        .catch((err) => {
          toAuth(false);
        });
    } else {
      toAuth(false);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ Auth, toAuth, userInfo, FriendsList }}>
      {shouldRenderParticles()?<Particles
        params={{
          particles: {
            number: {
              value: 300,
              density: {
                enable: true,
                value_area: 1000,
              },
            }
          },
        }}
        style={{
          position:'absolute'
        }}
      />:null}
      <Router>
        <Menu />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
