import React, { useEffect, useState, useRef } from "react";
import { Users  } from 'lucide-react';
import axios from "axios";
import  '../../styles/upcoming.css'

export default function Upcoming() {
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
          `${import.meta.env.VITE_API_URL}/api/booking/upcoming`,
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

  return (
    <div className='list-container'>
      {bookings.map((booking) => {
          const { formattedDate, formattedTime, startDate } = formatDate(booking.dateTime);
          const endTime = calculateEndTime(startDate, booking.duration);
          const participantCount = booking.participants ? booking.participants.length : 0; // Count participants

          return (
            <div className='up-card' key={booking._id}>
              <div className='left'>
                <p>{formattedDate} <br /><span className= "d-time"> {formattedTime} - {endTime}</span></p>
                <p >{booking.bannerTitle} <br /><span className="people">You and {participantCount - 1} others</span></p>
              </div>
              <div className='right'>
                <p className='status'>Accepted</p>
                <p><Users size={18} />&nbsp;&nbsp;{participantCount}&nbsp;&nbsp;People</p> {/* Display participant count */}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
