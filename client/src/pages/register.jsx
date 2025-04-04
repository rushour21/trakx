import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Sideimg from '../assets/Frame.png'
import Logo from '../assets/logo.png'

import '../styles/register.css'


export default function register() {

    const [formData, setFormdata] = useState({
        firstname : "",
        lastname : "",
        email : "",
        password :"",
        confirmPassword : "",

    })

    const navigate = useNavigate(); 
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user/register`,
            formData,
            { headers: { "Content-Type": "application/json" } }
        );
        console.log("Full Response:", res); // Debug: Log full response
        console.log("User ID:", res.data?.userId); // Log user ID
        alert("Registration successful");

        if (res.data?.userId) {
            localStorage.setItem("userId", res.data.userId);
            navigate('/preference');
        } else {
            console.error("User ID not found in response");
            alert("Registration failed: User ID not received");
        }
    } catch (error) {
        console.error("Error:", error);
        alert(`Registration failed: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className='mainContainer_r'>
        <div className='containerLeft_r'>
            <div className='logo'><img src={Logo} alt="" /></div>
            <form onSubmit={handleSubmit}>
                <div><span className='formTitle'>Create an account</span><a href="/login">Sign in instead</a></div>
                <label>Firstname
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        firstname : event.target.value
                    }
                })} value={formData.firstname} type="text"/>
                </label>
                
                <label>Last Name
                    <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        lastname : event.target.value
                    }
                })} value={formData.lastname} type="text"/>
                </label>

                <label >Email
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        email : event.target.value
                    }
                })} value={formData.email} type="text" />
                </label>

                <label >Password
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        password : event.target.value
                    }
                })} value={formData.password} type="text"/>
                </label>

                <label >Confirm Password
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        confirmPassword : event.target.value
                    }
                })} value={formData.confirmPassword} type="text" />
                </label>

            <label id='checkboxx'>
                <input type="checkbox" />
                    <span>   By creating an account, I agree to our terms of use and privacy policy</span> 
            </label>
                <button type='submit'>Create an Account</button>
            </form>
           <p>This site is protected by reCAPTCHA and the <a href="#">Google Privacy Policy</a> and <a href="#">Terms of Service</a> apply. </p>
        </div>
        <div className='containerRight_r'>
            <img src={Sideimg} alt="" />
        </div>
    </div>
  )
}
