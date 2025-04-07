import React, { useState, useEffect } from 'react';
import axios from "axios";
import iconpic from '../assets/iconpic.png'
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png'
import { Calendar, Link2, Clock, Settings, Plus, LogOut  } from 'lucide-react';
import "../styles/sidebar.css";

export default function sidebar() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [logout, setLogout] = useState(false)

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
      <NavLink to="event" className={({isActive}) => isActive ?"active-item menu-item" : 'menu-item' } ><Link2 /><span>Event</span></NavLink>
      <NavLink to="booking" className={({isActive}) => isActive ?"active-item menu-item" : 'menu-item' } ><Calendar />Booking</NavLink>
      <NavLink to="availability" className={({isActive}) => isActive ?"active-item menu-item" : 'menu-item' }><Clock />Availability</NavLink>
      <NavLink to="settings" className={({isActive}) => isActive ?"active-item menu-item" : 'menu-item' }><Settings />Settings</NavLink>
      <NavLink state={{ userName }} className={({isActive}) => isActive ?"active-create menu-create" : 'menu-create' } to="create" ><Plus/>Create</NavLink>
    </nav>
    
    <div onClick={() => setLogout(true)} className='initial'><img src={iconpic} alt="" /><span>{userName ? userName : "Loading..."}</span></div>
    {logout && (<button onClick={() => {
            localStorage.removeItem("authToken"); // Remove token
            navigate('/'); // Redirect to home page
        }} className='log-out'><LogOut /> Sign out</button>)}
  </div>
  )
}
