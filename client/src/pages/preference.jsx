import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Sideimg from '../assets/Frame.png'
import Logo from '../assets/logo.png'
import  '../styles/preference.css'
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); 

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
 
  const handleClick = async () => {
    if (!username || !selectedCategory) return;
  
    setIsSubmitting(true);
    
    let userId;
    try {
      userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found in local storage.");
    } catch (error) {
      alert("Failed to retrieve user ID. Please log in again.");
      setIsSubmitting(false);
      return;
    }
  
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/user/preference/${userId}`;
    console.log("API URL:", apiUrl);
  
    try {
      const response = await axios.post(
        apiUrl,
        { username, preference : selectedCategory },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const token = res.data.token;
      localStorage.setItem("authToken", token);
      toast.success("Saved now ")
      console.log("Server Response:", response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error("Full error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='mainContainer_p'>
      <div className='containerLeft_p'>
        <div className='logo_p'><img src={Logo} alt="" /></div>
        <div className='form_p'>
            <h1 >Your Preference</h1>
            <input className="input-field" type="text" placeholder="Tell us your username" value={username} 
                onChange={(e) => setUsername(e.target.value)}/>
            <p className=".category-text">Select one category that best describes your CNNCT:</p>
            <div className="categories-grid">
              {categories.map((category) => (
              <button
                key={category.name}
                className={`category-btn ${selectedCategory === category.name ? "selected" : ""}`}
                onClick={() => setSelectedCategory(category.name)}>
              <span className="icon">{category.icon}</span> {category.name}
              </button>
              ))}
            </div>
            <button className="continue-btn" disabled={!username || !selectedCategory}
            onClick={handleClick}>
              Continue
            </button>
        </div>
      </div>
      <div className='containerRight'>
            <img src={Sideimg} alt="" />
      </div>
    </div>
  )
}
