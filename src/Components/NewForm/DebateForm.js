import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./DebForm.css";
import AuthContext from "../../Contexts/AuthContext";

const DebateForm = ({ ToggleDisplay }) => {
  const Main = useContext(AuthContext);
  const [title, Altertitle] = useState("");
  const [Description, AlterDesc] = useState("");
  const [category, change_catg] = useState("categories");

  const HandleTitle = (evt) => {
    Altertitle(evt.target.value);
  };

  const HandleDescription = (evt) => {
    AlterDesc(evt.target.value);
  };

  const SendData = (event) => {
    if (
      !(title && Description && category) ||
      category === "categories" ||
      Main.uuid === null
    ) {
      return;
    }
    event.preventDefault();
    axios
      .post(
        Main.serverURL + "/save",
        {
          uniqid: Main.uuid,
          title: title,
          overview: Description,
          publishedat: new Date().toISOString(),
          publisher: Main.userInfo[0].name,
          flag: true,
          link: "",
          category: category,
          access: "public",
        },
        Main.getAuthHeader()
      )
      .then((response) => {
        window.location.href = `DebPage/${response.data}`;
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Main.refresh();
        }
        Main.toggleDisplayBox("Debate creation failed, please try again!");
      });
  };

  useEffect(() => {
    if (Main.loading) {
      Main.toggleLoader(false);
    }
    axios
      .post(
        Main.serverURL + "/isdebatevalid",
        {
          id: Main.uuid,
        },
        Main.getAuthHeader()
      )
      .then((response) => {
        if (response.data) {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Main.refresh();
        }
        Main.toggleDisplayBox("Error! please reload the page!");
      });
  }, [Main]);

  return (
    <div className="deb_form">
      <h1>Start A New Debate</h1>
      <div className="deb_form_1">
        <input
          type="text"
          placeholder="Your Debate Topic?"
          value={title}
          onChange={HandleTitle}
        />
        <textarea
          placeholder="Provide description to your topic..."
          onChange={HandleDescription}
          value={Description}
        ></textarea>
        <select
          value={category}
          onChange={(e) => {
            change_catg(e.target.value);
          }}
        >
          {[
            "categories",
            "general",
            "programming",
            "lifestyle",
            "pop-culture",
            "gaming",
            "movies",
            "politics",
            "science",
            "psychology",
            "study",
          ].map((item, index) => {
            return (
              <option value={item} key={index}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="deb_fm_btn">
        <button onClick={SendData}>Publish</button>
      </div>
    </div>
  );
};

export default DebateForm;
