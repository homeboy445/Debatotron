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

const DebatePage = (props) => {
  const debateId = props.match.params.id;
  const Main = useContext(AuthContext);
  const [comments, set_comments] = useState([]);
  const [IsReply, toggleIsReply] = useState({
    is: false,
    index: 0,
    user: "xyz",
    likes: 0,
    commentId: "sicnsvc",
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
  const [isParticipant, updateParticipation] = useState(true);
  const [userStatus, updateUserStatus] = useState({});
  const [activeWindow, updateActiveWindow] = useState(null);
  const [participants, updateParticipants] = useState({ true: [], false: [] });
  const [participantsData, updateParticipantData] = useState([
    { userid: -1, username: "xyz" },
  ]);

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

  const isLiked = (commentId) => {
    let flag = false;
    liked.map((item) => {
      return (flag |= commentId === item);
    });
    return flag;
  };

  const updateLike = (commentId, value) => {
    axios
      .post("http://localhost:3005/UpdateLike", {
        debId: debateId,
        userId: Main.userInfo[0].id,
        commentId: commentId,
        value: value,
      })
      .then((response) => {
        return;
      });
  };

  const likeComment = (commentid, val = 1) => {
    const recursivelyLikeComment = (comAr, comId) => {
      if (comAr.commentid === comId) {
        comAr.likes += val;
        setTimeout(() => {
          updateLike(comAr.commentid, comAr.likes);
        }, 2000);
        return comAr;
      }
      comAr.replies = comAr.replies.map((item) => {
        return recursivelyLikeComment(item, comId);
      });
      return comAr;
    };

    let comm = comments;
    comm = comm.map((item) => {
      return recursivelyLikeComment(item, commentid);
    });
    return set_comments(comm);
  };

  const Comments = ({ item, index, level }) => {
    if (typeof item === undefined) {
      return null;
    }
    const image = `https://avatars.dicebear.com/api/micah/${getImageString(
      item.byuser
    )}.svg`;
    let body = (
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
                <h1>{item.byuser || "User13345"}</h1>
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
              <div>{getDateAndTime(new Date(item.madeon))}</div>
              <div className="card_lst">
                <div
                  className="lks"
                  onClick={() => {
                    if (isLiked(item.commentid)) {
                      let arr = liked;
                      arr.map((item1, index) => {
                        if (item1 === item.commentid) {
                          arr.splice(index, 1);
                        }
                        return null;
                      });
                      likeComment(item.commentid, -1);
                      return;
                    }
                    let arr = liked;
                    arr.push(item.commentid);
                    set_likedQs(arr);
                    likeComment(item.commentid);
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
                      commentId: item.commentId,
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

  const getImageString = (str) => {
    try {
      let arr = [];
      for (var i = 0; i < str.length; i++) {
        arr.push(`${str[i]}...${i / 2}`);
      }
      arr.reverse();
      return arr.join("");
    } catch {
      return Math.random().toString();
    }
  };

  const storeComment = (obj) => {
    axios
      .post("http://localhost:3005/makeComment", {
        comment: obj.comment,
        commentId: obj.commentId,
        user: obj.byuser,
        userId: obj.userId,
        debateId: debateId,
        date: obj.madeon,
        parentId: obj.parent,
      })
      .then((response) => {
        return;
      })
      .catch((err) => {});
  };

  const findParentComment = (comments_, parent) => {
    //Recursively traverse the comments and find out the parent comment
    // And append the results there...
    if (comments_.commentId === IsReply.commentId) {
      comments_.replies.push({
        byuser: Main.userInfo[0].name,
        likes: 0,
        comment: replyText.trim(),
        commentId: uuidv4(),
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
        comments_.replies[i].commentId
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
    let comment_ = findParentComment(
      comments[IsReply.index],
      comments[IsReply.index].commentid
    );
    if (!comment_.is) {
      return;
    }
    let res = comments;
    res[IsReply.index] = comment_.data;
    set_comments(res);
    set_ReplText("");
    return toggleIsReply({
      is: false,
      byuser: "xyz",
      commentId: "mcwinc",
      index: 0,
    });
  };

  const makeComment = () => {
    let comm = comments,
      arr;
    arr = {
      comment: replyText.trim(),
      commentId: uuidv4(),
      madeon: new Date().toISOString(),
      likes: 0,
      byuser: Main.userInfo[0].name,
      replies: [],
      userId: Main.userInfo[0].id,
      parent: "none",
    };
    comm.push(arr);
    set_comments(comm);
    set_ReplText("");
    toggleIsReply({
      is: false,
      user: "xyz",
      commentId: "mcwinc",
      index: 0,
    });
    return storeComment(arr);
  };

  const hashUserStatus = (data) => {
    let user = {},
      partp = {};
    updateParticipantData(data);
    data.map((item) => {
      try {
        partp[item.withdeb].push(item.username);
      } catch {
        partp[item.withdeb] = [item.username];
      }
      return (user[item.username] = item.withdeb);
    });
    updateParticipants(partp);
    return updateUserStatus(user);
  };

  const refreshComments = () => {
    setTimeout(() => {
      axios
        .get(`http://localhost:3005/getComments/${debateId}`)
        .then((response) => {
          set_comments(response.data);
          refreshComments();
        });
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    if (!fetchStatus && Main.userInfo[0].id !== -1) {
      axios
        .get(`http://localhost:3005/getdebdata/${debateId}`)
        .then((response) => {
          updateDebInfo(response.data[0]);
          axios
            .get(
              `http://localhost:3005/getParticipation/${debateId}/${Main.userInfo[0].id}`
            )
            .then((response) => {
              response.data.map((item) => {
                if (item.username === Main.userInfo[0].name) {
                  updateParticipation(true);
                }
                return null;
              });
              hashUserStatus(response.data);
              axios
                .get(`http://localhost:3005/getComments/${debateId}`)
                .then((response) => {
                  set_comments(response.data);
                  refreshComments();
                  updateStatus(true);
                  console.log(response.data);
                  axios
                    .get(
                      `http://localhost:3005/getLikes/${debateId}/${Main.userInfo[0].id}`
                    )
                    .then((response) => {
                      let s = response.data.map((item) => item.commentid);
                      set_likedQs(s);
                    });
                });
            });
        })
        .catch((err) => {
          updateParticipation(null);
        });
    }
  }, [comments, IsReply, liked, Main]);

  return isParticipant === null ? (
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
            userId={Main.userInfo[0].id}
            toggleBox={() => updateActiveWindow(null)}
          />
        ) : activeWindow === 3 ? (
          <ReportUser
            debateId={debateId}
            userList={participantsData}
            userId={Main.userInfo[0].id}
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
                commentId: "sicms",
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
