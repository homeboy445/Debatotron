import React from "react";
import axios from "axios";
import "./Debpage.css";
import heart from "../../Images/favourite.png";
import Robot from "../../Assets/Robot.png";
import Cookie from "js-cookie";
import { withRouter } from "react-router-dom";
import socketIo from "socket.io-client";

class DebPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Access: true,
      requested: false,
      toggle: false,
      topic: "Start a Debate on the new Page!",
      overview: "",
      comments: ["Be the First to comment!"],
      typed_com: "",
      id: this.props.match.params.id,
      failedConnecting: false,
      toggle_comment: false,
      user: "guest",
      likes: 0,
      liked: false,
    };
    this.socket = React.createRef();
  }
  ToggleIt = () => {
    var tog = this.state.toggle;
    this.setState({
      toggle: !tog,
    });
  };
  HandleInputChange = (event) => {
    this.setState({
      typed_com: event.target.value,
    });
  };
  UpdateComments = (event) => {
    this.socket.current.emit("test", "test it");
    event.preventDefault();
    var id = this.state.id;
    var obj = this.state.comments;
    if (this.state.typed_com.trim() !== "") {
      obj.push({
        comment: this.state.typed_com,
        byuser: this.props.userInfo[0].name,
      });
      this.setState({
        comments: obj,
        typed_com: "",
      });
      var com_obj = {
        comment: this.state.typed_com,
        room: id,
        byuser: this.props.userInfo[0].name,
      };
      console.log(com_obj);
      this.socket.current.emit("make-comment", com_obj);
    }
  };
  Comment_Toggle = (state) => {
    this.setState({
      toggle_comment: !state,
    });
  };
  componentWillMount() {
    this.socket.current = socketIo.connect("http://localhost:3005");
    this.socket.current.emit("test", "TESTING...");
    const id = this.state.id;
    this.socket.current.on("recieve", (data) => {
      console.log(data);
      this.socket.current.emit("live", id);
    });
    axios
      .get(`http://localhost:3005/getdebdata/${id}`)
      .then((response) => {
        if (response.data[0].access !== "public") {
          axios
            .get(
              `http://localhost:3005/CheckAccess/${id}/${Cookie.get(
                "username"
              )}`
            )
            .then((response) => {
              if (response.data) {
                return;
              }
              throw false;
            })
            .catch((err) => {
              return this.setState({
                Access: false,
              });
            });
        }
        this.setState({
          topic: response.data[0].topic,
          overview: response.data[0].overview,
        });
        axios
          .get(`http://localhost:3005/getcomments/${id}`)
          .then((response) => {
            this.setState({
              comments: response.data,
              failedConnecting: false,
            });
            axios
              .get(`http://localhost:3005/getlikes/${id}`)
              .then((response) => {
                if (!response) {
                  return;
                }
                this.setState({
                  likes: parseInt(response.data[0].count),
                });
                axios
                  .get(
                    `http://localhost:3005/IsLiked/${id}/${this.props.userInfo[0].name}`
                  )
                  .then((response) => {
                    if (!response) {
                      return;
                    }
                    if (response.data[0].users) {
                      this.setState({
                        liked: true,
                      });
                    }
                  })
                  .catch((err) => {
                    this.setState({
                      liked: false,
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            this.setState({
              comments: ["Failed to load comments!"],
              failedConnecting: true,
            });
          });
      })
      .catch((err) => {
        this.setState({
          user: "guest",
        });
      });
  }
  componentDidMount() {
    if (!this.state.access) {
      if (!this.state.requested) {
        axios
          .get(
            `http://localhost:3005/IsRoomRequested/${
              this.state.id + ":" + this.props.userInfo[0].name
            }`
          )
          .then((response) => {
            if (response.data) {
              this.setState({
                requested: true,
              });
            }
          })
          .catch((err) => {
            return;
          });
      } else {
        this.props.ToggleDisplay({
          text: "You've already requested this room!",
          status: true,
        });
      }
    }
    this.socket.current.on("comment", (data) => {
      var obj = this.state.comments;
      obj.push(data);
      this.setState({
        comments: obj,
      });
    });
  }

  HandleLike = () => {
    if (this.state.failedConnecting) {
      return;
    }
    axios
      .post("http://localhost:3005/UpdateLikes", {
        id: this.state.id,
        user: this.props.userInfo[0].name,
        flag: this.state.liked ? 0 : 1,
      })
      .then((response) => {
        if (!response) {
          return;
        }
        console.log(response);
        this.setState({
          liked: !this.state.liked,
          likes: this.state.likes + (this.state.liked ? -1 : 1),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  HandleRoomRequest = () => {
    this.props.ToggleDisplay({
      text: "Room has been requested!",
      status: true,
    });
    axios
      .get(
        `http://localhost:3005/MakeDebRequest/${
          this.state.id + ":" + this.props.userInfo[0].name
        }`
      )
      .then((response) => {
        this.setState({
          requested: true,
        });
      })
      .catch((err) => {
        this.props.ToggleDisplay({
          text: "Some error has occured! Try again!",
          status: true,
        });
      });
  };

  render() {
    return this.state.Access ? (
      <div className="container">
        <div
          style={{
            background: this.state.liked ? "white" : "black",
            width: "10%",
            borderRadius: "5px",
            padding: "0.1%",
            fontSize: "2rem",
            display: "flex",
            transition: "0.4s ease",
            justifyContent: "center",
            alignItems: "center",
            color: this.state.liked ? "black" : "white",
          }}
        >
          <img
            src={heart}
            className="hrtimg"
            style={{ width: "50%", height: "10%" }}
            onClick={this.HandleLike}
            alt="&"
          />
          :{this.state.likes}
        </div>
        <h1 className="hdr">{this.state.topic}</h1>
        <button id="butn" onClick={this.ToggleIt}>
          Overview<span>+</span>
        </button>
        <div
          id="prg"
          style={{ visibility: this.state.toggle ? "visible" : "hidden" }}
        >
          <p>{this.state.overview}</p>
        </div>
        <form onSubmit={this.UpdateComments} className="frm1">
          <input
            type="text"
            placeholder="comment"
            onChange={this.HandleInputChange}
            className="inpp"
            value={this.state.typed_com}
            disabled={this.state.failedConnecting}
          />
        </form>
        <div className="comments" ref="cmtsection">
          {!this.state.failedConnecting ? (
            this.state.comments[0] !== null ? (
              this.state.comments.map((item) => {
                return (
                  <div className="cmt_flx">
                    <p className="cmts">
                      <a
                        href={
                          item.byuser !== "guest"
                            ? `/Profile/${item.byuser}`
                            : ""
                        }
                        className="usr"
                      >
                        {item.byuser}
                      </a>
                      <p className="cmt">{item.comment}</p>
                    </p>
                  </div>
                );
              })
            ) : (
              <p>Be the First to Comment!</p>
            )
          ) : (
            <h1>404 error has occured!</h1>
          )}
          {/* {item.byuser!==null?<p>@</p>:<p></p>} */}
        </div>
        <a href="/OngoingDebs">Back to Debates Page!</a>
      </div>
    ) : (
      <div className="private">
        <img src={Robot} alt="" />
        <div>
          <h1>Oops! Looks like you don't have access to this debate.</h1>
          {!this.state.requested ? (
            <button onClick={this.HandleRoomRequest}>Request Access</button>
          ) : (
            <h2>You've already requested this room!</h2>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(DebPage);
