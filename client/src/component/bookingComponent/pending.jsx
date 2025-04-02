import React from 'react'
import { useEffect, useState, useRef } from "react";
import {Ban, Check, Users  } from 'lucide-react';
import axios from "axios";
import  '../../styles/pending.css'

export default function pending() {
  const [showPopup, setShowPopup] = useState(false);
  const [participants, setParticipants] = useState([]); // Stores selected booking's participants
  const [selectedBookingId, setSelectedBookingId] = useState(null); // Store the selected booking's ID
  const [bookings, setBookings] = useState([]);
    const fetched = useRef(false); // Prevents duplicate API calls
  
    useEffect(() => {
      if (fetched.current) return; // Prevents second call
      fetched.current = true;
  
      const fetchBooking = async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) return; 
  
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/booking/pending`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
  
          console.log("API Response:", res.data); 
          setBookings(res.data.meetings || []); // Extract meetings array
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };
  
      fetchBooking();
    }, []);

    // Format date and time for display
  const formatDate = (date) => {
    const startDate = new Date(date);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDate = startDate.toLocaleDateString('en-US', options);
    const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { formattedDate, formattedTime, startDate };
  };

  // Function to get the end time based on the start time and duration
  const calculateEndTime = (startDate, duration) => {
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration);
    return endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle click on participant count to show popup
  const handleShowParticipants = (booking) => {
    setParticipants(booking.participants || []); // Store selected booking's participants
    setSelectedBookingId(booking._id); // Store booking ID
    setShowPopup(true); // Show popup
  };
  console.log(participants);

 

  return (
    <div className='pending-list'>
      {bookings.map((booking) => {
        const { formattedDate, formattedTime, startDate } = formatDate(booking.dateTime);
        const endTime = calculateEndTime(startDate, booking.duration);
        const participantCount = booking.participants ? booking.participants.length : 0; // Count participants
      
        return (
          <div className='pending-card' key={booking._id}>
            <p className='first'>{formattedDate} <br /><span className= "d-time"> {formattedTime} - {endTime}</span></p>
            <p className='sec'>{booking.bannerTitle} <br /><span className="people">You and {participantCount - 1} others</span></p>
            <p className='third' onClick={() => handleShowParticipants(booking)}><Users size={18} />&nbsp;&nbsp;{participantCount}&nbsp;&nbsp;People</p> {/* Display participant count */}
          </div>
        );
      })}
      {showPopup && participants.length > 0 && (
       <div className="popup">
          <div className="popup-content">
            <div>
              <h3>Participants {participants.length}</h3>
              <div>
                <button onClick={() => (selectedBookingId, 'rejected')} className='reject'><Ban size={18} color='white'/>&nbsp;&nbsp;Reject</button>
                <button onClick={() => (selectedBookingId, 'accepted')} className='accept'><Check size={18} color='white'/>&nbsp;&nbsp;Accept</button>
              </div>
            </div>
              <ul>
                {participants.map((participant, index) => (
                <li key={index}>{participant.fullName || "Unknown"} <input type="checkbox" /></li> ))}
              </ul>
          </div>
        </div>)}
    </div>
  )
}
