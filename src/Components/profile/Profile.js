import React from "react";
import { withRouter } from "react-router-dom";
import EditProfile from "./EditProfile";
import image from "../../Images/Profile.jpg";
import axios from "axios";
import "./Profile.css";
class Profile extends React.Component {
  constructor(props) {
    super();
    this.state = {
      profile_data: {
        name: "Username will appear Here!",
        joinedat: "Joined data will appear Here!",
        friends: "Friends Will appear Here!",
        Groups: "Groups will appear Here!",
        profile_image: "default",
      },
      drafts: null,
      debcounts: null,
      access: true,
      display: true,
    };
    this.ToggleDisplay = this.ToggleDisplay.bind(this);
  }

  IsFriend = () =>{
    let arr = this.props.FriendsList;
    if(arr.length > 0){
      let res = arr.find(e => e === this.props.match.params.user);
      return typeof res !== undefined;
    }return false;
  }
 
  componentDidMount() {
    axios
      .get(`http://localhost:3005/profile_Data/${this.props.match.params.user}`)
      .then((response) => {
        response = response.data;
        if (response[0].name) {
          this.setState({
            profile_data: response[0],
          });
          axios
            .get(`http://localhost:3005/debcount/${response[0].name}`)
            .then((response1) => {
              response1 = response1.data;
              if (response1[0].name) {
                this.setState({
                  debcounts: response1[0].count,
                });
              }
              axios
                .get(`http://localhost:3005/Draft/${response[0].name}`)
                .then((response) => {
                  response = response.data;
                  if (response[0].topic) {
                    this.setState({
                      drafts: response,
                    });
                  }
                })
                .catch((err) => {
                  this.setState({ draft: null });
                });
            })
            .catch((err) => {
              this.setState({
                debcounts: null,
              });
            });
        }
      })
      .catch((err) => {
        this.setState({
          profile_data: {
            name: "Username will appear Here!",
            joinedat: "Joined data will appear Here!",
            counts: "debs count will appear Here!",
            friends: "Friends Will appear Here!",
            Groups: "Groups will appear Here!",
            profile_image: "default",
          },
          access: true,
        });
      });
  }
  ToggleDisplay() {
    this.setState({
      display: !this.state.display,
    });
  }
  //<a href='https://www.freepik.com/vectors/background'>Background vector created by rawpixel.com - www.freepik.com</a>
  //Look forward to this in case of deploying!
  render() {
    return this.state.display === true ? (
      <div>
        <div className="profl">
          <img
            src={
              this.state.profile_data.profile_image !== "default"
                ? this.state.profile_data.profile_image
                : image
            }
            className="bgh"
            alt="$"
          />
          <div className="prof_flx">
            {this.props.match.params.user === this.props.userInfo[0].name ? (
              <button
                className="edt"
                onClick={() => {
                  this.ToggleDisplay(false);
                }}
              >
                Edit Profile
              </button>
            ) : null}
            <h2 className="prf_hdr">{this.state.profile_data.name}</h2>
            <div className="prf_text">
              <h2>
                <span className="spn_txt">About:</span>
                {this.state.profile_data.about}
              </h2>
              <h2>
                <span className="spn_txt">Member since:</span>
                {this.state.profile_data.joinedat}
              </h2>
              <h2>
                <span className="spn_txt">Debates Organised:</span>
                {this.state.debcounts != null
                  ? this.state.debcounts
                  : "Haven't organised any debates so far!"}
              </h2>
              <h2>
                <span className="spn_txt">Friends:</span>
                {this.props.FriendsList.length}
                {this.props.match.params.user ===
                this.props.userInfo[0].name ? (
                  <a href="/Friends">(Make Some)</a>
                ) : (
                  this.IsFriend()?<p>This user's your friend.</p>:
                  <p
                    style={{ color: "cyan", cursor: "pointer"}}
                    onClick={() => {
                      axios
                        .post("http://localhost:3005/MakeFriendReq", {
                          user: this.props.userInfo[0].name,
                          fuser: this.props.match.params.user,
                          message: "Add me as a friend",
                        })
                        .then((response) => {
                          this.props.ToggleDisplay({
                            status: true,
                            message: "Friend request sent!",
                          });
                        })
                        .catch((err) => {
                          this.props.ToggleDisplay({
                            status: true,
                            message: "Please try again later!",
                          });
                        });
                    }}
                  >
                    Add Friend
                  </p>
                )}
              </h2>
              <h2>
                <span className="spn_txt">Groups:</span>
                {this.state.profile_data.Groups || "none"}
              </h2>
              <h2>
                <span className="spn_txt">Drafts:</span>
              </h2>
              <div className="drft">
                {this.state.drafts != null ? (
                  this.state.drafts.map((item) => {
                    return <a href={`/Draft/${item.debid}`}>{item.topic}</a>;
                  })
                ) : (
                  <h3>No Drafts!</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <EditProfile
        user={this.props.match.params.user}
        ToggleDisplay={this.ToggleDisplay}
      />
    );
  }
}
export default withRouter(Profile);
