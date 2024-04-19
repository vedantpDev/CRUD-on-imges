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
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-sm w-full p-8">
        <h2 className="mt-10 text-center text-xl font-semibold text-gray-900">
          LogIn to your account
        </h2>

        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Email address
            </label>
            <input
              placeholder="Enter your email address"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900"
            >
              Password
            </label>
            <input
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
            />
          </div>

          <span
            className="cursor-pointer text-blue-600"
            onClick={() => navigate("/register-page")}
          >
            Create New Account
          </span>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
