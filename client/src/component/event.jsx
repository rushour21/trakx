import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef} from 'react'
import { Trash2, PencilLine, Copy } from 'lucide-react';
import axios from 'axios';
import "../styles/event.css"
import { toast } from 'react-toastify';

export default function Event() {
  const [bookings, setBookings] = useState([]);
  const [toggles, setToggles] = useState({});
  const fetched = useRef(false); //Prevents duplicate API calls
  const navigate = useNavigate();

  useEffect(() => {
    if (fetched.current) return; //Prevents second call
    fetched.current = true;

    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return; 

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/booking/my-events`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log("API Response:", res.data); 
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchBooking();
  }, []);

   // Format date and time for display
   const formatDate = (date) => {
    const startDate = new Date(date);
  
    // Format the date to "Day, DD Month" (e.g., "Friday, 28 Feb")
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDate = startDate.toLocaleDateString('en-US', options);
  
    const formattedTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // HH:mm
    return { formattedDate, formattedTime, startDate };
  };

  // Function to get the end time based on the start time and duration
  const calculateEndTime = (startDate, duration) => {
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + duration); // Add duration to start time
    const formattedEndTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // HH:mm
    return formattedEndTime;
  };

    // Function to handle copying meeting link
    const handleCopy = (meetingLink) => {
      // Copy the meeting link to the clipboard
      navigator.clipboard.writeText(meetingLink).then(() => {
        // Optionally, alert the user that the link was copied
        toast.success('Copied to clipboard');
      }).catch((err) => {
        console.error('Error copying text: ', err);
      });
    };

    const handleDelete = async (bookingId) => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
  
        // Send DELETE request to the server
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/booking/booking-d/${bookingId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
  
        // After successful deletion, update the bookings state to remove the deleted booking
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
        toast.success('Meeting deleted successfully!');
      } catch (error) {
        console.error("Error deleting the event:", error);
        alert('Failed to delete the meeting');
      }
    };

    const handleToggleChange = (bookingId) => {
      setToggles((prev) => ({
        ...prev,
        [bookingId]: !prev[bookingId],
      }));
    };

  return (
    <div className="main-container">
      <div className="header">
        <h2>Event Types</h2>
        <p>Create events to share for people to book on your calendar. <br />New</p>
        <button className='create-button' onClick={() => navigate('/dashboard/create')} >+ Add ne event</button>
      </div>
      <div className='card-container'>
      {bookings.length > 0 && bookings.map ((booking, index) => {
          const { formattedDate, formattedTime, startDate } = formatDate(booking.dateTime);
          const endTime = calculateEndTime(startDate, booking.duration);

          const meetingLink = booking.formData?.meetingLink;
          const toggleId = `toggle-${index}`;

          return(
          <div key={booking._id} className={`booking-card ${toggles[booking._id] ? 'gray-bg' : 'booking-card'}`}>
            <div className='card-content'>
              <div className='banner-title'>{booking.bannerTitle}<PencilLine size={18}/> </div>
              
              <div className='info'>
                  <p className='date'>{formattedDate}</p>
                  <p className='time'> {formattedTime} - {endTime}</p>
                  <p className='duration'>{booking.duration} min, Group Meeting</p>
              </div>
              <hr />
              <div className='footer'>
              <input
                    id={toggleId}
                    type="checkbox"
                    className='toggle-input'
                    checked={toggles[booking._id] || false}
                    onChange={() => handleToggleChange(booking._id)}
                  />
                <label htmlFor={toggleId} className='toggle-label'></label>
                <Copy size={18} onClick={() => handleCopy(meetingLink)}/>
                <Trash2 size={18} onClick={() => handleDelete(booking._id)}/>
              </div>
            </div>
          </div>)})}
      </div> 
    </div>
  )
}
