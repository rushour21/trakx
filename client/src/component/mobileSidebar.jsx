import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Calendar, Link2, Clock, Settings,} from 'lucide-react';
import "../styles/mobileSidebar.css";


export default function MobileBottomNav() {
    const navigate = useNavigate();
  return (
    <div className="bottom-nav">
      <NavLink to="event" className={({isActive}) => isActive ?"active-b menu-b" : 'menu-b' }>
        <Link2 />
        Events
      </NavLink>
      <NavLink to="booking" className={({isActive}) => isActive ?"active-b menu-b" : 'menu-b' }>
        <Calendar />
        Booking
      </NavLink>
      <NavLink to="availability" className={({isActive}) => isActive ?"active-b menu-b" : 'menu-b' }>
        <Clock />
        Availability
      </NavLink>
      <NavLink to="settings" className={({isActive}) => isActive ?"active-b menu-b" : 'menu-b' }>
        <Settings />
        Settings
      </NavLink>
    </div>
  );
}
