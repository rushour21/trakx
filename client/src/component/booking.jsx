import React from 'react'
import { NavLink, Outlet  } from 'react-router-dom';
import '../styles/booking.css'

export default function Booking() {
  return (
    <div className="main-container">
      <div className="header">
        <h2>Bookings</h2>
        <p>See upcoming and past events booked through your event type links.</p>
      </div>
      <div className='booking-container'>
        <nav className="navbar-menu">
          <NavLink to="upcoming" className="navbar-menu-item">Upcoming</NavLink>
          <NavLink to="pending" className="navbar-menu-item">Pending</NavLink>
          <NavLink to="cancelled" className="navbar-menu-item">Canceled</NavLink>
          <NavLink to="past" className="navbar-menu-item">Past</NavLink>
        </nav>
        <div className='selected-booking'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
