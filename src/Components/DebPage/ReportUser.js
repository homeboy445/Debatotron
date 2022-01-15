import React, { useState, useContext } from "react";
import axios from "axios";
import Alert from "../../Images/alert.svg";
import AuthContext from "../../Contexts/AuthContext";

const ReportUser = ({ debateId, owner, userList, user, toggleBox }) => {
  const Main = useContext(AuthContext);
  const [selectedUser, updateSelection] = useState("#");

  return (
    <div className="alt_pp">
      <img src={Alert} alt="" />
      <select
        value={selectedUser}
        onChange={(e) => {
          updateSelection(e.target.value);
        }}
      >
        <option value="#">Choose user</option>
        {(userList || ["Choose user"]).map((item, index) => {
          if (item.username === user.name) {
            return null;
          }
          return (
            <option key={index} value={item.userid}>
              {item.username}
            </option>
          );
        })}
      </select>
      <h3>Note: you can only a report a user once per debate.</h3>
      <div className="alt_pp_btns">
        <button
          onClick={() => {
            if (selectedUser === "#") {
              return;
            }
            let Id = parseInt(selectedUser);
            axios
              .post(
                `${Main.uri}/reportUser`,
                {
                  debateId: debateId,
                  userId: Id,
                  reporterId: user.id,
                },
                Main.getAuthHeader()
              )
              .then((response) => {
                throw response;
              })
              .catch((err) => {
                try {
                  if (err.response.status === 401) {
                    Main.refresh();
                  }
                } catch (e) {}
                toggleBox();
              });
          }}
        >
          Report User
        </button>
        <button onClick={toggleBox}>Cancel</button>
      </div>
    </div>
  );
};

export default ReportUser;
