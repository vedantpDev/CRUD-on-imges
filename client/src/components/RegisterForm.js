import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/db";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        const registerUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userData = registerUser.user;
        if (userData) {
          navigate("/login-page");
        }
      }
    } catch (error) {
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
        <h1>Register Here</h1>
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
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <label>Enter Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        Already have an account?
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/login-page")}
        >
          Login Here
        </span>
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <button>Register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
