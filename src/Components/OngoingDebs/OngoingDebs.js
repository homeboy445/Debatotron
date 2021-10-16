import React, { useState, useEffect } from "react";
import "./Debs.css";
import axios from "axios";
import SettingsIcon from "../../Assets/settings.svg";
import GridIcon from "../../Images/grid.svg";
import ListIcon from "../../Images/list.svg";

const OngoingDebs = () => {
  const [list, listUpdate] = useState([]);
  const [Debates, updateDebates] = useState([]);
  const [viewType, toggleType] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3005/GetDebs/public")
      .then(async (response) => {
        let arr = response.data;
        await axios
          .get("http://localhost:3005/GetDebs/private")
          .then((response) => {
            arr.concat(response.data);
          });
        listUpdate(response.data);
        updateDebates(response.data);
      })
      .catch((err) => {
        return;
      });
  }, []);

  return (
    <div className="debs_mainer">
      <div className="deb_main_title">
        <h1>Live Debates</h1>
        <div>
          <img src={SettingsIcon} alt="settings" />
          <img
            src={viewType === 0 ? ListIcon : GridIcon}
            alt="list"
            onClick={() => {
              toggleType((viewType + 1) % 2);
            }}
          />
        </div>
      </div>
      <div className="deb_search">
        <input type="text" placeholder="Search for debates" />
      </div>
      {viewType === 0 ? (
        <div className="deb_main_grid">
          {list.length > 0 ? (
            list.map((item, index) => {
              return (
                <div
                  key={index}
                  className="deb_card"
                  onClick={() =>
                    (window.location.href = `/DebPage/${item.debid}`)
                  }
                >
                  <div className="deb_card_1">
                    <h1>{item.topic}</h1>
                    <div>
                      <h3>{"by " + item.publisher}</h3>
                      <h3>{new Date(item.publishedat).toLocaleDateString()}</h3>
                    </div>
                  </div>
                  <h2>
                    {item.overview.slice(
                      0,
                      Math.min(50, item.overview.length - 1)
                    ) + "..."}
                  </h2>
                </div>
              );
            })
          ) : (
            <p></p>
          )}
        </div>
      ) : (
        <div className="deb_main_list">
          {list.map((item, index) => {
            return (
              <div
                key={index}
                className="deb_list"
                onClick={() =>
                  (window.location.href = `/DebPage/${item.debid}`)
                }
              >
                <h1>
                  {item.topic.slice(0, Math.min(50, item.topic.length - 1)) +
                    (item.topic.length <= 50 ? "" : "...")}
                </h1>
                <h3>{"by " + item.publisher}</h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OngoingDebs;
