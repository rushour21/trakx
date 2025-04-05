import React from 'react'
import { useEffect, useState, useRef } from "react";
import {Ban, Check, Users  } from 'lucide-react';
import axios from "axios";
import  '../../styles/past.css'

export default function past() {

  const [bookings, setBookings] = useState([]);
  const [userEmail, setuserEmail] = useState();
    const fetched = useRef(false); // Prevents duplicate API calls
  
    useEffect(() => {
      if (fetched.current) return; // Prevents second call
      fetched.current = true;
  
      const fetchBooking = async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) return; 
  
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/booking/past`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
  
          console.log("API Response:", res.data); 
          setBookings(res.data.meetings || []); // Extract meetings array
          setuserEmail(res.data.userEmail)
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

  const getUserStatus = (participants) => {
    const user = participants.find((participant) => participant.email === userEmail);
    return user ? user.status : null;
  };

  const handleStatusChange = async (meetingId, status) => {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        console.log("Updating status for meeting:", meetingId, "with status:", status);

        const res = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/booking/past/${meetingId}`,
            { statustoupdate: status },
            {
                headers: {
                    Authorization: token,
                },
            }
        );

        if (res.status === 200) {
            console.log("Status updated successfully", res.data);
            toast.info(`Booking ${status}`);

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking._id === meetingId
                        ? {
                            ...booking,
                            participants: booking.participants.map((participant) =>
                                participant.email === userEmail ? { ...participant, status: status } : participant
                            ),
                        }
                        : booking
                )
            );
        } else {
            console.error("Failed to update status", res);
        }
    } catch (error) {
        console.error("Error updating the booking status:", error);
    }
};

  return (
    <div className='past-list'>
      {bookings.map((booking) => {
        const { formattedDate, formattedTime, startDate } = formatDate(booking.dateTime);
        const endTime = calculateEndTime(startDate, booking.duration);
        const participantCount = booking.participants ? booking.participants.length : 0; // Count participants
        const userStatus = getUserStatus(booking.participants);
          
        return (
          <div className='past-card' key={booking._id}>
              <p className='first'>{formattedDate} <br /><span className= "d-time"> {formattedTime} - {endTime}</span></p>
              <p className='sec'>{booking.bannerTitle} <br /><span className="people">You and {participantCount - 1} others</span></p>
              <div className='buttons'>
              {userStatus === 'pending' && (
                <>
                  <button onClick={() => handleStatusChange(booking._id, 'rejected')} className='reject'><Ban size={18} color='white'/>&nbsp;&nbsp;Reject</button>
                  <button onClick={() => handleStatusChange(booking._id, 'accepted')} className='accept'><Check size={18} color='white'/>&nbsp;&nbsp;Accept</button>
                </>
              )}
              {userStatus === 'accepted' && <p className='status-acc'>Accepted</p>}
              {userStatus === 'rejected' && <p className='status-rej'>Rejected</p>}
              </div>
               <p><Users size={18} />&nbsp;&nbsp;{participantCount}&nbsp;&nbsp;People</p> 
          </div>
          );
      })}
    </div>
  )
}
