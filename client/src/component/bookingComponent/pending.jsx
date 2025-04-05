import React from 'react'
import { useEffect, useState, useRef } from "react";
import {Ban, Check, Users, CircleUser } from 'lucide-react';
import axios from "axios";
import  '../../styles/pending.css'
import { toast } from 'react-toastify';

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
    setShowPopup(!showPopup); // Show popup
  };
  console.log(participants);

  const handleStatusChange = async (id, status) => {
    if (!id) return console.error("No booking ID found!");
  
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("Unauthorized!");
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/booking/pending/updateStatus`,
        { bookingId: id, status: status },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        toast.info(`Booking ${status}`);
        
        // Update UI by filtering out the updated booking
        setBookings((prev) =>
          prev.filter((booking) => booking._id !== id)
        );
        setShowPopup(false); // Close the popup
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update booking status!");
    }
  };
  

  return (
    <div className='pending-list'>
      {bookings.map((booking) => {
        const { formattedDate, formattedTime, startDate } = formatDate(booking.dateTime);
        const endTime = calculateEndTime(startDate, booking.duration);
        const participantCount = booking.participants ? booking.participants.length : 0; // Count participants
      
        return (
          <div className='pending-card' key={booking._id} onClick={() => handleShowParticipants(booking)}>
            <p className='first'>{formattedDate} <br /><span className= "d-time"> {formattedTime} - {endTime}</span></p>
            <p className='sec'>{booking.bannerTitle} <br /><span className="people">You and {participantCount - 1} others</span></p>
            <p className='third' ><Users size={18} />&nbsp;&nbsp;{participantCount}&nbsp;&nbsp;People</p> {/* Display participant count */}
          </div>
        );
      })}
      {showPopup && participants.length > 0 && (
       <div className="popup">
          <div className="popup-content">
            <div className='popupheader'>
              <p>Participants ({participants.length})</p>
              <div className='popup-buttons'>
                <button onClick={() => handleStatusChange(selectedBookingId, 'rejected')} className='reject'><Ban size={18} color='white'/>&nbsp;&nbsp;Reject</button>
                <button onClick={() => handleStatusChange(selectedBookingId, 'accepted')} className='accept'><Check size={18} color='white'/>&nbsp;&nbsp;Accept</button>
              </div>
            </div>
              <ul className='list'>
                {participants.map((participant, index) => (
                <li key={index}><p className='user-list'><CircleUser /> {participant.fullName || "Unknown"}</p> <input className="participant-checkbox"  type="checkbox" checked={participant.status === 'accepted'} readOnly /></li> ))}
              </ul>
          </div>
        </div>)}
    </div>
  )
}
