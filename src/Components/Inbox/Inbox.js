import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";
import "./Inbox.css";

const Inbox = ({ userInfo }) => {
  const [messages, updMes] = useState([
    {
      message: "You're Messages will appear here!",
      recievedat: "",
      additional: { title: "Message Title" },
    },
  ]);
  const [NotRecieved, change_this] = useState(true);
  const [toggle, toggler] = useState(false);
  const [ActiveIndex, ChangeActiveIndex] = useState(0);
  const Auth = useContext(AuthContext);
  const HandleToggle = () => {
    toggler(!toggle);
  };

  const Delete_Data = () => {
    HandleToggle();
    fetch(`http://localhost:3005/WipeInbox/${Auth.userInfo[0].name}`)
      .then((response) => response.json())
      .then((response) => {
        window.location.href = "/Inbox";
      })
      .catch((err) => {
        return;
      });
  };

  const Htmlify = (text) => {
    return `<h2>${text}</h2>`;
  };

  const returnMessageTitle = (type) => {
    switch (type) {
      case -1:
        return "Welcome, user to the debatotron...";
      case 0:
        return "A user needs Access to one of your Debates.";
      case 1:
        return "A New Friend Request!";
      case 2:
        return "Access Granted!";
      case 3:
        return "You've gotta new friend!";
      default:
        return "Test Message";
    }
  };

  const ExecuteResponse = (data, messageid, status) => {
    const del = (messageid) => { //For deleting any message via its uuid.
      axios
        .post("http://localhost:3005/removeMessage", {
          mId: messageid,
        })
        .then((response) => {
          window.location.reload();
        })
        .catch((err) => {
          return;
        });
    };
    if (!status) {
      return del(messageid);
    }
    switch (data.rtype) {
      case 0: {
        axios
          .post("http://localhost:3005/AddParticipant", {
            debid: data.debid,
            participant: data.user,
          })
          .then((response) => {
            if (response.data) {
              del(messageid);
            }
          })
          .catch((err) => {
            return;
          });
        break;
      }
      case 1:{
        axios.post('http://localhost:3005/AddFriend',{
          user1 : Auth.userInfo[0].name,
          user2 : data.user
        }).then(response=>{
          if(response.data){
            del(messageid);
          }
        }).catch(err=>{
          return;
        });
        break;
      }
      default:
        return;
    }
  };

  const isRenderButton = (type) =>{
    let k = true;
    switch(type)
    {
      case -1: k &= false; break;
      case  2: k &= false; break;
      case  3: k &= false; break;
      default: k &= true; break;
    }
    return k;
  }

  useEffect(() => {
    const user = Auth.userInfo[0].name;
    if (user === "user") {
      return;
    }
    fetch(`http://localhost:3005/Inbox/${user}`)
      .then((response) => response.json())
      .then((response) => {
        if (
          typeof response !== undefined ||
          response !== "An Error has occured!"
        ) {
          if (response === "none") {
            return updMes({
              message: "No messages as of yet!",
              byuser: "no-one",
              recievedat: "none",
              type: JSON.stringify({ type: "normal" }),
            });
          }
          response.map((item) => {
            item.additional = JSON.parse(item.additional);
            return null;
          });
          updMes(response);
          change_this(false);
        }
      })
      .catch((err) => {
        change_this(true);
      });
  }, [Auth.userInfo[0]]);

  return messages.length > 0 ? (
    <div className="Inbox">
      <div className="MessageCatalogue">
        <h1>Messages</h1>
        <div className="MessageList">
          {messages.map((item, index) => {
            return (
              <div
                className="message"
                key={index}
                onClick={() => ChangeActiveIndex(index)}
              >
                <h3>
                  {returnMessageTitle(item.additional.rtype)}
                </h3>
                <div className="message-sub">
                  <h4>{`-${item.byuser}(${item.recievedat})`}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="MessageWindow">
        <div className="Message-display">
          <h1>{messages[ActiveIndex].additional.title}</h1>
          <div
            className="message-frame"
            dangerouslySetInnerHTML={{
              __html: Htmlify(messages[ActiveIndex].message),
            }}
          ></div>
          <h2>{messages[ActiveIndex].byuser}</h2>
        </div>
        {isRenderButton(messages[ActiveIndex].additional.rtype) ?<div
          className="respond"
        >
          <button
            onClick={() => {
              ExecuteResponse(
                messages[ActiveIndex].additional,
                messages[ActiveIndex].messageid,
                true
              );
            }}
          >
            {messages[ActiveIndex].additional.rtype === 1 ? "Accept" : "Grant"}
          </button>
          <button
            onClick={() => {
              ExecuteResponse(
                messages[ActiveIndex].additional,
                messages[ActiveIndex].messageid,
                false
              );
            }}
          >
            Decline
          </button>
        </div>:null}
      </div>
    </div>
  ) : (
    <h1>You've got nothing in your Mail box!</h1>
  );
};

export default Inbox;
