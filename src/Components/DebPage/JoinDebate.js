import React, { useEffect } from "react";
import axios from "axios";

const JoinDebate = ({
  title,
  description,
  name,
  publishedAt,
  debateId,
  userInfo,
  updateParticipation,
}) => {
  const UpdateParticipation = (val) => {
    axios
      .post("http://localhost:3005/updateParticipation", {
        debId: debateId,
        user: userInfo.name,
        userId: userInfo.id,
        status: val,
      })
      .then((response) => {
        updateParticipation(true);
      })
      .catch((err) => {
        return;
      });
  };

  useEffect(() => {
    if (name === userInfo.name) {
      updateParticipation(true);
    }
  }, [name, userInfo]);

  const image = `https://avatars.dicebear.com/api/micah/${Math.random()}.svg`;

  return (
    <div className="JoinDeb">
      <div className="J_deb_inf">
        <div>
          <img src={image} alt="" />
          <h2>{name || "xyz"}</h2>
        </div>
        <h2>{new Date(publishedAt).toTimeString().slice(0, 5) + " | " + new Date(publishedAt).toDateString() || "today"}</h2>
      </div>
      <div className="J_deb_1">
        <div>
          <h1>{title || "How to be awesome?"}</h1>
          <h2>
            {description || "Just follow your instincts and be yourself."}
          </h2>
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
