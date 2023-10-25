import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [ username, setUsername ] = useState("");
  const [password, setPassword ] = useState("");

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

  
  const handleRegister = () => {
    axios
      .post("http://localhost:3000/register", { username, password })
      .then(() => {
        console.log("User registered");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        navigate("/register");
      });
  };
  return (
    <div>
      <h1>Registration Page</h1>
      <label htmlFor="username">Username: </label>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        required
      />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
      />
      <br />
      <br />
      <button type="submit" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
};

export default Register;
