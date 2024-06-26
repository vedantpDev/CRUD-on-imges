import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  RegisterForm,
  LoginForm,
  ProtectedRoutes,
  LoginProtectedRoute,
} from "./components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoutes Component={App} />} path="/" />
      <Route
        element={<LoginProtectedRoute Component={LoginForm} />}
        path="login-page"
      />
      <Route
        element={<LoginProtectedRoute Component={RegisterForm} />}
        path="register-page"
      />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
