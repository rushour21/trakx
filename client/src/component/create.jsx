import React, { useState } from "react";
import { useForm } from "react-hook-form";
import iconpic from '../assets/profileicon.png'
import TimezoneSelect from "react-timezone-select";
import { PencilLine} from 'lucide-react';
import '../styles/create.css';
import axios from "axios";

const BookingForm = () => {
   const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
   const [banarcolor, setBanarcolor] = useState("#EF6500");
   const { register, handleSubmit, setValue, getValues } = useForm();
   const [editable, setEditable] = useState(false)
  const [step, setStep] = useState(1);

   // Function to format date and time into ISO 8601 format
   const formatDateTime = (date, time) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}:00.000Z`).toISOString();
  };

  const convertDurationToMinutes = (duration) => {
    if (duration.includes("hour")) {
      let [hours, minutes] = [0, 0];
      const hourMatch = duration.match(/(\d+)\s*hour/);
      const minMatch = duration.match(/(\d+)\s*min/);
  
      if (hourMatch) hours = parseInt(hourMatch[1]) * 60;
      if (minMatch) minutes = parseInt(minMatch[1]);
  
      return hours + minutes;
    } else if (duration.includes("min")) {
      return parseInt(duration);
    }
    return 0;
  };

  const onSubmit = async (data) => {
    const formattedDateTime = formatDateTime(data.date, data.time);
    
    if (!formattedDateTime) {
      console.error("Invalid date/time");
      return;
    }
    const durationInMinutes = convertDurationToMinutes(data.duration);

    const updatedData = {
      ...data,
      timeZone: selectedTimezone,
      dateTime: formattedDateTime, // Store in required format
      duration: String(durationInMinutes), // Converted to minutes
    };

    console.log("Submitted Data:", updatedData);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/booking/bookingr`,
          updatedData,
          { headers: {
            "Content-Type": "application/json",
            Authorization: token // Add token directly
          } }
      );
      console.log("Full Response:", res);
        alert("meeting created");
    } catch (error) {
      console.error("Error submitting data:", error);
    alert("not available at this time");
    }

  };

  const handleColorChange = (color) => {
    setBanarcolor(color);
    setValue("bannerColor", color); // Update form state
  };

  return (
    <div className="main-container">
      <div className="header">
        <h2>Create Event</h2>
        <p>Create events to share for people to book on your calendar. <br />
        New</p>
      </div>
      <div className="content-c">
        <h2>Add Event</h2>
        <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (<>
          <div className="form-1">
            <div className="form-group">
              <label>Event Topic *</label>
              <input type="text" placeholder="Set a conference topic before it starts" {...register("eventTopic", {required : true})} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Password" {...register("password", {required : true})} />
            </div>

            <div className="form-group">
              <label>Host Name *</label>
              <input type="text" placeholder="Sarthak Pal" {...register("hostName")} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea {...register("description")} placeholder="Add a description..." />
            </div>
          </div>
          <div className="form-2">
            <div className=" date-time">
              <label>Date and Time *</label>
              <div className="date-time-inputs">
                <input type="date" {...register("date", { required: true })} />
                <input type="time" {...register("time", { required: true })} />
                <TimezoneSelect
                    className="timezone"
                    value={selectedTimezone}
                    onChange={setSelectedTimezone}
                  />
              </div>
            </div>

            <div className="duration">
              <label>Set Duration</label>
              <select {...register("duration", {required : true})}>
                <option value="1 hour">1 hour</option>
                <option value="30 min">30 min</option>
                <option value="2 hours">2 hours</option>
              </select>
            </div>
            <div className="buttons">
              <button className="cancel">Cancel</button>
              <button className="next" onClick={() => setStep(2)}>Next</button>
            </div>
          </div> </>)}
          {step === 2 && (<>
            <div className="form-3">
              <p>Banner</p>
              <div className="baner">
                <img src={iconpic} />
                <PencilLine size={18} color={'white'} className="pencile" onClick={() => setEditable(true)}/>
                <input type="text"  value={editable ? undefined : "Team A Meeting-1"} {...register("bannerTitle")}/>
              </div>
              <div className="colors">
                <p>Custom Background Color</p>
                <div className="color-icon">
                  <div style={{backgroundColor:"#EF6500", width : "25px", height: "25px", borderRadius:"50%", border:"1px solid gray"}}
                        onClick={() => handleColorChange("#EF6500")}
                  ></div>
                  <div style={{backgroundColor:"#FFFFFF", width : "25px", height: "25px", borderRadius:"50%", border:"1px solid gray"}}
                       onClick={() => handleColorChange("#FFFFFF")}
                  ></div>
                  <div style={{backgroundColor:"#000000", width : "25px", height: "25px", borderRadius:"50%", border:"1px solid gray"}}
                        onClick={() => handleColorChange("#000000")}
                  ></div>
                </div>
              </div>
              <div className="selected-color">
                <div style={{backgroundColor:banarcolor, width : "25px", height: "25px", borderRadius:"5px", border:"1px solid gray"}}></div>
                <input  type="text" value={banarcolor} {...register("bannerColor")}/>
              </div>
            </div>
            <div className="form-4">
              <div className="link">
                <label>Add Link *</label>
                <input type="text" placeholder="Enter URL Here" {...register("meetingLink")} required />
              </div>
              <div className="add-email">
                <label>Add Emails *</label>
                <input type="text" placeholder="Add member Emails" {...register("allowedUser")} required />
              </div>
              <div className="buttons-2">
                <button style={{backgroundColor:"#F3F3F1", color:"black" }} onClick={() => setStep(1)}>Back</button>
                <button type="submit" style={{backgroundColor:"#1877F2", color:"white" }}>Save</button>
              </div>
            </div>
          </>)}
        </form>
      </div>
    </div>
  );
};

export default BookingForm;