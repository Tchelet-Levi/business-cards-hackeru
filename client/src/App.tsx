import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Outlet, Route } from "react-router-dom";
import Main from "./components/pages/Main/Main";
import Signin from "./components/pages/Signin/Signin";
import Signup from "./components/pages/Signup";
import "./overrides.css";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
