import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-content">
        <Outlet /> {/* Loads Event, Booking, etc., based on route */}
      </div>
    </div>
  );
}
