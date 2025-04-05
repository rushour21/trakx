import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";
import MobileSidebar from '../component/mobileSidebar'
import Logo from '../assets/logo.png'
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      < Sidebar />
      <img className="top-logo" src={Logo} alt="" />
      {/* Main Content */}
      <div className="dashboard-content">
        <Outlet /> {/* Loads Event, Booking, etc., based on route */}
      </div>
      <MobileSidebar/>
    </div>
  );
}
