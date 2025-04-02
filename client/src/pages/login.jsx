import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Sideimg from '../assets/Frame.png'
import Logo from '../assets/logo.png'
import  '../styles/login.css'

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
            username : "",
            password : "",
    
        })
        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/user/login`,
                    formData,
                    { headers: { "Content-Type": "application/json" } }
                );
        
                alert("login successful");
                const token = res.data.token;
                localStorage.setItem("authToken", token);
                navigate('/dashboard'); // Store in localStorage
            } catch (error) {
                console.error("Error:", error);
                alert(`login failed: ${error.response?.data?.message || "Unknown error"}`);
            }
          };
  return (
    <div className='mainContainer'>
        <div className='containerLeft'>
                    <div className='logo'><img src={Logo} alt="" /></div>
                    <form onSubmit={handleSubmit}>
                        <h1 >Sign in</h1>

                        <input className='input' onChange={(event) =>setFormdata((prev) => {
                            return{
                                ...prev,
                                username : event.target.value
                            }
                        })} value={formData.username} type="text" placeholder='username'/>
                        
                            <input className='input' onChange={(event) =>setFormdata((prev) => {
                            return{
                                ...prev,
                                password : event.target.value
                            }
                        })} value={formData.password} type="password" placeholder='password'/>

                        <button type='submit'>Log in</button>
                        <p>Don't have an account? <a href="/register">Sign Up</a></p>
                    </form>
                   <p>This site is protected by reCAPTCHA and the <a href="#">Google Privacy Policy</a> and <a href="#">Terms of Service</a> apply. </p>
                </div>
        <div className='containerRight'>
            <img src={Sideimg} alt="" />
        </div>
    </div>
  )
}
