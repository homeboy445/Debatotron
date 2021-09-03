import React, { useState, useEffect, useRef } from "react";
import Deb_header from "../../Images/debate_hdr.jpg";
import Tilt from "react-tilt";
import "./Debs.css";
import { Link } from "react-scroll";
import SettingsIcon from "../../Assets/settings.svg";
import DeleteButton from "../../Assets/delete.svg";

const OngoingDebs = () => {
  const [disable, toggle_disable] = useState(true);
  const [list, listUpdate] = useState([
    { debid: 123, topic: "Debates will appear here!", imglink: "default" },
  ]);
  const [PageNumber, ChangeNumber] = useState(1);
  const [Archive, UpdateArchive] = useState([]);
  const [Categories, UpdateCatg] = useState([]);
  const [FilApplied, ToggleFil] = useState(false);
  const [Participants, UpdateParticipants] = useState({});
  const [Likes, UpdateLikes] = useState({});
  const [Settings, ToggleSettings] = useState(false);
  const [DebDisplay, ChangeDisplay] = useState(1);
  const Select = useRef(null);

  const HandleRequest = (debid) => {
    window.location.href = `/DebPage/${debid}`;
  };

  const HandlePageChange = (flag) => {
    var count = PageNumber + flag;
    listUpdate(Archive[count - 1]);
    ChangeNumber(count);
  };

  const HandleResponse = (data) => {
    var tempArr = [],
      AntTemp = [],
      CatTemp = [];
    GetParticipants(data);
    GetLikes(data);
    data.map((item) => {
      tempArr.push(item);
      CatTemp.push(item.category);
      if (tempArr.length >= 10) {
        AntTemp.push(tempArr);
        tempArr = [];
      }
      return null;
    });
    if (data.length % 10 !== 0) {
      AntTemp.push(tempArr);
    }
    UpdateArchive(AntTemp);
    listUpdate(AntTemp[PageNumber - 1]);
    UpdateCatg(CatTemp);
  };

  const GetParticipants = (data) => {
    var obj = {};
    data.map((item) => {
      fetch(`http://localhost:3005/GetParticipants/${item.debid}`)
        .then((response) => response.json())
        .then((response) => {
          if (!response) {
            return;
          }
          obj[item.debid] = parseInt(response[0].count);
        })
        .catch((err) => {
          obj[item.debid] = 0;
        });
      return null;
    });
    return UpdateParticipants(obj);
  };

  const GetLikes = (data) => {
    var obj = {};
    data.map((item) => {
      fetch(`http://localhost:3005/getlikes/${item.debid}`)
        .then((response) => response.json())
        .then((response) => {
          obj[item.debid] = parseInt(response[0].count);
        })
        .catch((err) => {
          obj[item.debid] = 0;
        });
      return null;
    });
    return UpdateLikes(obj);
  };

  const FilterAccordingly = () => {
    var Catgry = Select.current.value;
    ToggleFil(true);
    var catg = [];
    Archive.map((item) => {
      item.map((it) => {
        if (it.category === Catgry) {
          catg.push(it);
        }
        return null;
      });
      return null;
    });
    return listUpdate(catg);
  };

  const ClearFilter = () => {
    var arr = [];
    Archive.map((item) => item.map((it) => arr.push(it)));
    HandleResponse(arr);
    return ToggleFil(!FilApplied);
  };

  useEffect(() => {
    setInterval(() => {
      toggle_disable(false);
    }, 1000);
    fetch(
      `http://localhost:3005/GetDebs/${DebDisplay === 1 ? "public" : "private"}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.length > 0) {
          HandleResponse(response);
        } else {
          listUpdate([
            {
              debid: 123,
              topic: "Debates will appear here!",
              imglink: "default",
            },
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [DebDisplay]);

  return (
    <div className="debates-page">
      <img
        className="SettingsIcon"
        src={SettingsIcon}
        alt="Settings"
        onClick={() => ToggleSettings(true)}
      />
      <div
        className="settings"
        style={{
          visibility: Settings ? "visible" : "hidden",
          pointerEvents: Settings ? "all" : "none",
          transition: "0.4s ease",
        }}
      >
        <img src={DeleteButton} alt="X" onClick={() => ToggleSettings(false)} />
        <h2>Filter your debates!</h2>
        <div>
          <h3>Choose Category:</h3>
          <select ref={Select}>
            {Categories.length > 0 ? (
              Categories.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })
            ) : (
              <option>None</option>
            )}
          </select>
          <button onClick={FilterAccordingly}>Apply</button>
          {FilApplied ? <button onClick={ClearFilter}>Clear</button> : null}
        </div>
      </div>
      <h1
        className="main-header"
        style={{
          pointerEvents: Settings ? "none" : "all",
          opacity: Settings ? 0.5 : 1,
        }}
      >
        Live Debates
      </h1>
      <div
        className="deb-choice"
        style={{
          pointerEvents: Settings ? "none" : "all",
          opacity: Settings ? 0.5 : 1,
        }}
      >
        <h1
          style={{
            background: DebDisplay === 1 ? "green" : "transparent",
            color: DebDisplay === 1 ? "yellow" : "black",
          }}
          onClick={() => ChangeDisplay(1)}
        >
          Public
        </h1>
        <h1
          style={{
            background: DebDisplay === 0 ? "green" : "transparent",
            color: DebDisplay === 0 ? "yellow" : "black",
          }}
          onClick={() => ChangeDisplay(0)}
        >
          Restricted
        </h1>
      </div>
      <div
        className="DebGrid"
        style={{
          pointerEvents: disable || Settings ? "none" : "all",
          opacity: Settings ? 0.5 : 1,
        }}
      >
        {list.length > 0 ? (
          list.map((item) => {
            return (
              <Tilt
                className="Tilt"
                option={{ max: 25 }}
                style={{ height: 400, width: 400 }}
              >
                <div
                  className="deb_box"
                  onClick={() => HandleRequest(item.debid)}
                >
                  <img className="deb_hdr" alt="" src={Deb_header} />
                  <p className="debs">{item.topic}</p>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p style={{ marginRight: "1%" }}>
                      Participants:{Participants[item.debid]}
                    </p>
                    <p>Likes:{Likes[item.debid]}</p>
                  </div>
                  {/* <div className="Overlay">
                                <h1 className="Overlay_item">{item.topic}</h1>
                            </div> */}
                </div>
              </Tilt>
            );
          })
        ) : (
          <div className="no_deb">
            <h2>No Ongoing Debates at the moment!</h2>
            <p>
              Create one! <a href="/new">Here</a>
            </p>
          </div>
        )}
      </div>
      {list.length > 0 ? (
        <div
          style={{
            display: "flex",
            margin: "3%",
            marginLeft: "50%",
            marginBlock: "5%",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="main-header" smooth={true}>
            <button
              disabled={PageNumber !== 1 ? false : true}
              onClick={() => HandlePageChange(-1)}
            >
              Prev
            </button>
          </Link>
          <h1>Page:{PageNumber}</h1>
          <Link to="main-header" smooth={true}>
            <button
              disabled={Archive.length === PageNumber ? true : false}
              onClick={() => HandlePageChange(1)}
            >
              Next
            </button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default OngoingDebs;
