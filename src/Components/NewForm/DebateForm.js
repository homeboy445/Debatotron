import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./DebForm.css";
import AuthContext from "../../Contexts/AuthContext";

const DebateForm = ({ userInfo, ToggleDisplay }) => {
  const Main = useContext(AuthContext);
  const [title, Altertitle] = useState("");
  const [Description, AlterDesc] = useState("");
  const [category, change_catg] = useState("categories");
  const [finishStatus, setfinishStatus] = useState(false);

  const HandleTitle = (evt) => {
    Altertitle(evt.target.value);
  };

  const HandleDescription = (evt) => {
    AlterDesc(evt.target.value);
  };

  const SendData = (event) => {
    console.log(Main);
    if (!(title && Description && category) || category === "categories" || Main.uuid === null) {
      return;
    }
    event.preventDefault();
    axios
      .post("http://localhost:3005/save", {
        uniqid: Main.uuid,
        title: title,
        overview: Description,
        publishedat: new Date().toLocaleDateString(),
        publisher: userInfo[0].name,
        flag: true,
        link: "",
        category: category,
        access: "public",
      })
      .then((response) => {
        window.location.href = `DebPage/${response.data}`;
      })
      .catch((err) => {
        ToggleDisplay({
          text: "Some Error has occured please try again...",
          status: true,
        });
      });
  };

  useEffect(() => {
    axios
      .post("http://localhost:3005/isdebatevalid", {
        id: Main.uuid,
      })
      .then((response) => {
        if (response.data) {
          window.location.href = "/";
        }
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
