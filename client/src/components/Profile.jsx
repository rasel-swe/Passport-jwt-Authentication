import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/profile", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        navigate("/login");
        console.log(err);
      });
  }, []);
  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
};

export default Profile;
