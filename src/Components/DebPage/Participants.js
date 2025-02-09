import React, { useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";

const Participants = ({
  owner,
  status,
  participants,
  debateId,
  userId,
  name,
  toggleBox,
}) => {
  const Main = useContext(AuthContext);
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
          {Array.isArray(participants[true]) && participants[true].length > 0 ? participants[true].map(
            (item) => {
              const image = Main.getAvatarImage(item.image);
              return (
                <div key={item.name} className="nm_lne1">
                  {(participants[true] || []).length !== 0 ? (
                    <div
                      className="profile-pic"
                      style={{ background: "#405cf5" }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{
                          margin: "1%",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  ) : null}
                  <h2
                    style={{
                      color: name === item ? "gold" : "black",
                      textShadow:
                        name === item ? "1px 1px 1px #405cf5" : "none",
                    }}
                  >
                    {item.name}
                  </h2>
                </div>
              );
            }
          ) : <h2 className="no_participants">No user's with this debate!</h2>}
        </div>
        <div>
          {Array.isArray(participants[false]) && participants[false].length > 0 ? participants[false].map(
            (item, index) => {
              const image = Main.getAvatarImage(item.image);
              return (
                <div key={index} className="nm_lne2">
                  {(participants[false] || []).length !== 0 ? (
                    <div
                      className="profile-pic"
                      style={{ background: "#e62e36" }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{
                          margin: "1%",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  ) : null}
                  <h2
                    style={{
                      color: name === item ? "gold" : "black",
                      textShadow:
                        name === item ? "1px 1px 1px #e62e36" : "none",
                    }}
                    onClick={() => {
                      window.location.href = `/Profile/${item.byuser}`;
                    }}
                  >
                    {item.name}
                  </h2>
                </div>
              );
            }
          ) : <h2 className="no_participants">No user's against this debate!</h2>}
        </div>
      </div>
      <div className="ptp_btns">
        <button
          disabled={owner}
          onClick={() => {
            axios
              .post(
                `${Main.serverURL}/changeSide`,
                {
                  debid: debateId,
                  id: userId,
                  status: status === "false" ? true : false,
                },
                Main.getAuthHeader()
              )
              .then((response) => {
                window.location.href = `/DebPage/${debateId}`;
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  Main.refresh();
                }
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
