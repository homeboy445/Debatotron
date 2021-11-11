import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Save_Icon from "../../Images/save.svg";
import "./ProfilePage.css";

const ProfilePage = (props) => {
  const ref1 = useRef();
  const name = props.match.params.user;
  const [profile, update_profile] = useState({
    name: "Tom Cruise",
    joinedAt: new Date().toDateString(),
    about: "",
    image: Math.random(),
  });
  const [debates, update_debates] = useState([]);
  const [friends, update_friends] = useState([]);
  const [activity, update_activity] = useState([]);
  const [fetchStatus, update_Status] = useState(false);
  const [activeSelection, updateSelection] = useState(0);
  const [editMode, toggleEditMode] = useState(false);
  const [aboutText, updateAbout] = useState(
    "Well, what can I say I'm the best😎."
  );

  const EmptyDataComponent = () => {
    return (
      <div className="pf_empty">
        <h2>Oops! No record found!</h2>
      </div>
    );
  };

  const SaveProfileCredentials = () => {
    axios
      .post("http://localhost:3005/UpdateProfile", {
        user: name,
        about: ref1.current.textContent,
        image: profile.image.toString(),
      })
      .then((response) => {
        toggleEditMode(false);
      });
  };

  useEffect(() => {
    if (!fetchStatus) {
      axios
        .get(`http://localhost:3005/profile_Data/${name}`)
        .then((response) => {
          update_profile({
            name: response.data[0].name,
            joinedAt: response.data[0].joinedat,
            about: response.data[0].about,
            image: response.data[0].image,
          });
          update_Status(true);
          axios
            .get(`http://localhost:3005/getDebates/${response.data[0].name}`)
            .then((response1) => {
              update_debates(response1.data);
              axios
                .get(
                  `http://localhost:3005/getActivity/${response.data[0].name}`
                )
                .then((response2) => {
                  update_activity(response2.data);
                });
            });
        })
        .catch((err) => {
          return;
        });
    }
  }, [debates, profile, friends, activity]);

  const image = `https://avatars.dicebear.com/api/micah/${profile.image}.svg`;
  return (
    <div className="pf_page_main">
      <img
        src={Save_Icon}
        alt="save"
        className="pf_save"
        onClick={SaveProfileCredentials}
        style={{
          opacity: editMode ? 1 : 0,
          pointerEvents: editMode ? "all" : "none",
        }}
      />
      <div className="pf_bg" onClick={() => toggleEditMode(false)}></div>
      <div className="pf_page_1">
        <div className="pf_img">
          <img
            src={image}
            alt=".."
            onClick={() => {
              update_profile({ ...profile, image: Math.random() });
            }}
          />
        </div>
        <div className="pf_page_info">
          <h1>{profile.name || "Debatotron User"}</h1>
          <h3
            onDoubleClick={(e) => {
              toggleEditMode(true);
            }}
            contentEditable={editMode}
            value={aboutText}
            ref={ref1}
            // style={{
            //   overflow: !editMode ? "scroll" : "auto",
            //   overflowX: !editMode ? "hidden" : "auto",
            // }}
          >
            {profile.about || "Well, what can I say I'm the best😎."}
          </h3>
          <h2>Member Since {profile.joinedAt || "02/10/20"}</h2>
        </div>
      </div>
      <div className="pf_page_2" onClick={() => toggleEditMode(false)}>
        <div className="pf_select">
          <h2
            onClick={() => updateSelection(0)}
            style={{
              background: activeSelection === 0 ? "yellow" : "transparent",
            }}
          >
            Debates
          </h2>
          <h2
            onClick={() => updateSelection(1)}
            style={{
              background: activeSelection === 1 ? "yellow" : "transparent",
            }}
          >
            Friends
          </h2>
          <h2
            onClick={() => updateSelection(2)}
            style={{
              background: activeSelection === 2 ? "yellow" : "transparent",
            }}
          >
            Activity
          </h2>
        </div>
        <div className="pf_page_display">
          {activeSelection === 0 ? (
            debates.length === 0 ? (
              <EmptyDataComponent />
            ) : (
              <div className="pf_debs">
                {debates.map((item) => {
                  return (
                    <div className="pf_card">
                      <h2>
                        {name} created debate{" "}
                        <span
                          onClick={() => {
                            window.location.href = `/DebPage/${item.debid}`;
                          }}
                        >
                          {item.topic.slice(
                            0,
                            item.topic[item.topic.length - 1] === "."
                              ? item.topic.length - 1
                              : item.topic.length
                          )}
                        </span>
                        .
                      </h2>
                      <h4>On {new Date(item.publishedat).toDateString()}</h4>
                    </div>
                  );
                })}
              </div>
            )
          ) : activeSelection === 1 ? (
            friends.length === 0 ? (
              <EmptyDataComponent />
            ) : null
          ) : activeSelection === 2 ? (
            activity.length === 0 ? (
              <EmptyDataComponent />
            ) : (
              <div className="pf_activty">
                {activity.map((item) => {
                  return (
                    <div className="pf_card1">
                      {item.type === 0 ? (
                        <h2>
                          {name} commented "{item.activity}" on debate{" "}
                          <span>{item.debtitle}</span>
                        </h2>
                      ) : (
                        <h2>
                          {name} joined the debate <span>{item.debtitle}</span>
                        </h2>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
