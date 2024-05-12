import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../../Contexts/AuthContext";

const TutorialBox = () => {
  const Main = useContext(AuthContext);
  const [checked, toggleChecked] = useState(false);

  useEffect(() => {}, [Main]);

  return (
    <div className="tut_bx">
      <h1>{Main.TutorialBox.title || "Nothing to teach!"}</h1>
      <ul>
        {(Main.TutorialBox.contents || []).map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
      <div className="tut_bx_tick">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleChecked(!checked)}
        />
        <h3>Never show this again</h3>
      </div>
      <button
        onClick={() => {
          if (checked) {
            axios
              .patch(
                Main.serverURL + "/tutorial",
                {
                  user: Main.userInfo[0].name,
                  debateStatus:
                    Main.currentPage === "debatepage"
                      ? false
                      : Main.TutorialBox.tutorial_status.debatepage,
                  profileStatus:
                    Main.currentPage === "profile"
                      ? false
                      : Main.TutorialBox.tutorial_status.profilepage,
                },
                Main.getAuthHeader()
              )
              .then((response) => {
                return;
              });
          }
          Main.updateTutorialBox({
            title: "",
            contents: [],
            status: false,
          });
        }}
      >
        Got it!
      </button>
    </div>
  );
};

export default TutorialBox;
