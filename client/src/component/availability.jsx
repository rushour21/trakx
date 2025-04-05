import React from 'react'
import { NavLink, Outlet, useNavigate  } from 'react-router-dom';
import { Calendar, List  } from 'lucide-react';
import "../styles/availability.css"


export default function availability() {
  const navigate = useNavigate();
  return (
    <div className="avai-container">
        <div className="header">
            <h2>Availability</h2>
            <p>Configure times when you are available for bookings</p>
        </div>
        <div className='nav-button'>
          <NavLink to="availabilityView" className={({isActive}) => isActive ? "navbar-menu-item active-it" : "navbar-menu-item"}><List size={15}/>Availability</NavLink>
          <NavLink to="calenderView" className={({isActive}) => isActive ? "navbar-menu-item active-it" : "navbar-menu-item"} ><Calendar size={15}/>CalenderView</NavLink>
        </div>
        <div>
          <Outlet />
        </div>
    </div>
  )
}
