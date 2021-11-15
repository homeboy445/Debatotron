import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import AuthContext from "./Contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router } from "react-router-dom";
import Menu from "./Components/Menu/MenuFiles";
import PolkaDotsBg from "./Assets/polka.jpg";

const isSessionValid = () => {
  return sessionStorage.getItem("name") !== null;
};

const App = () => {
  const [Auth, toAuth] = useState(isSessionValid());
  const [userInfo, Change_Info] = useState([{ id: -1, name: "user" }]);
  const [FriendsList, Update_List] = useState([]);
  const [uuid, change_uuid] = useState(sessionStorage.getItem("uuid"));

  useEffect(() => {
    if (sessionStorage.getItem("uuid") === null) {
      sessionStorage.setItem("uuid", uuidv4());
      change_uuid(sessionStorage.getItem("uuid"));
    }
    if (sessionStorage.getItem("name")) {
      toAuth(true);
      axios
        .get(`http://localhost:3005/profile/${sessionStorage.getItem("name")}`)
        .then((response) => {
          response = response.data;
          Change_Info(response);
          sessionStorage.setItem("username", response[0].name);
          axios
            .get(`http://localhost:3005/friendslist/${response[0].name}`)
            .then((response) => {
              Update_List(response.data);
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
    <AuthContext.Provider
      value={{
        Auth,
        toAuth,
        userInfo,
        friends: FriendsList,
        uuid,
        update_uuid: () => {
          sessionStorage.setItem("uuid", uuidv4());
          change_uuid(sessionStorage.getItem("uuid"));
        },
      }}
    >
      <div style={{ background: !Auth ? PolkaDotsBg : "white" }}>
        <Router>
          <Menu />
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
