import React, { useState, useEffect, useContext } from "react";
import "./Debs.css";
import axios from "axios";
import SettingsIcon from "../../Assets/settings.svg";
import GridIcon from "../../Images/grid.svg";
import ListIcon from "../../Images/list.svg";
import AuthContext from "../../Contexts/AuthContext";

const OngoingDebs = () => {
  const Main = useContext(AuthContext);
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
      Main.toggleLoader(true);
      axios
        .get(Main.serverURL + "/GetDebs/public", Main.getAuthHeader())
        .then(async (response) => {
          let arr = response.data;
          await axios
            .get(Main.serverURL + "/GetDebs/private", Main.getAuthHeader())
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
          Main.toggleLoader(false);
        })
        .catch((err) => {
          try {
            if (err.response.status === 401) {
              Main.refresh();
              updateStatus(false);
            }
          } catch(e) {}
          Main.toggleDisplayBox("Failed to fetch resources!");
          return Main.toggleLoader(true);
        });
    }
    if (searchType === -1) {
      return;
    }
    let results = [];
    Debates.map((item) => {
      if (
        (item.topic.includes(search) && searchType === 0) ||
        (item.publisher.includes(search) && searchType === 1) ||
        ((item.topic.includes(search) || item.publisher.includes(search)) &&
          searchType === 2)
      ) {
        if (category === "all" || item.category === category) {
          results.push(item);
        }
      }
      return null;
    });
    listUpdate(results);
  }, [search, searchType, category, Main]);

  return (
    <div className="debs_mainer">
      <div className="deb_main_title">
        <h1>Live Debates</h1>
        <div>
          <div className="deb_settings">
            <img
              src={SettingsIcon}
              alt="settings"
              style={{
                transform: settings ? "rotate(90deg)" : "rotate(0deg)",
              }}
              onClick={() => {
                if (list.length === 0) {
                  return;
                }
                toggleSettingsPopup(!settings);
              }}
            />
            <div
              className="settings_1"
              style={{
                opacity: settings ? 1 : 0,
                pointerEvents: settings ? "all" : "none",
                transform: settings
                  ? "translate(0%, 0%)"
                  : "translate(20%, -20%)",
                transition: "0.4s ease",
              }}
            >
              <h1>Settings</h1>
              <div className="settings_1_1">
                <h2>Category:</h2>
                <select
                  value={category}
                  onChange={(e) => {
                    changeCategory(e.target.value);
                  }}
                >
                  {(categoryList || ["all"]).map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="settings_1_2">
                <h2>Search by:</h2>
                <div>
                  <div className="checkBX">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      onChange={() => {
                        changeSearchType(
                          searchType === 0
                            ? -1
                            : searchType === 2
                            ? 1
                            : searchType === -1
                            ? 0
                            : 2
                        );
                      }}
                    />
                    <h3>Debates</h3>
                  </div>
                  <div className="checkBX">
                    <input
                      type="checkbox"
                      defaultChecked={searchType === 1 || searchType === 2}
                      onChange={() => {
                        changeSearchType(
                          searchType === 1
                            ? -1
                            : searchType === 2
                            ? 0
                            : searchType === -1
                            ? 1
                            : 2
                        );
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
              if (list.length === 0) {
                return;
              }
              toggleType((viewType + 1) % 2);
            }}
          />
        </div>
      </div>
      {list.length !== 0 ? (
        <div className="deb_search">
          <input
            type="text"
            placeholder={
              searchType === 0
                ? "Search for debates"
                : searchType === 1
                ? "Search for debates by users"
                : searchType === 2
                ? "Search all the combinations"
                : ""
            }
            value={search}
            disabled={searchType === -1}
            onChange={(e) => {
              updateSearch(e.target.value);
            }}
          />
        </div>
      ) : null}
      {list.length !== 0 ? (
        <div className="deb_container">
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
                          <h3>
                            {new Date(item.publishedat).toLocaleDateString()}
                          </h3>
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
                      {item.topic.slice(
                        0,
                        Math.min(50, item.topic.length - 1)
                      ) + (item.topic.length <= 50 ? "" : "...")}
                    </h1>
                    <h3>{"by " + item.publisher}</h3>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="deb_empty">
          <h1>
            No Ongoing Debates, create your own{" "}
            <span onClick={() => (window.location.href = "/new")}>here</span>.
          </h1>
        </div>
      )}
    </div>
  );
};

export default OngoingDebs;
