import React from "react";

const ProfilePicture = ({ Image }) => {
  return (
    <div className="profile_image">
      <img src={Image} alt="" />
    </div>
  );
};

export default ProfilePicture;
