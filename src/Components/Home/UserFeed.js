import React, { useState, useEffect, useContext } from "react";
import "./UserFeed.css";
import axios from "axios";
import Empty from "../../Images/empty.jpg";
import Tick from "../../Images/tick.svg";
import AddEmoji from "../../Images/plus.png";
import AuthContext from "../../Contexts/AuthContext";

const UserFeed = () => {
  const Main = useContext(AuthContext);
  const [postBox, togglepostBox] = useState(false);
  const [textArea, updateTextArea] = useState("");
  const [popularUsers, updatePopularUsers] = useState([]);
  const [feed, updateFeed] = useState([]);
  const [lastLiked, updateLastLiked] = useState([]);
  const [topContributors, updateContributors] = useState([]);
  const [fetchStatus, updateStatus] = useState(false);
  const [ActiveEmojiIndex, updateActiveEIndex] = useState(-1);
  const [counter, updateCounter] = useState(0);

  const LikePost = (index, typeoflike) => {
    let fd = feed,
      tmp = feed,
      lsL = lastLiked;
    if (lastLiked[index] !== null) {
      fd[index].likes[lastLiked[index]]--;
    } else if (lastLiked[index] === typeoflike) {
      return;
    }
    fd[index].likes[typeoflike]++;
    lsL[index] = typeoflike;
    updateLastLiked(lsL);
    updateFeed(fd);
    updateActiveEIndex(-1);
    updateCounter((counter+1)%2);
    axios
      .post(
        Main.uri + "/likepost",
        {
          id:
            feed[index].type === 0 ? feed[index].debate.id : fd[index].post.id,
          userid: Main.userInfo[0].id,
          type: feed[index].type === 0 ? "debate" : "post",
          typeoflike: typeoflike,
          data: fd[index].likes,
        },
        Main.getAuthHeader()
      )
      .then((response) => {})
      .catch((err) => {
        try {
          if (err.response.status === 401) {
            Main.refresh();
          }
        } catch (e) {}
        Main.toggleDisplayBox("Failed to record the like!");
        updateFeed(tmp);
      });
  };

  useEffect(() => {
    if (!fetchStatus && Main.userInfo[0].id !== -1) {
      updateStatus(true);
      Main.toggleLoader(true);
      axios
        .get(`${Main.uri}/feed/${Main.userInfo[0].id}`, Main.getAuthHeader())
        .then((response1) => {
          let lstLiked = [];
          let data = response1.data.map((item) => {
            try {
              item.likes = JSON.parse(item.likes);
            } catch (e) {}
            lastLiked.push(null);
            return item;
          });
          updateLastLiked(lstLiked);
          updateFeed(data);
          axios
            .get(Main.uri + "/popularUsers", Main.getAuthHeader())
            .then((response) => {
              updatePopularUsers(response.data);
              axios
                .get(Main.uri + "/topContributors", Main.getAuthHeader())
                .then((response) => {
                  updateContributors(response.data);
                  Main.toggleLoader(false);
                  axios
                    .get(
                      `${Main.uri}/getfeedlikes/${Main.userInfo[0].id}`,
                      Main.getAuthHeader()
                    )
                    .then((response) => {
                      response = response.data;
                      let obj = {};
                      response.map((item) => {
                        return (obj[item.id] = item.typeoflike);
                      });
                      let arr = lastLiked;
                      response1.data.map((item, index) => {
                        if (item.type === 0) {
                          if (obj[item.debate.id]) {
                            return (arr[index] = obj[item.debate.id]);
                          }
                        }
                        if (item.type === 1) {
                          if (obj[item.post.id]) {
                            return (arr[index] = obj[item.post.id]);
                          }
                        }
                        return null;
                      });
                      updateLastLiked(arr);
                    });
                });
            });
        })
        .catch((err) => {
          Main.toggleDisplayBox("Some error has occured!");
          try {
            if (err.response.status === 401) {
              Main.refresh();
              updateStatus(false);
            }
          } catch (e) {}
        });
    }
  }, [feed, popularUsers, topContributors, Main, ActiveEmojiIndex, lastLiked, counter]);

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
                  <div className="emoji">
                    <ul>
                      <li
                        onClick={() => LikePost(index, "handsup")}
                        style={{
                          border:
                            lastLiked[index] === "handsup"
                              ? "2px solid red"
                              : "2px solid black",
                          transition: "0.4s ease"
                        }}
                      >
                        🙌: {item.likes.handsup || 0}
                      </li>
                      <li
                        onClick={() => LikePost(index, "love")}
                        style={{
                          border:
                            lastLiked[index] === "love"
                              ? "2px solid red"
                              : "2px solid black",
                              transition: "0.4s ease"
                        }}
                      >
                        😍: {item.likes.love || 0}
                      </li>
                      <li
                        onClick={() => LikePost(index, "laugh")}
                        style={{
                          border:
                            lastLiked[index] === "laugh"
                              ? "2px solid red"
                              : "2px solid black",
                              transition: "0.4s ease"
                        }}
                      >
                        😂: {item.likes.laugh || 0}
                      </li>
                      <li
                        onClick={() => LikePost(index, "sleepy")}
                        style={{
                          border:
                            lastLiked[index] === "sleepy"
                              ? "2px solid red"
                              : "2px solid black",
                              transition: "0.4s ease"
                        }}
                      >
                        🥱: {item.likes.sleepy || 0}
                      </li>
                      <li
                        onClick={() => LikePost(index, "like")}
                        style={{
                          border:
                            lastLiked[index] === "like"
                              ? "2px solid red"
                              : "2px solid black",
                              transition: "0.4s ease"
                        }}
                      >
                        👍: {item.likes.like || 0}
                      </li>
                    </ul>
                    <div className="emoji_1">
                      <img
                        src={AddEmoji}
                        alt="+"
                        style={{
                          visibility: "hidden",
                          pointerEvents: "none",
                          transform:
                            ActiveEmojiIndex === index
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                        }}
                        onClick={() => {
                          if (ActiveEmojiIndex === index) {
                            return updateActiveEIndex(-1);
                          }
                          updateActiveEIndex(index);
                        }}
                      />
                      <div
                        className="emj_catg"
                        style={{
                          pointerEvents:
                            ActiveEmojiIndex === index ? "all" : "none",
                        }}
                      >
                        {/* <ul
                          style={{
                            marginTop:
                              ActiveEmojiIndex === index ? "15%" : "5%",
                            transform:
                              ActiveEmojiIndex === index
                                ? "scale(1)"
                                : "scale(0)",
                          }}
                        >
                          <li onClick={() => LikePost(index, "handsup")}>🙌</li>
                          <li onClick={() => LikePost(index, "love")}>😍</li>
                          <li onClick={() => LikePost(index, "laugh")}>😂</li>
                          <li onClick={() => LikePost(index, "sleepy")}>🥱</li>
                          <li onClick={() => LikePost(index, "like")}>👍</li>
                        </ul> */}
                      </div>
                    </div>
                  </div>
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
