import React, { useState } from 'react'
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
    const handleSubmit = async (event) =>{
        event.preventDefault()
    }
  return (
    <div className='mainContainer_r'>
        <div className='containerLeft_r'>
            <div className='logo'><img src={Logo} alt="" /></div>
            <form onSubmit={handleSubmit}>
                <div><span className='formTitle'>Create an account</span><a href="#">Sign in instead</a></div>
                <label>Firstname
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        FirstName : event.target.value
                    }
                })} value={formData.FirstName} type="text"/>
                </label>
                
                <label>Last Name
                    <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        LastName : event.target.value
                    }
                })} value={formData.LastName} type="text"/>
                </label>

                <label >Email
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        Email : event.target.value
                    }
                })} value={formData.Email} type="text" />
                </label>

                <label >Password
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        Password : event.target.value
                    }
                })} value={formData.Password} type="text"/>
                </label>

                <label >Confirm Password
                <input className='input' onChange={(event) =>setFormdata((prev) => {
                    return{
                        ...prev,
                        Mobile : event.target.value
                    }
                })} value={formData.ConfirmPassword} type="text" />
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
