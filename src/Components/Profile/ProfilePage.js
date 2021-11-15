import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Save_Icon from "../../Images/save.svg";
import "./ProfilePage.css";
import AuthContext from "./../../Contexts/AuthContext";

const ProfilePage = (props) => {
  const ref1 = useRef();
  const Main = useContext(AuthContext);
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
  const [Friends, update_FriendObject] = useState({});
  const [friendShipStatus, update_friend_status] = useState("Pending");
  const [isMessageBox, updateMessageBoxStatus] = useState({
    status: false,
    text: "",
  });

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

  const SendFriendRequest = () => {
    if (
      name !== Main.userInfo[0].name &&
      friendShipStatus === "Accept Request"
    ) {
      return axios
        .post("http://localhost:3005/AddFriend", {
          user1: name,
          user2: Main.userInfo[0].name,
        })
        .then((response) => {
          Main.friends.push({ friend_name: name, status: true, owner: false });
          updateFriendshipStatus();
        });
    }
    if (name === Main.userInfo[0].name || friendShipStatus !== "Add Friend") {
      return;
    }
    axios
      .post("http://localhost:3005/MakeFriendReq", {
        user: Main.userInfo[0].name,
        fuser: name,
        message: "Add me as a friend",
      })
      .then((response) => {
        Main.userInfo[0].friends.push({
          friend_name: name,
          status: false,
          owner: true,
        });
      })
      .catch((err) => {});
  };

  const updateFriendshipStatus = () => {
    if (name === Main.userInfo[0].name) {
      return null;
    }
    let fr = [];
    Main.friends.map((item) => {
      if (item.friend_name === name) {
        return fr.push(item);
      }
      return null;
    });
    if (fr.length === 0) {
      return update_friend_status("Add Friend");
    }
    if (fr[0].status) {
      return update_friend_status("Friend");
    }
    if (!fr[0].owner) {
      return update_friend_status("Accept Request");
    }
    return update_friend_status("Pending");
  };

  useEffect(() => {
    updateFriendshipStatus();
    if (!fetchStatus && Main.userInfo[0].id !== -1) {
      axios
        .get(`http://localhost:3005/profile_Data/${name}`)
        .then((response) => {
          update_profile({
            name: response.data[0].name,
            joinedAt: response.data[0].joinedat,
            about: response.data[0].about,
            image: response.data[0].profile_image,
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
                  axios
                  .get(`http://localhost:3005/friendslist/${name}`)
                  .then((response) => {
                    let k = [];
                    response.data.map((item) => {
                      if (item.status) {
                        k.push(item);
                      }
                      return null;
                    });
                    update_friends(k);
                  })
                  .catch((err) => {
                    return err;
                  });
                });
            });
        })
        .catch((err) => {
          return;
        });
      if (Main.friends.length > 0 && Friends === {}) {
        let obj = {};
        Main.friends.map((item) => {
          return (obj[item.friend_name] = item);
        });
        update_FriendObject(obj);
      }
    }
  }, [debates, profile, friends, activity, Main]);

  const image = `https://avatars.dicebear.com/api/micah/${profile.image}.svg`;
  return (
    <div className="pf_page_main">
      <div
        className="pf_msg_bx"
        style={{
          opacity: isMessageBox.status ? 1 : 0,
          transform: isMessageBox.status ? "scale(1)" : "scale(0.4)",
          transition: "0.5s ease",
          pointerEvents: isMessageBox.status ? "all" : "none",
        }}
      >
        <h2>Message {name}</h2>
        <textarea
          placeholder="say something nice!"
          value={isMessageBox.text}
          onChange={(e) => {
            updateMessageBoxStatus({ ...isMessageBox, text: e.target.value });
          }}
        ></textarea>
        <div className="pf_msg_bx_btn">
          <button
            onClick={() => {
              axios
                .post("http://localhost:3005/sendMessage", {
                  sender: Main.userInfo[0].name,
                  recipient: name,
                  message: isMessageBox.text,
                })
                .then((response) => {
                  updateMessageBoxStatus({ text: "", status: false });
                });
            }}
          >
            Send
          </button>
          <button
            onClick={() => {
              updateMessageBoxStatus({ text: "", status: false });
            }}
          >
            Cancel
          </button>
        </div>
      </div>
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
      <div
        className="pf_bg"
        onClick={() => toggleEditMode(false)}
        style={{
          opacity: !isMessageBox.status ? 1 : 0.6,
          pointerEvents: !isMessageBox.status ? "all" : "none",
        }}
      ></div>
      <div
        className="pf_page_1"
        style={{
          opacity: !isMessageBox.status ? 1 : 0.6,
          pointerEvents: !isMessageBox.status ? "all" : "none",
        }}
      >
        <div className="pf_img">
          <img
            src={image}
            alt=".."
            onClick={() => {
              if (name === Main.userInfo[0].name) {
                toggleEditMode(true);
                update_profile({ ...profile, image: Math.random() });
              }
            }}
          />
        </div>
        <div
          className="pf_page_info"
          style={{
            opacity: !isMessageBox.status ? 1 : 0.6,
            pointerEvents: !isMessageBox.status ? "all" : "none",
          }}
        >
          <h1>{profile.name || "Debatotron User"}</h1>
          <h3
            onDoubleClick={(e) => {
              if (name === Main.userInfo[0].name) {
                toggleEditMode(true);
              }
            }}
            contentEditable={editMode}
            ref={ref1}
          >
            {profile.about || "Well, what can I say I'm the best😎."}
          </h3>
          {name !== Main.userInfo[0].name ? (
            <div className="pf_frnd">
              <button
                onClick={SendFriendRequest}
                style={{
                  background:
                    friendShipStatus === "Pending"
                      ? "red"
                      : friendShipStatus === "Friend"
                      ? "green"
                      : "blue",
                }}
              >
                {friendShipStatus}
              </button>
              <button
                onClick={() => {
                  updateMessageBoxStatus({ ...isMessageBox, status: true });
                }}
              >
                Message {name}
              </button>
            </div>
          ) : null}
          <h2>Member Since {profile.joinedAt || "02/10/20"}</h2>
        </div>
      </div>
      <div
        className="pf_page_2"
        onClick={() => toggleEditMode(false)}
        style={{
          opacity: !isMessageBox.status ? 1 : 0.6,
          pointerEvents: !isMessageBox.status ? "all" : "none",
        }}
      >
        <div className="pf_select">
          <h2
            onClick={() => updateSelection(0)}
            style={{
              background: activeSelection === 0 ? "yellow" : "transparent",
              border: activeSelection === 0 ? "1px solid green" : "none",
            }}
          >
            Debates
          </h2>
          <h2
            onClick={() => updateSelection(1)}
            style={{
              background: activeSelection === 1 ? "yellow" : "transparent",
              border: activeSelection === 1 ? "1px solid green" : "none",
            }}
          >
            Friends
          </h2>
          <h2
            onClick={() => updateSelection(2)}
            style={{
              background: activeSelection === 2 ? "yellow" : "transparent",
              border: activeSelection === 2 ? "1px solid green" : "none",
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
            ) : (
              <div className="pf_frds">
                {friends.map((item) => {
                  const image = `https://avatars.dicebear.com/api/micah/${item.profile_image || Math.random()}.svg`;
                  return (
                    <div className="pf_fr_card" onClick={()=>window.location.href=`/Profile/${item.friend_name}`}>
                      <img src={image} alt=".." />
                      <h2>{item.friend_name}</h2>
                    </div>
                  );
                })}
              </div>
            )
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