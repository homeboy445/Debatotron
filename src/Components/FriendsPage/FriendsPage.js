import React, { useState, useEffect } from "react";
import axios from "axios";
import "../FriendsPage/FriendsPage.css";

const FriendsPage = ({ userInfo }) => {
  const [Display, ToggleDisplay] = useState(true);
  const [requestMade, ToggleReq] = useState(false);
  const [MainData, UpdateData] = useState(null);
  const [Friends, UpdateFriendsList] = useState([
    { name: "William", description: "I love to Cook" },
  ]);
  const [NotFound, UpdateNotFoundStatus] = useState({
    status:true,message:"You don't have any friend!"
  });

  const HandleChange = (evt) => {
    const value = evt.target.value.trim();
    if (value === "") {
      UpdateFriendsList(MainData);
      UpdateNotFoundStatus(false);
      return;
    }
    var SearchResults = [];
    MainData.map((item) => {
      if (item.name.includes(value)) {
        SearchResults.push(item);
      }
      return null;
    });
    if (SearchResults.length > 0) {
      UpdateFriendsList(SearchResults);
    } else {
      UpdateNotFoundStatus(true);
    }
  };

  useEffect(() => {
    console.log([Friends, userInfo, Display,requestMade]);
    if (userInfo[0].name !== "user" && !requestMade) {
      axios
        .get(
          `http://localhost:3005/${
            Display ? "friends/" + userInfo[0].name : "returnAllUsers"
          }`
        )
        .then((response) => {
          console.log(response);
          if(response.data.length === 0){
            UpdateFriendsList([]);
            UpdateData([]);
            UpdateNotFoundStatus({status:true,message:Display?"You don't have any friend!":'No user here.'});
            return;
          }
          var array = [];
          response.data.map((item) => {
            if (item.name === userInfo[0].name) {
              return null;
            }
            array.push(item);
            return null;
          });
          UpdateFriendsList(array);
          UpdateData(array);
          ToggleReq(!requestMade);
          UpdateNotFoundStatus({status:false,message:''});
        })
        .catch((err) => {
          return;
        });
    }
  }, [Friends, userInfo, Display]);

  const ToggleDisp = (ss)=>{
    ToggleDisplay(ss);
    ToggleReq(false);
  }

  return (
    <div className="FriendsPage-main">
      <input
        type="search"
        className="search"
        placeholder="Search People..."
        onChange={HandleChange}
        disabled={Friends.length === 0}
      />
      <div className="choice-box">
        <h2
          style={{
            background: Display ? "green" : "transparent",
            color: Display ? "yellow" : "black",
          }}
          onClick={()=>ToggleDisp(1)}
        >
          My Friends
        </h2>
        <h2
          style={{
            background: !Display ? "green" : "transparent",
            color: !Display ? "yellow" : "black",
          }}
          onClick={()=>ToggleDisp(0)}
        >
          World
        </h2>
      </div>
      <div className="friendWin">
        {!NotFound.status ? (
          Friends.map((item) => (
            <div className="personCard" style={{background:item.status === false?'cyan':'white'}}>
              <img
                src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-PNG-Icon.png"
                alt="$"
              />
              <a href={`/Profile/${item.name}`}>{item.name}</a>
              <h2>{item.description}</h2>
            </div>
          ))
        ) : (
          <h1>{NotFound.message}</h1>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
