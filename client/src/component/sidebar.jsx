import React, { useState, useEffect } from 'react';
import axios from "axios";
import iconpic from '../assets/iconpic.png'
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png'
import { Calendar, Link2, Clock, Settings, Plus, Trash2, PencilLine, Copy   } from 'lucide-react';
import "../styles/sidebar.css";

export default function sidebar() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    console.error("No token found!");
                    return;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getName`, {
                    headers: {
                        Authorization: token, 
                    },
                });

                if (res.data.firstName && res.data.lastName) {
                    const formattedName = formatUserName(res.data.firstName, res.data.lastName);
                    setUserName(formattedName);
                } else {
                    console.error("Invalid response data:", res.data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    const formatUserName = (firstName, lastName) => {
        const maxLength = 12; // Max character limit
        const fullName = `${firstName} ${lastName}`;

        if (fullName.length > maxLength) {
            return `${firstName} ${lastName.slice(0, 3)}.`; // Shorten last name
        }
        return fullName;
    };

  return (
    <div className="sidebar">
    <div className="sidebar-title"><img src={Logo} alt="" /></div>
    <nav className="sidebar-menu">
      <NavLink to="event" className="menu-item"><Link2 /><span>Event</span></NavLink>
      <NavLink to="booking" className="menu-item"><Calendar />Booking</NavLink>
      <NavLink to="availability" className="menu-item"><Clock />Availability</NavLink>
      <NavLink to="settings" className="menu-item"><Settings />Settings</NavLink>
      <NavLink to="create" className="menu-create"><Plus/>Create</NavLink>
    </nav>
    <div className='initial'><img src={iconpic} alt="" /><span>{userName ? userName : "Loading..."}</span></div>
  </div>
  )
}
