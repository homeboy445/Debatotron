import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Cookie from "js-cookie";
import AuthContext from "./Contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import Menu from "./Components/Menu/MenuFiles";

const App = () => {
  const [Auth, toAuth] = useState(false);
  const [userInfo, Change_Info] = useState([{ id: "", name: "user" }]);
  const [FriendsList, Update_List] = useState([]);
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
                if(response.data){
                  Update_List(response.data);
                }
            }).catch(err=>{return err;});
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
      <Router>
        <Menu />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
