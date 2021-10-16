import React, { useState, useEffect } from "react";
import "./Debs.css";
import axios from "axios";
import SettingsIcon from "../../Assets/settings.svg";
import GridIcon from "../../Images/grid.svg";
import ListIcon from "../../Images/list.svg";

const OngoingDebs = () => {
  const [list, listUpdate] = useState([]);
  const [Debates, updateDebates] = useState([]);
  const [categoryList, updateCategoryList] = useState(["all"]);
  const [search, updateSearch] = useState("");
  const [category, changeCategory] = useState("all");
  const [settings, toggleSettingsPopup] = useState(false);
  const [searchType, changeSearchType] = useState(0);
  const [viewType, toggleType] = useState(0);
  const [fetchStatus, updateStatus] = useState(false);

  useEffect(() => {
    if (!fetchStatus) {
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
          updateStatus(true);
          arr = new Set();
          arr.add("all");
          response.data.map((item) => {
            return arr.add(item.category);
          });
          updateCategoryList([...arr]);
        })
        .catch((err) => {
          return;
        });
    }
    let results = [];
    Debates.map((item) => {
      if (
        (item.topic.includes(search) && searchType === 0) ||
        (item.publisher.includes(search) && searchType === 1) ||
        ((item.topic.includes(search) || item.topic.includes(search)) &&
          searchType === 2)
      ) {
        results.push(item);
      }
      return null;
    });
    listUpdate(results);
    console.log(searchType);
  }, [search, searchType, category]);

  return (
    <div className="debs_mainer">
      <div className="deb_main_title">
        <h1>Live Debates</h1>
        <div>
          <div className="deb_settings">
            <img src={SettingsIcon} alt="settings" />
            <div
              className="settings_1"
              style={{
                height: settings ? "0%" : "35%",
              }}
            >
              <h1>Settings</h1>
              <div className="settings_1_1">
                <h2>Category:</h2>
                <select value={category} onChange={(e)=>{
                  updateCategoryList(e.target.value);
                }}>
                  {categoryList.map((item, index) => {
                    return <option key={index} value={item}>{item}</option>;
                  })}
                </select>
              </div>
              <div className="settings_1_2">
                <h2>Search by:</h2>
                <div>
                  <div className="checkBX">
                    <input
                      type="checkbox"
                      defaultChecked={searchType === 0 || searchType === 2}
                      onChange={() => {
                        changeSearchType(searchType === 2 ? 1 : 0);
                      }}
                    />
                    <h3>Debates</h3>
                  </div>
                  <div className="checkBX">
                    <input
                      type="checkbox"
                      defaultChecked={searchType === 1 || searchType === 2}
                      onChange={() => {
                        changeSearchType(searchType === 0 ? 2 : 1);
                      }}
                    />
                    <h3>User</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <input
          type="text"
          placeholder="Search for debates"
          value={search}
          onChange={(e) => {
            updateSearch(e.target.value);
          }}
        />
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
