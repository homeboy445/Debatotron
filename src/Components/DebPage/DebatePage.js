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
  const [replyText, set_ReplText] = useState("");
  const [liked, set_likedQs] = useState([]);
  const [fetchStatus, updateStatus] = useState(false);

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
        console.log(response.data);
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
      item.user
    )}.svg`;
    let body = (
      <div className="Dp_comments">
        <div key={index}>
          <div
            className="card"
            key={index}
            style={{ marginLeft: `${level + index + 1}%` }}
          >
            <div className="card_usrInfo">
              <div className="card_pf">
                <img src={image} alt="" />
                <h1>{item.byuser || "User13345"}</h1>
              </div>
              <p
                style={{
                  width: "20px",
                  height: "20px",
                  background: "red",
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
                      user: item.user,
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
      return "829nf2c";
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
    if (IsReply.index === -1) {
      return makeComment();
    }
    let comment_ = findParentComment(
      comments[IsReply.index],
      comments[IsReply.index].commentId
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

  useEffect(() => {
    if (!fetchStatus && Main.userInfo[0].id !== -1) {
      axios
        .get(`http://localhost:3005/getComments/${debateId}`)
        .then(async (response) => {
          set_comments(response.data);
          updateStatus(true);
          await axios
            .get(
              `http://localhost:3005/getLikes/${debateId}/${Main.userInfo[0].id}`
            )
            .then((response) => {
              let s = response.data.map((item) => item.commentid);
              set_likedQs(s);
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  }, [comments, IsReply, liked, Main]);

  return (
    <div className="DebPage">
      <div className="Dp_catlg">
        <div className="Dp_ctg_stm">
          <img src={Statement} alt="statement" />
        </div>
        <div className="Dp_ctg_usr">
          <img src={Users} alt="Participants" />
        </div>
        <div className="Dp_ctg_alt">
          <img src={Alert} alt="Report" />
        </div>
        <div className="Dp_ctg_arw">
          <img src={Arrow} alt="Homepage" />
        </div>
      </div>
      {comments.length !== 0 ? (
        comments.map((item, index) => {
          return <Comments item={item} index={index} level={3} />;
        })
      ) : (
        <div className="emp_conv">
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
    </div>
  );
};

export default DebatePage;
