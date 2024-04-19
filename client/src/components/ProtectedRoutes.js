import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/");
    } else {
      navigate("/login-page");
    }
  }, []);

  return (
    <div>
      <Component />
    </div>
  );
};

export default ProtectedRoutes;
