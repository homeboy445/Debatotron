import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import AuthContext from "../../Contexts/AuthContext";
import Notif_On from "../../Images/notif_on.svg";
import Notif_Off from "../../Images/notif_off.svg";
import Empty from "../../Images/empty.svg";
import Filter from "../../Images/filter.svg";
import Arrow from "../../Images/left_arrow.svg";
import "./Inbox.css";

const Inbox = () => {
  const [messages, updMes] = useState([
    {
      message: "You're Messages will appear here!",
      recievedat: "",
      additional: { title: "Message Title", rtype: -1e9 },
      byuser: "",
      messageid: "",
    },
  ]);
  const [NotRecieved, change_this] = useState(true);
  const [toggle, toggler] = useState(false);
  const [ActiveIndex, ChangeActiveIndex] = useState(0);
  const [NotifStatus, ToggleNotif] = useState(false);
  const [OpenedMailsList, UpdateReadList] = useState([0]);
  const [fetchStatus, updateStatus] = useState(false);
  const Auth = useContext(AuthContext);
  const ref1 = useRef();
  const HandleToggle = () => {
    toggler(!toggle);
  };

  const Delete_Data = () => {
    HandleToggle();
    axios
      .get(
        `${Auth.uri}/WipeInbox/${Auth.userInfo[0].name}`,
        Auth.getAuthHeader()
      )
      .then((response) => {
        window.location.href = "/Inbox";
      })
      .catch((err) => {
        return;
      });
  };

  const Htmlify = (text) => {
    return `<div class="display-body">${text}</div>`;
  };

  const returnMessageTitle = (type) => {
    switch (type) {
      case -1:
        return "Welcome, user to the debatotron.";
      case 0:
        return "A user needs Access to one of your Debates.";
      case 1:
        return "A New Friend Request!";
      case 2:
        return "Access Granted!";
      case 3:
        return "You've gotta new friend!";
      case 4:
        return "A user has Mentioned you!";
      case 5:
        return "A user replied to your comment!";
      case 6:
        return "A user liked your comment!";
      case 7:
        return "A user has messaged you!";
      default:
        return "Test Message";
    }
  };

  const ExecuteResponse = (data, messageid, status) => {
    const del = (messageid) => {
      //For deleting any message via its uuid.
      axios
        .post(
          Auth.uri + "/removeMessage",
          {
            mId: messageid,
          },
          Auth.getAuthHeader()
        )
        .then((response) => {
          window.location.href = "/Inbox";
        })
        .catch((err) => {
          if (err.response.status === 401) {
            Auth.refresh();
          }
        });
    };
    if (!status) {
      return del(messageid);
    }
    switch (data.rtype) {
      case 0: {
        axios
          .post(
            Auth.uri + "/AddParticipant",
            {
              debid: data.debid,
              participant: data.user,
            },
            Auth.getAuthHeader()
          )
          .then((response) => {
            if (response.data) {
              del(messageid);
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              Auth.refresh();
            }
          });
        break;
      }
      case 1: {
        axios
          .post(
            Auth.uri + "/AddFriend",
            {
              user1: Auth.userInfo[0].name,
              user2: data.user,
            },
            Auth.getAuthHeader()
          )
          .then((response) => {
            if (response.data) {
              del(messageid);
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              Auth.refresh();
            }
          });
        break;
      }
      default:
        return;
    }
  };

  const isRenderButton = (type) => {
    let k = true;
    switch (type) {
      case -1:
        k &= false;
        break;
      case 2:
        k &= false;
        break;
      case 3:
        k &= false;
        break;
      case 4:
        k &= false;
        break;
      case 5:
        k &= false;
        break;
      case 6:
        k &= false;
        break;
      case 7:
        k &= false;
        break;
      default:
        k &= true;
        break;
    }
    return k;
  };

  const isMailOpened = (index) => {
    return OpenedMailsList.find((item) => item === index);
  };

  const updateList = (k) => {
    ChangeActiveIndex(Math.max(0, (ActiveIndex + k) % messages.length));
  };

  useEffect(() => {
    if (Auth.userInfo[0].id !== -1 && !fetchStatus) {
      updateStatus(true);
      Auth.toggleLoader(true);
      axios
        .get(Auth.uri + `/Inbox/${Auth.userInfo[0].name}`, Auth.getAuthHeader())
        .then((response) => {
          console.log(response.data);
          response = response.data;
          if (
            typeof response !== undefined ||
            response !== "An Error has occured!"
          ) {
            if (response === "none") {
              throw response;
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
          updMes([
            {
              message: "You're Messages will appear here!",
              recievedat: "",
              additional: { title: "Message Title", rtype: -1e9 },
              byuser: "",
              messageid: "",
            },
          ]);
          try {
            if (err.response.status === 401) {
              Auth.refresh();
            }
          } catch (e) {}
          change_this(true);
        })
        .finally((e) => {
          Auth.toggleLoader(false);
        });
    }
  }, [Auth, messages]);

  return (
    <div className="inbox">
      <div className="message-window">
        <div className="inbx-header">
          <div className="ibx-hdr1">
            <h1>Inbox</h1>
            <img
              src={NotifStatus ? Notif_On : Notif_Off}
              onClick={() => {
                ToggleNotif(!NotifStatus);
              }}
              alt=""
            />
          </div>
          <div className="ibx-hdr2">
            <img src={Filter} alt="" />
            <img
              src={Empty}
              alt=""
              onClick={() => {
                return;
              }}
            />
          </div>
        </div>
        <div
          className="inbx-message-catalogue"
          style={{
            height:
              ref1.current !== undefined
                ? ref1.current.offsetHeight / 2 + 150
                : "485px",
          }}
        >
          {typeof messages === Array
            ? messages.map((item, index) => (
                <div
                  className="message-card"
                  key={index}
                  onClick={() => {
                    ChangeActiveIndex(index);
                    var arr = OpenedMailsList;
                    arr.push(index);
                    UpdateReadList(arr);
                  }}
                  style={{
                    background: isMailOpened(index) ? "#e2e9fa" : "white",
                    transition: "0.5s",
                  }}
                >
                  <div
                    className="bluebar"
                    style={{
                      visibility: ActiveIndex === index ? "visible" : "hidden",
                    }}
                  ></div>
                  <div>
                    <div className="mc-1">
                      <h2>{item.byuser}</h2>
                      <p>{item.recievedat}</p>
                    </div>
                    <h3 className="descp">
                      {returnMessageTitle(item.additional.rtype)}
                    </h3>
                    <div className="mc-2">
                      <h3>tags:</h3>
                      <ul>
                        <li>friend-request</li>
                        <li>new-comer</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <div className="display-window" ref={ref1}>
        <div className="display-header">
          {returnMessageTitle(messages[ActiveIndex].additional.rtype)}
        </div>
        <div className="display-sub">
          <div className="display-info">
            <h1
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                if (messages[ActiveIndex].byuser === "DebManager") {
                  return;
                }
                window.location.href = `/Profile/${messages[ActiveIndex].byuser}`;
              }}
            >
              {messages[ActiveIndex].byuser}
            </h1>
            <h2>{messages[ActiveIndex].recievedat}</h2>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: Htmlify(messages[ActiveIndex].message),
            }}
          ></div>
        </div>
        {isRenderButton(messages[ActiveIndex].additional.rtype) ? (
          <div className="respond">
            <button
              onClick={() => {
                ExecuteResponse(
                  messages[ActiveIndex].additional,
                  messages[ActiveIndex].messageid,
                  true
                );
              }}
            >
              {messages[ActiveIndex].additional.rtype === 1
                ? "Accept"
                : "Grant"}
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
          </div>
        ) : null}
        {messages.length > 0 && messages[0].additional.rtype !== -1e9 ? (
          <div className="display-btns">
            <img src={Arrow} onClick={() => updateList(-1)} alt="" />
            <img src={Arrow} onClick={() => updateList(1)} alt="" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Inbox;
