import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "../../Images/abstractbg1.jpg";

const JoinDebate = ({ debateId, userInfo }) => {
  const [title, set_title] = useState("Debate title");
  const [description, set_description] = useState("Debate description");
  const [fetchStatus, updateStatus] = useState(false);

  useEffect(() => {
    if (fetchStatus) {
      return;
    }
    axios
      .get(`http://localhost:3005/getdebdata/${debateId}`)
      .then((response) => {
        response = response.data[0];
        set_title(response.topic);
        set_description(response.overview);
      });
  }, [title, description]);

  return (
    <div className="JoinDeb">
      <div className="J_deb_1">
        <img src={Image} alt="" />
        <div>
          <h1>{title}</h1>
          <h2>{description}</h2>
        </div>
      </div>
      <div className="J_deb_2">
        <button>I'm with it</button>
        <button>I'm against it</button>
      </div>
    </div>
  );
};

export default JoinDebate;
