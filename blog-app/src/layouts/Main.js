import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Main = () => {
  return (
    <div>
      <Header />
      <div id="layoutSidenav">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
