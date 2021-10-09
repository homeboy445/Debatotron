import React from "react";

const DebDescription = ({ title, description, toggleBox }) => {
  return (
    <div className="deb_descp">
      <h1>{title ||"How to be awesome?"}</h1>
      <h3>{description || "Just follow your instincts and be yourself"  }</h3>
      <button onClick={toggleBox}>OK</button>
    </div>
  );
};

export default DebDescription;
