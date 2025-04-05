import React, { useState } from 'react'
import axios from 'axios';
import '../styles/setting.css'
import { toast } from 'react-toastify';

export default function setting() {

  const [formData, setFormdata] = useState({
          firstname : "",
          lastname : "",
          email : "",
          password :"",
          confirmPassword : "",
  
      })

      const handleSubmit = async (event) => {
          event.preventDefault();
          // Ensure both password fields are filled together
          if ((formData.password && !formData.confirmPassword) || 
          (!formData.password && formData.confirmPassword)) {
          return alert("Please enter both password and confirm password!");
          }

          // Check if passwords match
          if (formData.password && formData.password !== formData.confirmPassword) {
              return alert("Passwords do not match!");
          }
          const token = localStorage.getItem('authToken');
          console.log("Retrieved Token:", token);
          if (!token) {
              alert('You are not logged in. Please log in again.');
              return;
          }

          try {
              // Send PUT request using Axios
              const res = await axios.put( `${import.meta.env.VITE_API_URL}/api/user/profile`, {
                  firstname: formData.firstname,
                  lastname: formData.lastname,
                  email: formData.email,
                  password: formData.password // Only send password if provided
              },
              {
                headers: {
                  Authorization: ` ${token}` // Add token directly
                }
            });
              console.log("Full Response:", res);
              toast.success("Profile updated successfully!");
          } catch (error) {
            console.error("Error updating profile:", error.response ? error.response.data : error.message);
              toast.error("Failed to save");
          }
        }
  return (
    <div className="container">
      <div className="header">
              <h2>Profile</h2>
              <p>Manage settings for your profile</p>
      </div>
      <div className='profileContainer'>
        <div className='edit'><p>Edit Profile</p></div>
          <form className='edit-form' onSubmit={handleSubmit}>
            <label>Firstname </label>
              <input className='input' onChange={(event) =>setFormdata((prev) => {
                return{
                    ...prev,
                    firstname : event.target.value
                    }
              })} value={formData.firstname} type="text"/>
            <label>Last Name</label>
              <input className='input' onChange={(event) =>setFormdata((prev) => {
                  return{
                      ...prev,
                      lastname : event.target.value
                    }
              })} value={formData.lastname} type="text"/>
            
            <label >Email</label>
              <input className='input' onChange={(event) =>setFormdata((prev) => {
                  return{
                      ...prev,
                      email : event.target.value
                    }
              })} value={formData.email} type="text" />
            
            <label >Password</label>
              <input className='input' onChange={(event) =>setFormdata((prev) => {
                  return{
                      ...prev,
                      password : event.target.value
                    }
              })} value={formData.password} type="text"/>
            
            <label >Confirm Password </label>
              <input className='input' onChange={(event) =>setFormdata((prev) => {
                  return{
                      ...prev,
                      confirmPassword : event.target.value
                    }
              })} value={formData.confirmPassword} type="text" />
            
            <button type='submit'>Save</button>
          </form>
      </div>

    </div>
  )
}
