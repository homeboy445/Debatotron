import React, { useState } from "react";
import axios from "axios";
import Alert from "../../Images/alert.svg";

const ReportUser = ({ debateId, userList, userId, toggleBox }) => {
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
            console.log(selectedUser);
            let Id = parseInt(selectedUser);
            axios
              .post("http://localhost:3005/reportUser", {
                debateId: debateId,
                userId: Id,
                reporterId: userId,
              })
              .then((response) => {
                throw response;
              })
              .catch((err) => {
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
