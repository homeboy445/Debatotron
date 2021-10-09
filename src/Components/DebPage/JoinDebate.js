import React, { useState, useEffect } from "react";
import axios from "axios";

const JoinDebate = ({ debateId, userInfo, updateParticipation }) => {
  const [title, set_title] = useState("Debate title");
  const [description, set_description] = useState("Debate description");
  const [publisherInfo, set_info] = useState({
    name: "debmanager",
    publishedAt: new Date().toDateString(),
  });
  const [fetchStatus, updateStatus] = useState(false);

  const UpdateParticipation = (val) => {
    axios
      .post("http://localhost:3005/updateParticipation", {
        debId: debateId,
        user: userInfo.name,
        userId: userInfo.id,
        status: val,
      })
      .then((response) => {
        console.log(response);
        updateParticipation(val);
      })
      .catch((err) => {
        return;
      });
  };

  useEffect(() => {
    if (fetchStatus && userInfo.id === -1) {
      return;
    }
    axios
      .get(`http://localhost:3005/getdebdata/${debateId}`)
      .then((response) => {
        response = response.data[0];
        set_info({
          name: response.publisher,
          publishedAt: response.publishedat,
        });
        set_title(response.topic);
        set_description(response.overview);
        if (response.publisher === userInfo.name) {
          return updateParticipation(true);
        }
        updateStatus(true);
      });
  }, [title, description, userInfo]);

  const image = `https://avatars.dicebear.com/api/micah/${Math.random()}.svg`;

  return (
    <div className="JoinDeb">
      <div className="J_deb_inf">
        <div>
          <img src={image} alt="" />
          <h2>{publisherInfo.name}</h2>
        </div>
        <h2>{publisherInfo.publishedAt}</h2>
      </div>
      <div className="J_deb_1">
        <div>
          <h1>{title}</h1>
          <h2>{description}</h2>
        </div>
      </div>
      <div className="J_deb_2">
        <button onClick={() => UpdateParticipation(true)}>I'm with it</button>
        <button onClick={() => UpdateParticipation(false)}>
          I'm against it
        </button>
      </div>
    </div>
  );
};

export default JoinDebate;
