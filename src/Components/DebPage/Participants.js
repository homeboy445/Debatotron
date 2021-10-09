import React, { useEffect } from "react";
import axios from "axios";

const Participants = ({
  owner,
  status,
  participants,
  debateId,
  userId,
  toggleBox,
}) => {
  const image = `https://avatars.dicebear.com/api/micah/${Math.random()}.svg`;

  useEffect(() => {}, [participants]);

  return (
    <div className="partpnts">
      <h1>Participants</h1>
      {owner ? (
        <h2>You're the owner of this debate.</h2>
      ) : (
        <h2>
          You're{" "}
          <span style={{ color: status ? "#405cf5" : "#e62e36" }}>
            {status ? "with" : "against"}
          </span>{" "}
          this debate's statement
        </h2>
      )}
      <div className="pnt_1">
        <div>
          {(participants[true] || ["No user's with this debate!"]).map(
            (item) => {
              return (
                <div key={item} className="nm_lne1">
                  {(participants[true] || []).length !== 0 ? (
                    <img src={image} alt="" />
                  ) : null}
                  <h2>{item}</h2>
                </div>
              );
            }
          )}
        </div>
        <div>
          {(participants[false] || ["No user's against this debate!"]).map(
            (item) => {
              return (
                <div key={item} className="nm_lne2">
                  {(participants[false] || []).length !== 0 ? (
                    <img src={image} alt="" />
                  ) : null}
                  <h2>{item}</h2>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className="ptp_btns">
        <button
          onClick={() => {
            axios
              .post("http://localhost:3005/changeSide", {
                debid: debateId,
                id: userId,
                status: !status,
              })
              .then((response) => {
                window.location.href = `/DebPage/${debateId}`;
              });
          }}
        >
          Switch Sides
        </button>
        <button onClick={toggleBox}>Return to debate</button>
      </div>
    </div>
  );
};

export default Participants;
