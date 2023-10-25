import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
        navigate("/profile");
      })
      .catch((err) => {
        navigate("/login");
        console.log(err);
      });
  }, []);
  const handleLogin = () => {
    axios
      .post("http://localhost:3000/login", { username, password })
      .then((user) => {
        console.log("User is logged in");
      localStorage.setItem("token", user.data.token)
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);
        navigate("/login");
      });
  };
  return (
    <div>
      <h1>Login Page</h1>
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
      <button type="submit" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
