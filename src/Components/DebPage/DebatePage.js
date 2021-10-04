import React, { useState, useEffect } from "react";
import "./Debpage.css";

const DebatePage = (props) => {
  const [comments, set_comments] = useState([
    {
      user: "Aldrich",
      likes: 0,
      comment:
        "After the postoperative check at the rear of the arcade showed him broken lengths of damp chipboard and the dripping chassis of a gutted game console. Now this quiet courtyard, Sunday afternoon, this girl with a hand on his chest. Her cheekbones flaring scarlet as Wizard’s Castle burned, forehead drenched with azure when Munich fell to the Tank War, mouth touched with hot gold as a paid killer in the human system. Still it was a long strange way home over the black water and the dripping chassis of a junked console. He stared at the rear of the arcade showed him broken lengths of damp chipboard and the dripping chassis of a gutted game console. Splayed in his elastic g-web, Case watched the other passengers as he made his way down Shiga from the sushi stall he cradled it in his devotion to esoteric forms of tailor-worship. The semiotics of the car’s floor. They floated in the tunnel’s ceiling. Its hands were holograms that altered to match the convolutions of the blowers and the amplified breathing of the fighters. The alarm still oscillated, louder here, the rear wall dulling the roar of the Villa bespeak a turning in, a denial of the bright void beyond the hull.",
      commentId: "#mvsvs",
      replies: [
        {
          user: "willy",
          likes: 0,
          comment: "Hello",
          commentId: "skicmw9",
          replies: [],
        },
        {
          user: "eddie",
          likes: 0,
          comment: "Whoa... looks who's here... Me!",
          commentId: "scoimssmv",
          replies: [],
        },
        {
          user: "Killian",
          likes: 0,
          comment: "yeah! Mr. Annoyer's here🤣",
          commentId: "09sjviuwn",
          replies: [],
        },
        {
          user: "eddie",
          likes: 0,
          comment: "Come on... I don't annoy people...",
          commentId: "wc9im209c",
          replies: [],
        },
        {
          user: "willy",
          likes: 0,
          comment: "yes you do😆",
          commentId: "w9cnmc",
          replies: [],
        },
      ],
    },
    {
      user: "Killian",
      likes: 0,
      comment: "I am the best!",
      commentId: "wovcm92m",
      replies: [
        {
          user: "willy",
          likes: 0,
          comment: "In your dreams 😂",
          commentId: "29ivn2f",
          replies: [],
        },
      ],
    },
    {
      user: "Ray",
      likes: 0,
      comment: "This debate is really nice",
      commentId: "oiwmc02mc",
      replies: [
        {
          user: "willy",
          likes: 0,
          comment: "Yeah! I think so too!",
          commentId: "im92mc",
          replies: [],
        },
      ],
    },
    {
      user: "Ozy",
      likes: 0,
      comment: "Hey there!",
      commentId: "wciwmcm",
      replies: [
        {
          user: "willy",
          likes: 0,
          comment: "Hello",
          commentId: "wvwv09m",
          replies: [],
        },
      ],
    },
    {
      user: "Kate",
      likes: 0,
      comment: "Hey there!",
      commentId: "ow924m",
      replies: [
        {
          user: "willy",
          likes: 0,
          comment: "Hello",
          commentId: "29m2mv",
          replies: [],
        },
      ],
    },
    {
      user: "willy",
      likes: 0,
      comment: "You guys are dumb...🤣",
      commentId: "w9vm29vn",
      replies: [],
    },
  ]);
  const [IsReply, toggleIsReply] = useState({
    is: false,
    index: 0,
    user: "xyz",
    likes: 0,
    commentId: "sicnsvc",
  });
  const [replyText, set_ReplText] = useState("");

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
          <div className="card" key={index} style={{ marginLeft: `${level}%` }}>
            <div className="card_usrInfo">
              <div className="card_pf">
                <img src={image} alt="" />
                <h1>{item.user}</h1>
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
            <div className="card_lst">
              <p>Like</p>
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
      console.log(str);
      return "829nf2c";
    }
  };

  const findParentComment = (comments_) => {
    //Recursively traverse the comments and find out the parent comment
    // And append the results there...
    if (comments_.commentId === IsReply.commentId) {
      comments_.replies.push({
        user: "guest2859",
        likes: 0,
        comment: replyText.trim(),
        commentId: "29incskc",
        replies: [],
      });
      return { data: comments_, is: true };
    }
    if (comments_.replies.length === 0) {
      return { data: comments_, is: false };
    }
    let ans;
    for (var i = 0; i < comments_.replies.length; i++) {
      ans = findParentComment(comments_.replies[i]);
      if (ans.is) {
        comments_.replies[i] = ans.data;
        return { data: comments_, is: true };
      }
    }
    return ans;
  };

  const MakeReply = () => {
    let comment_ = findParentComment(comments[IsReply.index]);
    if (!comment_.is) {
      return;
    }
    let res = comments;
    res[IsReply.index] = comment_.data;
    console.log(res);
    set_comments(res);
    return toggleIsReply({
      is: false,
      user: "xyz",
      commentId: "mcwinc",
      index: 0,
    });
  };

  useEffect(() => {}, [comments, IsReply]);

  return (
    <div className="DebPage">
      <div className="Dp_catlg">
        <h1>Report user</h1>
      </div>
      {comments.map((item, index) => {
        return <Comments item={item} index={index} level={3} />;
      })}
      <div
        className="Dp_textBx"
        style={{
          position: "fixed",
          top: "45%",
          left: IsReply.is === true ? "40%" : "110%",
        }}
      >
        <textarea
          placeholder={`Reply to ${IsReply.user}...`}
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
