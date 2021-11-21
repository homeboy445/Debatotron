import React, { useState, useEffect, useContext } from "react";
import "./UserFeed.css";
import axios from "axios";
import Empty from "../../Images/empty.jpg";
import Tick from "../../Images/tick.svg";
import AuthContext from "../../Contexts/AuthContext";

const UserFeed = () => {
  const Main = useContext(AuthContext);
  const [postBox, togglepostBox] = useState(false);
  const [textArea, updateTextArea] = useState("");
  const [popularUsers, updatePopularUsers] = useState([]);
  const [feed, updateFeed] = useState([]);
  const [topContributors, updateContributors] = useState([]);
  const [fetchStatus, updateStatus] = useState(false);

  useEffect(() => {
    if (!fetchStatus && Main.userInfo[0].id !== -1) {
      updateStatus(true);
      Main.toggleLoader(true);
      axios
        .get(`${Main.uri}/feed/${Main.userInfo[0].id}`, Main.getAuthHeader())
        .then((response) => {
          updateFeed(response.data);
          axios
            .get(Main.uri + "/popularUsers", Main.getAuthHeader())
            .then((response) => {
              updatePopularUsers(response.data);
              axios
                .get(Main.uri + "/topContributors", Main.getAuthHeader())
                .then((response) => {
                  updateContributors(response.data);
                  Main.toggleLoader(false);
                });
            });
        })
        .catch((err) => {
          Main.toggleDisplayBox("Failed connecting...");
          try {
            if (err.response.status === 401) {
              Main.refresh();
              updateStatus(false);
            }
          } catch (e) {}
        });
    }
  }, [feed, popularUsers, topContributors, Main]);

  return (
    <div className="feed">
      <h1
        className="home_title"
        style={{
          opacity: postBox ? 0.5 : 1,
          pointerEvents: postBox ? "none" : "all",
        }}
      >
        Debatotron
      </h1>
      <div className="feed_btns">
        <button
          className="feed_post_btn"
          style={{
            opacity: postBox ? 0.5 : 1,
            pointerEvents: postBox ? "none" : "all",
          }}
          onClick={() => togglepostBox(true)}
        >
          New Post +
        </button>
        <button
          className="feed_post_btn1"
          onClick={() => {
            Main.update_uuid();
            window.location.href = "/new";
          }}
        >
          New Debate ✔
        </button>
      </div>
      <div
        className="feed_post"
        style={{
          opacity: !postBox ? 0 : 1,
          pointerEvents: !postBox ? "none" : "all",
          transform: !postBox ? "scale(0.4)" : "scale(1)",
        }}
      >
        <h1>What's on your mind?</h1>
        <textarea
          disabled={!postBox}
          value={textArea}
          onChange={(e) => {
            updateTextArea(e.target.value);
          }}
        ></textarea>
        <div>
          <button
            onClick={() => {
              if (textArea.trim() === "") {
                return;
              }
              axios
                .post(
                  Main.uri + "/makePost",
                  {
                    user: Main.userInfo[0].name,
                    userId: Main.userInfo[0].id,
                    post: textArea.trim(),
                    date: new Date().toISOString(),
                  },
                  Main.getAuthHeader()
                )
                .then((response) => {
                  window.location.href = "/";
                });
            }}
          >
            Make Post
          </button>
          <button
            onClick={() => {
              togglepostBox(false);
              updateTextArea("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <div
        className="feed_flx"
        style={{
          marginTop: `${Math.min(12, (feed.length * 8) / (feed.length + 2))}%`,
          opacity: postBox ? 0.5 : 1,
          pointerEvents: postBox ? "none" : "all",
        }}
      >
        {popularUsers.length > 0 ? (
          <div className="feed_1">
            <h2>Most Popular users</h2>
            {popularUsers.map((item, index) => {
              const image = `https://avatars.dicebear.com/api/micah/${
                item.image || Math.random()
              }.svg`;
              return (
                <div key={index} className="usr_card">
                  <div className="pf_image1">
                    <img src={image} alt="" />
                  </div>
                  <h3
                    className="pf_hover"
                    onClick={() =>
                      (window.location.href = `/Profile/${item.name}`)
                    }
                  >
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : null}
        <div className="feed_main">
          {feed.length > 0 ? (
            (feed || []).map((item, index) => {
              const image = `https://avatars.dicebear.com/api/micah/${
                item.image || Math.random()
              }.svg`;
              return (
                <div key={index} className="feed_card">
                  <div className="feed_x1">
                    <div className="usr_card1">
                      <div className="pf_image_fd">
                        <img src={image} alt="" />
                      </div>
                      <h3
                        className="pf_hover"
                        onClick={() =>
                          (window.location.href = `/Profile/${item.user}`)
                        }
                      >
                        {item.user}
                      </h3>
                    </div>
                    <h2>
                      {new Date(item.publishedAt).toTimeString().slice(0, 5) +
                        " | " +
                        new Date(item.publishedAt).toDateString()}
                    </h2>
                  </div>
                  {item.type === 0 ? (
                    <h2>
                      Hey guys! Here's my new debate titled
                      <a href={`/DebPage/${item.debate.id}`}>
                        "{item.debate.title}"
                      </a>
                      It's gonna be fun! See you there. Happy debating!
                    </h2>
                  ) : (
                    <h2>{item.post.text}</h2>
                  )}
                </div>
              );
            })
          ) : (
            <div className="feed_empty">
              <img src={Empty} alt="" />
              <h2>Your Feed's Empty, Try debating more!</h2>
            </div>
          )}
          <div
            className="feed_end"
            style={{
              transform: `scale(${Math.min(
                1,
                (feed.length * 2) / (feed.length + 4)
              )})`,
              opacity: feed.length === 0 ? 0 : 1,
            }}
          >
            <div>
              <div className="feed_bar1"></div>
              <img src={Tick} alt="" />
              <div className="feed_bar2"></div>
            </div>
            <h1>That was all for now, Have a good day!</h1>
            <h2>And, Keep debating!</h2>
          </div>
        </div>
        {topContributors.length > 0 ? (
          <div className="feed_2">
            <h2>Top Debators</h2>
            {topContributors.map((item, index) => {
              const image = `https://avatars.dicebear.com/api/micah/${
                item.image || Math.random()
              }.svg`;
              return (
                <div key={index} className="usr_card2">
                  <h1>{index + 1}.</h1>
                  <div className="pf_image">
                    <img src={image} alt="" />
                  </div>
                  <h3
                    className="pf_hover"
                    onClick={() =>
                      (window.location.href = `/Profile/${item.name}`)
                    }
                  >
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserFeed;
