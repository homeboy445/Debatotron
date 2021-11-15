import React, { useState, useEffect, useContext } from "react";
import "./UserFeed.css";
import axios from "axios";
import Empty from "../../Images/empty.jpg";
import Tick from "../../Images/tick.svg";
import AuthContext from "../../Contexts/AuthContext";

const UserFeed = () => {
  const Main = useContext(AuthContext);
  const [postBox, togglepostBox] = useState(false);
  const [textArea, updateTextArea] = useState("");
  const [popularUsers, updatePopularUsers] = useState([
    "Dylan",
    "Harvey",
    "Benny",
    "June",
    "Victor",
  ]);
  const [feed, updateFeed] = useState([
    {
      user: "Dylan",
      type: 0,
      debate: {
        id: "xyzyxya",
        title: "Social media is becoming toxic everyday.",
      },
      publishedAt: new Date().toDateString(),
    },
    {
      user: "Harvey",
      type: 1,
      post: {
        text: "Debatotron is the best platform for debating out there and I think it should grow more so that more people could experience it's greatness",
      },
      publishedAt: new Date().toDateString(),
    },
    {
      user: "Dylan",
      type: 0,
      debate: {
        id: "xyzyxya",
        title: "Open source software is so cool!",
      },
      publishedAt: new Date().toDateString(),
    },
    {
      user: "Victor",
      type: 0,
      debate: {
        id: "xyzyxya",
        title: "Some tech companies interview process is overly hard.",
      },
      publishedAt: new Date().toDateString(),
    },
    {
      user: "Bobby",
      type: 1,
      post: {
        text: "Here's some gibberish text, They floated in the puppet place had been a subunit of Freeside’s security system. The girls looked like tall, exotic grazing animals, swaying gracefully and unconsciously with the movement of the train, their high heels like polished hooves against the gray metal of the room where Case waited. She put his pistol down, picked up her fletcher, dialed the barrel over to single shot, and very carefully put a toxin dart through the center of a painted jungle of rainbow foliage, a lurid communal mural that completely covered the hull of the Flatline as a construct, a hardwired ROM cassette replicating a dead man’s skills, obsessions, kneejerk responses. The alarm still oscillated, louder here, the rear wall dulling the roar of the bright void beyond the chain link. Then he’d taken a long and pointless walk along the black induction strip, fine grit sifting from cracks in the tunnel’s ceiling. Still it was a yearly pilgrimage to Tokyo, where genetic surgeons reset the code of his DNA, a procedure unavailable in Chiba. The semiotics of the previous century. He’d waited in the center of his closed left eyelid. Then he’d taken a long and pointless walk along the black induction strip, fine grit sifting from cracks in the human system.",
      },
      publishedAt: new Date().toDateString(),
    },
    {
      user: "Benny",
      type: 0,
      debate: {
        id: "xyzyxya",
        title:
          "Superhero movies are better than every other genres except for sci-fi.",
      },
      publishedAt: new Date().toDateString(),
    },
    {
      user: "June",
      type: 0,
      debate: {
        id: "xyzyxscin",
        title: "Nature is the best thing ever!",
      },
      publishedAt: new Date().toDateString(),
    },
  ]);
  const [topContributors, updateContributors] = useState([
    "June",
    "Dylan",
    "Bobby",
    "Jane",
    "Benny",
    "Victor",
    "Harvey",
    "James",
  ]);

  useEffect(() => {
    if (Main.userInfo[0].id !== -1) {
      axios
        .get(`http://localhost:3005/feed/${Main.userInfo[0].id}`)
        .then((response) => {
          updateFeed(response.data);
          axios.get("http://localhost:3005/popularUsers").then((response) => {
            updatePopularUsers(response.data);
            axios
              .get("http://localhost:3005/topContributors")
              .then((response) => {
                updateContributors(response.data);
              });
          });
        })
        .catch((err) => {
          return;
        });
    }
  }, [Main]);

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
                .post("http://localhost:3005/makePost", {
                  user: Main.userInfo[0].name,
                  userId: Main.userInfo[0].id,
                  post: textArea.trim(),
                  date: new Date().toISOString(),
                })
                .then((response) => {
                  window.location.href = "/";
                });
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
        <div className="feed_1">
          <h2>Most Popular users</h2>
          {popularUsers.map((item, index) => {
            const image = `https://avatars.dicebear.com/api/micah/${
              item.image || Math.random()
            }.svg`;
            return (
              <div key={index} className="usr_card">
                <img src={image} alt="" />
                <h3>{item.name}</h3>
              </div>
            );
          })}
        </div>
        <div className="feed_main">
          {feed.length > 0 ? (
            (feed || []).map((item, index) => {
              const image = `https://avatars.dicebear.com/api/micah/${
                item.image || Math.random()
              }.svg`;
              return (
                <div key={index} className="feed_card">
                  <div className="feed_x1">
                    <div className="usr_card1">
                      <img src={image} alt="" />
                      <h3>{item.user}</h3>
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
                </div>
              );
            })
          ) : (
            <div className="feed_empty">
              <img src={Empty} alt="" />
              <h2>Your Feed's Empty! Try debating more!</h2>
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
        <div className="feed_2">
          <h2>Top Debators</h2>
          {topContributors.map((item, index) => {
            const image = `https://avatars.dicebear.com/api/micah/${
              item.image || Math.random()
            }.svg`;
            return (
              <div key={index} className="usr_card2">
                <h1>{index + 1}.</h1>
                <img src={image} alt="" />
                <h3>{item.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserFeed;
