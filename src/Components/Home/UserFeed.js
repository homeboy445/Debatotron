import React, { useState, useEffect, useContext, useRef } from "react";
import "./UserFeed.css";
import axios from "axios";
import Empty from "../../Images/empty.jpg";
import Tick from "../../Images/tick.svg";
import AddEmoji from "../../Images/plus.png";
import AuthContext from "../../Contexts/AuthContext";
import Robot from "../../Assets/Robot.png";
import { CONTENT_TYPE } from "../enums/enums";
import { throttle } from "../../Utility/utils";

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
  const scrollRef = useRef(null);

  const LikePost = (index, typeoflike) => {
    let currentFeed = [...feed]; // Destructing the feed array, so as trigger the re-render!
    let currentLastLiked = [...lastLiked]; // Destructing the lastLiked array

    if (currentLastLiked[index] === typeoflike) {
      // Exit here since this is a duplicate like!
      return;
    }

    if (currentLastLiked[index] !== null) {
      // Removing the previous like!
      currentFeed[index].likes[currentLastLiked[index]]--;
    }

    currentFeed[index].likes = currentFeed[index].likes || {};
    currentFeed[index].likes[typeoflike] = 1;
    currentLastLiked[index] = typeoflike;

    updateLastLiked(currentLastLiked);
    updateFeed(currentFeed);
    updateActiveEIndex(-1);
    updateCounter((prevCounter) => (prevCounter + 1) % 2);

    const postOrDebateId = currentFeed[index].type === CONTENT_TYPE.DEBATE ? currentFeed[index].debate.id : currentFeed[index].post.id;
    const postOrDebateType = currentFeed[index].type === CONTENT_TYPE.DEBATE ? "debate" : "post";

    axios.post(
      `${Main.serverURL}/likepost`,
      {
        id: postOrDebateId,
        userid: Main.userInfo[0].id,
        type: postOrDebateType,
        typeoflike: typeoflike,
        data: currentFeed[index].likes,
      },
      Main.getAuthHeader()
    ).then((response) => {
      // Handle success if needed
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        Main.refresh();
      }
      Main.toggleDisplayBox("Failed to record the like!");
      updateFeed(feed); // Revert to original feed state
    });
  };

  const isScrollAtBottom = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight - 100;
  
    return scrollTop + windowHeight >= fullHeight;
  };

  let scrolledToBottom = false;
  const handleScroll = () => {
    console.log("scrolled!");
    if (isScrollAtBottom() && scrollRef.current && !scrolledToBottom) {
      console.log("# scrolled to bottom!");
      scrollToElementCenter(scrollRef.current);
      scrolledToBottom = true;
    }
  };

  const scrollListener = (() => {
    const throttledScrollHandler = (() => {}) || throttle(handleScroll, 100);
    return {
      add: () => window.addEventListener("scroll", throttledScrollHandler),
      remove: () => window.removeEventListener("scroll", throttledScrollHandler),
    };
  })();

  function scrollToElementCenter(element) {

    if (!element) {
      console.error("Element not found");
      return;
    }
  
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top + window.pageYOffset;
    const elementLeft = elementRect.left + window.pageXOffset;
  
    const centerX = elementLeft - (window.innerWidth / 2) + (elementRect.width / 2);
    const centerY = elementTop - (window.innerHeight / 2) + (elementRect.height / 2);

    scrollListener.remove();
  
    window.scrollTo({
      top: centerY,
      left: centerX,
      behavior: 'smooth'
    });

    scrollListener.add();
  }


  useEffect(() => {
    scrollListener.add();
    return () => {
      scrollListener.remove();
    };
  }, []);

  useEffect(() => {
      if (!fetchStatus && Main.userInfo[0].id !== -1) {
        updateStatus(true);
        Main.toggleLoader(true);

        const fetchUserFeed = async () => {
          try {
            const feedResponse = await axios.get(`${Main.serverURL}/feed/${Main.userInfo[0].id}`, Main.getAuthHeader());
            const initialLastLiked = [];
            const feedData = feedResponse.data.map((item) => {
              try {
                item.likes = JSON.parse(item.likes);
              } catch (e) {
                // Handle potential errors in parsing
              }
              initialLastLiked.push(null);
              return item;
            });
            console.log(">> ", feedData);
            updateLastLiked(initialLastLiked);
            updateFeed(feedData);

            const popularUsersResponse = await axios.get(`${Main.serverURL}/popularUsers`, Main.getAuthHeader());
            updatePopularUsers(popularUsersResponse.data);

            const topContributorsResponse = await axios.get(`${Main.serverURL}/topContributors`, Main.getAuthHeader());
            updateContributors(topContributorsResponse.data);

            const feedLikesResponse = await axios.get(`${Main.serverURL}/getfeedlikes/${Main.userInfo[0].id}`, Main.getAuthHeader());
            const feedLikes = feedLikesResponse.data;
            const likesMap = {};
            feedLikes.forEach((item) => {
              likesMap[item.id] = item.typeoflike;
            });

            const updatedLastLiked = initialLastLiked;
            feedResponse.data.forEach((item, index) => {
              if (item.type === 0 && likesMap[item.debate.id]) {
                updatedLastLiked[index] = likesMap[item.debate.id];
              } else if (item.type === 1 && likesMap[item.post.id]) {
                updatedLastLiked[index] = likesMap[item.post.id];
              }
            });
            updateLastLiked(updatedLastLiked);
          } catch (err) {
            Main.toggleDisplayBox("Some error has occurred!");
            if (err.response && err.response.status === 401) {
              Main.refresh();
            }
            updateStatus(false);
          } finally {
            Main.toggleLoader(false);
          }
        };

        fetchUserFeed();
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
                  Main.serverURL + "/makePost",
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
                })
                .catch((err) => {
                  Main.refresh();
                })
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
              const image = Robot;
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
              const image = Robot;
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
                        🙌: {item?.likes?.handsup || 0}
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
                        😍: {item?.likes?.love || 0}
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
                        😂: {item?.likes?.laugh || 0}
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
                        🥱: {item?.likes?.sleepy || 0}
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
                        👍: {item?.likes?.like || 0}
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
            ref={scrollRef}
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
