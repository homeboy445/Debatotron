import React, { useState } from "react";
import axios from "axios";
import "./DebForm.css";

const DebateForm = ({ userInfo, ToggleDisplay }) => {
  const [title, Altertitle] = useState("");
  const [Description, AlterDesc] = useState("");
  const [catg, change_catg] = useState("");
  const [access, ChangeAccess] = useState(false);
  const deb_id = Date.now();

  const HandleTitle = (evt) => {
    Altertitle(evt.target.value);
  };

  const HandleCategory = (evt) => {
    change_catg(evt.target.value);
  };

  const HandleDescription = (evt) => {
    AlterDesc(evt.target.value);
  };

  const SendData = (event,recieved_flag) => {
    if (!(deb_id && title && Description && recieved_flag && catg)) {
      return;
    }
    event.preventDefault();
    axios
      .post("http://localhost:3005/save", {
        uniqid: deb_id,
        title: title,
        overview: Description,
        publishedat: new Date().toLocaleDateString(),
        publisher: userInfo[0].name,
        flag: recieved_flag,
        link: Image.status ? Image.link : Image.text,
        category: catg,
        access: !access ? "public" : "private",
      })
      .then((response) => {
        window.location.href = `DebPage/${response.data}`;
      })
      .catch((err) => {
        ToggleDisplay({
          text: "Some Error has occured please try again...",
          status: true,
        });
      });
  };

  return (
    <div className="form1">
      <h1 className="hh">Start a New Debate!</h1>
      <form>
        <h2 className="tp">Specify the topic!</h2>
        <input
          type="text"
          className="inp"
          onChange={HandleTitle}
          value={title}
        />
        <h2>Add Category</h2>
        <input
          type="text"
          className="inp"
          onChange={HandleCategory}
          placeholder="Add category"
        />
        <h2 className="dsp">Now,Give Some of your views about it!</h2>
        <textarea className="txt" onChange={HandleDescription}>
          {Description}
        </textarea>
        {/* <h1 className="img_1">Add an Image(optional):</h1>
                <input type="text" className="img_2" placeholder="Enter Link to your Image"
                onChange={HandleImageLink}/> */}
        <div className="access">
          <div>
            <input
              type="radio"
              checked={!access}
              onClick={() => ChangeAccess(false)}
            />
            <h2>Public</h2>
          </div>
          <div>
            <input
              type="radio"
              checked={access}
              onClick={() => ChangeAccess(true)}
            />
            <h2>Private</h2>
          </div>
        </div>
        <div className="btnn">
          <button onClick={(e) => SendData(e,"saved")} className="sv">
            Save
          </button>
          <button onClick={(e) => SendData(e,"Draft")} className="dl">
            Draft
          </button>
        </div>
      </form>
    </div>
  );
};
export default DebateForm;
