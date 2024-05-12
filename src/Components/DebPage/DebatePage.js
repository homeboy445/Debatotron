import React, { useState, useEffect, useContext } from "react";
import "./Debpage.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "../../Contexts/AuthContext";
import Users from "../../Images/users.svg";
import Statement from "../../Images/script.svg";
import Alert from "../../Images/alert.svg";
import Arrow from "../../Images/pointer.svg";
import Heart from "../../Images/heart.svg";
import HeartFill from "../../Images/filled_heart.svg";
import Conversation from "../../Images/conversation.jpg";
import Comment from "../../Images/comment.svg";
import JoinDebate from "./JoinDebate";
import DebDescription from "./DebDescription";
import Participants from "./Participants";
import ReportUser from "./ReportUser";
import Robot from "../../Assets/Robot.png";

const DebatePage = (props) => {
  const debateId = props.match.params.id;
  const Main = useContext(AuthContext);
  const [comments, set_comments] = useState([]);
  const [IsReply, toggleIsReply] = useState({
    is: false,
    index: 0,
    user: "xyz",
    likes: 0,
    commentid: "sicnsvc",
  });
  const [debateInfo, updateDebInfo] = useState({
    topic: "How to be awesome?",
    overview: "Just follow your instincts and be yourself.",
    publisher: "xyz",
    publishedat: new Date().toDateString(),
  });
  const [replyText, set_ReplText] = useState("");
  const [liked, set_likedQs] = useState([]);
  const [fetchStatus, updateStatus] = useState(false);
  const [isParticipant, updateParticipation] = useState(false);
  const [userStatus, updateUserStatus] = useState({});
  const [activeWindow, updateActiveWindow] = useState(null);
  const [participants, updateParticipants] = useState({ true: [], false: [] });
  const [participantsData, updateParticipantData] = useState([
    { userid: -1, username: "xyz" },
  ]);
  const [userImageObj, updateUserImageObject] = useState({});

  const getDateAndTime = (date) => {
    let tdy = new Date();
    let diffdys = tdy - date;
    diffdys = Math.floor(diffdys * 1.15741e-8);
    let d_str =
      diffdys === 0
        ? " Today"
        : diffdys === 1
        ? "Yesterday"
        : " " + date.toDateString();
    d_str = date.toTimeString().slice(0, 5) + d_str;
    return <h2 className="card_time">{d_str}</h2>;
  };

  const isLiked = (commentid) => {
    return liked.some(item => item === commentid);
  };

  const updateLike = (commentid, value) => {
    axios
      .post(
        `${Main.serverURL}/UpdateLike`,
        {
          debId: debateId,
          userId: Main.userInfo[0].id,
          commentId: commentid,
          value: value,
        },
        Main.getAuthHeader()
      )
      .catch((err) => {
        if (err.response.status === 401) {
          Main.refresh();
        }
        Main.toggleDisplayBox("Failed to record the like!");
      });
  };

  const likeComment = (commentid, increment = 1) => {
    const updateCommentLikes = (commentArray, targetCommentId) => {
      return commentArray.map(comment => {
        if (comment.commentid === targetCommentId) {
          comment.likes = Math.max(0, comment.likes + increment);
          setTimeout(() => updateLike(comment.commentid, comment.likes), 500);
        } else if (comment.replies) {
          comment.replies = updateCommentLikes(comment.replies, targetCommentId);
        }
        return comment;
      });
    };

    const updatedComments = updateCommentLikes(comments, commentid);
    set_comments(updatedComments);
  };

  const isReplied = (id) => {
    let result = comments.find((item) => item.commentid === id);
    if (result === undefined) {
      return <p></p>;
    } else {
      if (result.byuser === Main.userInfo[0].name) {
        return <p>(replied to the previous comment.)</p>;
      }
      return <p>{`(replied to ${result.byuser})`}</p>;
    }
  };

  const Comments = ({ item, index, level }) => {
    if (typeof item === undefined) {
      return null;
    }
    const image = Robot;
    const body = (
      <div
        className="Dp_comments"
        style={{
          opacity: activeWindow === null ? 1 : 0.6,
          pointerEvents: activeWindow === null ? "all" : "none",
        }}
      >
        <div key={index}>
          <div className="card" key={index} style={{ marginLeft: `${level}%` }}>
            <div className="card_usrInfo">
              <div className="card_pf">
                <img src={image} alt="" />
                <h1
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    (window.location.href = `/Profile/${item.byuser}`)
                  }
                >
                  {item.byuser || "User13345"}
                </h1>
              </div>
              <p
                style={{
                  width: "20px",
                  height: "20px",
                  background:
                    debateInfo.publisher === item.byuser
                      ? "#FFD700"
                      : userStatus[item.byuser] === true
                      ? "#405cf5"
                      : "#e62e36",
                  borderRadius: "100px",
                }}
              ></p>
            </div>
            <div className="card_main">{item.comment}</div>
            <div className="card_main_1">
              <div style={{ display: "flex" }}>
                {getDateAndTime(new Date(item.madeon))}
              </div>
              <div className="card_lst">
                <div
                  className="lks"
                  onClick={() => {
                    let arr = [...liked]; // Create a copy of liked array for immutability
                    if (isLiked(item.commentid)) {
                      // Remove the commentid if it's already liked
                      const indexToRemove = arr.indexOf(item.commentid);
                      if (indexToRemove !== -1) {
                        arr.splice(indexToRemove, 1);
                      }
                      likeComment(item.commentid, -1);
                    } else {
                      // Add the commentid if it's not liked yet
                      arr.push(item.commentid);
                      likeComment(item.commentid, 1);
                    }
                    set_likedQs(arr); // Update the state with the new array
                  }}
                >
                  {isLiked(item.commentid) ? (
                    <img src={HeartFill} alt="Likes" className="likes1" />
                  ) : (
                    <img src={Heart} alt="Likes" />
                  )}
                  <p>{item.likes}</p>
                </div>
                <p
                  onClick={() => {
                    toggleIsReply({
                      is: true,
                      index: index,
                      user: item.byuser,
                      commentid: item.commentid,
                    });
                  }}
                >
                  Reply
                </p>
              </div>
            </div>
          </div>
        </div>
        {(item.replies || []).map((item1, index1) => {
          return <Comments item={item1} index={index1} level={level + 2} />;
        })}
      </div>
    );
    return body;
  };

  const storeComment = (obj) => {
    axios
      .post(
        `${Main.serverURL}/makeComment`,
        {
          comment: obj.comment,
          commentId: obj.commentid,
          user: obj.byuser,
          userId: obj.userId,
          debateId: debateId,
          date: obj.madeon,
          parentId: obj.parent,
        },
        Main.getAuthHeader()
      )
      .then((response) => {
        return;
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Main.refresh();
        }
        Main.toggleDisplayBox("Failed to make comment!");
      });
  };

  const findParentComment = (comments_, parent) => {
    //Recursively traverse the comments and find out the parent comment
    // And append the results there...
    if (comments_.commentid === IsReply.commentid) {
      comments_.replies.push({
        byuser: Main.userInfo[0].name,
        likes: 0,
        comment: replyText.trim(),
        commentid: uuidv4(),
        replies: [],
        madeon: new Date().toISOString(),
        userId: Main.userInfo[0].id,
        parent: parent,
      });
      setTimeout(() => {
        let n = comments_.replies.length - 1;
        storeComment(comments_.replies[n]);
      }, 2000);
      return { data: comments_, is: true };
    }
    if (comments_.replies.length === 0) {
      return { data: comments_, is: false };
    }
    let ans;
    for (var i = 0; i < comments_.replies.length; i++) {
      ans = findParentComment(
        comments_.replies[i],
        comments_.replies[i].commentid
      );
      if (ans.is) {
        comments_.replies[i] = ans.data;
        return { data: comments_, is: true };
      }
    }
    return ans;
  };

  const MakeReply = () => {
    if (replyText.trim() === "") {
      return;
    }
    if (IsReply.index === -1) {
      return makeComment();
    }
    const found = comments.reduce((acc, item) => {
      if (acc.is) return acc;
      const result = findParentComment(item, item.commentid);
      return result.is ? result : acc;
    }, { is: false });

    if (!found.is) {
      return;
    }
    const updatedComments = [...comments];
    updatedComments[IsReply.index] = found.data;
    set_comments(updatedComments);
    set_ReplText("");
    return toggleIsReply({
      is: false,
      byuser: "xyz",
      commentid: "mcwinc",
      index: 0,
    });
  };

  const makeComment = () => {
    const newComment = {
      comment: replyText.trim(),
      commentid: uuidv4(),
      madeon: new Date().toISOString(),
      likes: 0,
      byuser: Main.userInfo[0].name,
      replies: [],
      userId: Main.userInfo[0].id,
      parent: "none",
    };
    const updatedComments = [...comments, newComment];
    set_comments(updatedComments);
    set_ReplText("");
    toggleIsReply({
      is: false,
      user: "xyz",
      commentid: "mcwinc",
      index: 0,
    });
    return storeComment(newComment);
  };

  const hashUserStatus = (data) => {
    let user = {},
      partp = {},
      imageObj = {};
    updateParticipantData(data);
    data.map((item) => {
      imageObj[item.userid] = item.image;
      try {
        partp[item.withdeb].push({ name: item.username, image: item.image });
      } catch {
        partp[item.withdeb] = [{ name: item.username, image: item.image }];
      }
      return (user[item.username] = item.withdeb);
    });
    imageObj[Main.userInfo[0].id] = Main.userInfo[0].image;
    updateParticipants(partp);
    updateUserImageObject(imageObj);
    return updateUserStatus(user);
  };

  const refreshComments = () => {
    setTimeout(() => {
      axios
        .get(`${Main.serverURL}/getComments/${debateId}`, Main.getAuthHeader())
        .then((response) => {
          set_comments(response.data);
          refreshComments();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            Main.refresh();
          }
        });
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchStatus && Main.userInfo[0].id !== -1) {
        try {
          Main.toggleLoader(true);
          updateStatus(true);

          const debDataResponse = await axios.get(`${Main.serverURL}/getdebdata/${debateId}`, Main.getAuthHeader());
          if (!debDataResponse.data) {
            window.location.href = "/";
            return;
          }
          updateDebInfo(debDataResponse.data[0]);

          const participationResponse = await axios.get(`${Main.serverURL}/getParticipation/${debateId}`, Main.getAuthHeader());
          participationResponse.data.forEach(item => {
            if (item.username === Main.userInfo[0].name) {
              updateParticipation(true);
            }
          });
          hashUserStatus(participationResponse.data);

          const commentsResponse = await axios.get(`${Main.serverURL}/getComments/${debateId}`, Main.getAuthHeader());
          set_comments(commentsResponse.data);
          refreshComments();
          updateStatus(true);

          const likesResponse = await axios.get(`${Main.serverURL}/getLikes/${debateId}/${Main.userInfo[0].id}`, Main.getAuthHeader());
          const likedComments = likesResponse.data.map(item => item.commentid);
          console.log("##$$ ", likesResponse);
          set_likedQs(likedComments);

          if (isParticipant) {
            const tutorialResponse = await axios.get(`${Main.serverURL}/tutorial/${Main.userInfo[0].name}`, Main.getAuthHeader());
            if (tutorialResponse.data[0].debatepage) {
              Main.updateTutorialBox({
                title: "Get started with debating...",
                contents: [
                  "Make a comment & start the conversation by clicking on the reply icon on the bottom right.",
                  "You can like any comment and can also report any user easily if they misbehave.",
                  "To mention a user, just do @username and the user will be alerted.",
                                   "You can reply to any user by clicking on the reply button in the comment card.",
                  "You can also click any user's name to check their profile out.",
                ],
                status: true,
                tutorial_status: {
                  ...tutorialResponse.data[0],
                },
              });
            }
          }
          Main.toggleLoader(false);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            Main.refresh();
            updateStatus(false);
          }
          updateParticipation(null);
          Main.toggleDisplayBox("Error! failed to fetch resources!");
        }
      }
    };

    fetchData();
  }, [comments, IsReply, liked, Main, debateInfo]);

  return isParticipant === false ? (
    <JoinDebate
      title={debateInfo.topic}
      description={debateInfo.overview}
      name={debateInfo.publisher}
      publishedAt={debateInfo.publishedat}
      debateId={debateId}
      userInfo={Main.userInfo[0]}
      updateParticipation={(v) => updateParticipation(v)}
    />
  ) : (
    <div className="DebPage">
      <div
        className="Dp_catlg"
        style={{
          opacity: activeWindow === null ? 1 : 0.6,
          pointerEvents: activeWindow === null ? "all" : "none",
        }}
      >
        <div className="Dp_ctg_stm">
          <img
            src={Statement}
            alt="statement"
            onClick={() => {
              updateActiveWindow(1);
            }}
          />
        </div>
        <div className="Dp_ctg_usr">
          <img
            src={Users}
            alt="Participants"
            onClick={() => {
              updateActiveWindow(2);
            }}
          />
        </div>
        <div
          className="Dp_ctg_alt"
          onClick={() => {
            updateActiveWindow(3);
          }}
        >
          <img src={Alert} alt="Report" />
        </div>
        <div className="Dp_ctg_arw">
          <img
            src={Arrow}
            alt="Homepage"
            onClick={() => (window.location.href = "/OngoingDebs")}
          />
        </div>
      </div>
      {activeWindow !== null ? (
        activeWindow === 1 ? (
          <DebDescription
            title={debateInfo.topic}
            description={debateInfo.overview}
            toggleBox={() => updateActiveWindow(null)}
          />
        ) : activeWindow === 2 ? (
          <Participants
            owner={debateInfo.publisher === Main.userInfo[0].name}
            status={userStatus[Main.userInfo[0].name]}
            participants={participants}
            debateId={debateId}
            name={Main.userInfo[0].name}
            userId={Main.userInfo[0].id}
            toggleBox={() => updateActiveWindow(null)}
          />
        ) : activeWindow === 3 ? (
          <ReportUser
            debateId={debateId}
            owner={debateInfo.publisher}
            userList={participantsData}
            user={Main.userInfo[0]}
            toggleBox={() => updateActiveWindow(null)}
          />
        ) : null
      ) : null}
      {comments.length !== 0 ? (
        comments.map((item, index) => {
          return <Comments item={item} index={index} level={3} />;
        })
      ) : (
        <div
          className="emp_conv"
          style={{
            opacity: activeWindow === null ? 1 : 0.6,
            pointerEvents: activeWindow === null ? "all" : "none",
          }}
        >
          <img src={Conversation} alt="" />
          <h2>
            Be the first to start the{" "}
            <span
              onClick={() => {
                toggleIsReply({
                  is: true,
                  index: -1,
                });
              }}
            >
              conversation
            </span>
            .
          </h2>
        </div>
      )}
      <div
        className="Dp_textBx"
        style={{
          position: "fixed",
          top: "35%",
          left: IsReply.is === true ? "40%" : "110%",
        }}
      >
        <textarea
          placeholder={`${
            IsReply.index === -1
              ? "Make a new comment"
              : `Reply to ${IsReply.user}`
          }`}
          value={replyText}
          onChange={(e) => {
            set_ReplText(e.target.value);
          }}
        ></textarea>
        <div className="repl_btns">
          <button onClick={MakeReply}>Reply</button>
          <button
            onClick={() =>
              toggleIsReply({
                is: false,
                index: 0,
                user: "XYZ",
                likes: 0,
                commentid: "sicms",
              })
            }
          >
            Cancel
          </button>
        </div>
      </div>
      <div
        className="comment"
        style={{
          opacity: IsReply.is === true ? 0 : 1,
          pointerEvents: IsReply.is === true ? "none" : "all",
        }}
      >
        <img
          src={Comment}
          alt="Comment"
          onClick={() => {
            toggleIsReply({
              is: true,
              index: -1,
            });
          }}
        />
      </div>
    </div>
  );
};

export default DebatePage;
