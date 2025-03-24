
import React, { useState } from 'react'
import Sideimg from '../assets/Frame.png'
import Logo from '../assets/logo.png'
import  '../styles/preference.css'

export default function Login() {
    const [username, setUsername] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { name: "Sales", icon: "🏢" },
        { name: "Finance", icon: "💼" },
        { name: "Consulting", icon: "📄" },
        { name: "Tech", icon: "💻" },
        { name: "Education", icon: "📚" },
        { name: "Government & Politics", icon: "⚖️" },
        { name: "Recruiting", icon: "📊" },
        { name: "Marketing", icon: "🚀" },
  ];
        const handleSubmit = async (event) =>{
            event.preventDefault()
        }
  return (
    <div className='mainContainer'>
        <div className='containerLeft'>
                    <div className='logo'><img src={Logo} alt="" /></div>
                    <div>
                        <h1 >Your Preference</h1>

                        <input type="text" placeholder="Tell us your username" value={username} 
                        onChange={(e) => setUsername(e.target.value)} className=""/>
                        
                        <p className="">Select one category that best describes your CNNCT:</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {categories.map((category) => (
                                <button
                                    key={category.name}
                                    className={`flex items-center justify-center p-3 border rounded-lg transition-all text-sm font-medium ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="mr-2">{category.icon}</span> {category.name}
            </button>
          ))}
        </div>
                        <button type='submit'>Log in</button>
                        <p>Don't have an account? <a href="/register">Sign Up</a></p>
                    </div>
                   <p>This site is protected by reCAPTCHA and the <a href="#">Google Privacy Policy</a> and <a href="#">Terms of Service</a> apply. </p>
                </div>
        <div className='containerRight'>
            <img src={Sideimg} alt="" />
        </div>
    </div>
  )
}
