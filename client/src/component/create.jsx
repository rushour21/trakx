import React, { useState } from "react";
import { useForm } from "react-hook-form";
import '../styles/create.css';

const BookingForm = () => {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1);

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="main-container">
      <div className="header">
        <h2>Add Event</h2>
      </div>
      <div className="eventform">
        {step === 1 && (
          <>
            <h2>Add Event</h2>
            <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
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

              <div className=" date-time">
                <label>Date and Time *</label>
                <div className="date-time-inputs">
                  <input type="date" {...register("date", {required : true})} />
                  <input type="time" {...register("time")} />
                  <select {...register("timeZone")}>
                    <option>(UTC +5:00 Delhi)</option>
                  </select>
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

              <div className="button-container">
                <button type="button" onClick={() => setStep(2)}>Next</button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Add Event</h2>
            <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="banner-container">
                <p>Banner</p>
                <div className="banner-placeholder">Team A Meeting-1</div>
                <p>Custom Background Color</p>
                <div className="color-options">
                  <div style={{ backgroundColor: 'orange' }}></div>
                  <div style={{ backgroundColor: 'black' }}></div>
                  <div style={{ backgroundColor: '#000000' }}></div>
                </div>
              </div>

              <div className="form-group">
                <label>Add Link *</label>
                <input type="url" placeholder="Enter URL Here" {...register("eventLink")} required />
              </div>

              <div className="form-group">
                <label>Add Emails *</label>
                <input type="text" placeholder="Add member Emails" {...register("emails")} required />
              </div>

              <div className="button-container">
                <button type="button" onClick={() => setStep(1)}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingForm;