import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/db";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userData = registerUser.user;
      if (userData) {
        localStorage.setItem("accessToken", userData.accessToken);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <label>Enter Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <label>Enter Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/register-page")}
        >
          Create New Account
        </span>
        <button>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
