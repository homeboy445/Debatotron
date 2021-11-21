import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import AuthContext from "./Contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router } from "react-router-dom";
import Menu from "./Components/Menu/MenuFiles";
import PolkaDotsBg from "./Assets/polka.jpg";

const isSessionValid = () => {
  return sessionStorage.getItem("id") !== null;
};

const App = () => {
  const [Auth, toAuth] = useState(isSessionValid());
  const [userInfo, Change_Info] = useState([{ id: -1, name: "user" }]);
  const [FriendsList, Update_List] = useState([]);
  const [uuid, change_uuid] = useState(sessionStorage.getItem("uuid"));
  const [loading, toggleLoader] = useState(true);
  const [refreshed, refreshStatus] = useState(0);
  const [TutorialBox, updateTBox] = useState({
    title: "",
    contents: [],
    status: false,
    tutorial_status: {
      debatepage: true,
      profilepage: true,
    },
  });
  const [currentPage, updatePage] = useState("Home");
  const [DisplayBox, ToggleDisplayBox] = useState({ text: "This is a test message.", status: false });
  const uri = "https://debatotron.herokuapp.com";

  const refreshAccessToken = () => {
    axios
      .post(`${uri}/refresh`, {
        refreshToken: sessionStorage.getItem("refreshToken"),
      })
      .then((response) => {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        refreshStatus(refreshed + 1);
      })
      .catch((err) => {
        try {
          if (err.response.status === 401) {
            window.location.href = "/signout";
          }
        } catch (e) {}
      });
  };

  useEffect(() => {
    if (sessionStorage.getItem("uuid") === null) {
      sessionStorage.setItem("uuid", uuidv4());
      change_uuid(sessionStorage.getItem("uuid"));
    }
    if (sessionStorage.getItem("id")) {
      toAuth(true);
      axios
        .get(`${uri}/profile/${sessionStorage.getItem("id")}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          response = response.data;
          Change_Info(response);
          sessionStorage.setItem("username", response[0].name);
          axios
            .get(`${uri}/friendslist/${response[0].name}`, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "accessToken"
                )}`,
              },
            })
            .then((response1) => {
              Update_List(response1.data);
            })
            .catch((err) => {
              if (err.response.status === 401) {
                return refreshAccessToken();
              }
            });
        })
        .catch((err) => {
          try {
            if (err.response.status === 401) {
              return refreshAccessToken();
            }
          } catch (e) {}
          toAuth(false);
          sessionStorage.clear();
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
        getAuthHeader: () => {
          return {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          };
        },
        userInfo,
        friends: FriendsList,
        uri,
        uuid: uuid,
        refresh: refreshAccessToken,
        update_uuid: () => {
          sessionStorage.setItem("uuid", uuidv4());
          change_uuid(sessionStorage.getItem("uuid"));
        },
        loading,
        toggleLoader: (e = false) => toggleLoader(e),
        refreshed,
        TutorialBox,
        updateTutorialBox: (obj) => {
          updateTBox(obj);
        },
        currentPage,
        updatePage: (page) => updatePage(page),
        DisplayBox,
        toggleDisplayBox: (data) => {
          ToggleDisplayBox({ text: data, status: true });
          setTimeout(() => {
            ToggleDisplayBox({ text: "", status: false });
          }, 4000);
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
