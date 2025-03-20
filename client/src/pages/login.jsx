
import React, { useState } from 'react'
import Sideimg from '../assets/Frame.png'
import Logo from '../assets/logo.png'
import  '../styles/login.css'

export default function Login() {
    const [formData, setFormdata] = useState({
            userName : "",
            password : "",
    
        })
        const handleSubmit = async (event) =>{
            event.preventDefault()
        }
  return (
    <div className='mainContainer'>
        <div className='containerLeft'>
                    <div className='logo'><img src={Logo} alt="" /></div>
                    <form onSubmit={handleSubmit}>
                        <h1 >Sign in</h1>

                        <input className='input' onChange={(event) =>setFormdata((prev) => {
                            return{
                                ...prev,
                                userName : event.target.value
                            }
                        })} value={formData.userName} type="text" placeholder='username'/>
                        
                            <input className='input' onChange={(event) =>setFormdata((prev) => {
                            return{
                                ...prev,
                                password : event.target.value
                            }
                        })} value={formData.password} type="text" placeholder='password'/>

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
