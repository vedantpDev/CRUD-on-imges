import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginProtectedRoute = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login-page");
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
};

export default LoginProtectedRoute;
