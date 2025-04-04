import React from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png'
import screen1 from "../assets/screen 1.png"
import screen2 from "../assets/screen 3.png"
import screen3 from "../assets/screen 4.png"
import img1 from "../assets/Audiomack.png"
import img2 from "../assets/a.png"
import img3 from "../assets/i.png"
import img4 from "../assets/n.png"
import img5 from "../assets/e.png"
import img6 from "../assets/c.png"
import img7 from "../assets/h.png"
import img8 from "../assets/g.png"
import img9 from "../assets/k.png"
import "../styles/home.css"



export default function home() {
    const navigate = useNavigate();
    const testimonials = [
        {
          id: 1,
          title: "Amazing tool! Saved me months",
          description: "This is a placeholder for your testimonials and what your client has to say, put them here and make sure it's 100% true and meaningful.",
          name: "John Master",
          designation: "Director, Spark.com",
        },
        {
          id: 2,
          title: "Amazing tool! Saved me months",
          description: "This is a placeholder for your testimonials and what your client has to say, put them here and make sure it's 100% true and meaningful.",
          name: "John Master",
          designation: "Director, Spark.com",
        },
        {
          id: 3,
          title: "Amazing tool! Saved me months",
          description: "This is a placeholder for your testimonials and what your client has to say, put them here and make sure it's 100% true and meaningful.",
          name: "John Master",
          designation: "Director, Spark.com",
        },
        {
          id: 4,
          title: "Amazing tool! Saved me months",
          description: "This is a placeholder for your testimonials and what your client has to say, put them here and make sure it's 100% true and meaningful.",
          name: "John Master",
          designation: "Director, Spark.com",
        }
      ];

      const appdata = [
        {
            id: 1,
            title: "Audiomack",
            description: "Add an Audiomack player to your Linktree",
            icon: img1
        },
        {
            id: 2,
            title: "Bandsintown",
            description: "Drive ticket sales by listing your events",
            icon: img4
        },
        {
            id: 3,
            title: "Bonfire",
            description: "Display and sell your custom merch",
            icon: img7
        },
        {
            id: 4,
            title: "Books",
            description: "Promote books on your Linktree",
            icon: img2
        },
        {
            id: 5,
            title: "Buy Me A Gift",
            description: "Let visitors support you with a small gift",
            icon: img5
        },
        {
            id: 6,
            title: "Cameo",
            description: "Make impossible fan connections possible",
            icon: img8
        },
        {
            id: 7,
            title: "Clubhouse",
            description: "Let your community in on the conversation",
            icon: img3
        },
        {
            id: 8,
            title: "Community",
            description: "Build an SMS subscriber list",
            icon: img6
        },
        {
            id: 9,
            title: "Contact Details",
            description: "Easily share downloadable contact details",
            icon: img9
        }
    ];
    const footerLinks = [
        "About CNNCT",
        "Blog",
        "Press",
        "Social Good",
        "Contact",
        "Careers",
        "Getting Started",
        "Features and How-Tos",
        "FAQs",
        "Report a Violation",
        "Terms and Conditions",
        "Privacy Policy",
        "Cookie Notice",
        "Trust Center"
    ];

  return (<>
    <div className='landing-page'>
        <div className='home-header '>
            <img src={Logo} alt="" />
            <button className='signup-button' onClick={() => navigate('/register')}>Sign up free</button>
        </div>
        <h1 className='title1'>CNNCT – Easy <br />Scheduling Ahead</h1>
        <button className='signup-button'onClick={() => navigate('/register')}>Sign up free</button>
        <img className='screen-img ' src={screen1} alt="" />
        <h2>Simplified scheduling for you and your team</h2>
        <p className='title1'>CNNCT eliminates the back-and-forth of scheduling meetings so you can focus on what matters. 
            Set your availability, share your link, <br /> and let others book time with you instantly.</p>
        <div className='h-info'>
            <div className='info-content'>
                <h2>Stay Organized with Your <br /> Calendar & Meetings</h2>
                <ul>
                    <p>Seamless Event Scheduling</p>
                    <li>View all your upcoming meetings and appointments in one place.</li>
                    <li>Syncs with Google Calendar, Outlook, and iCloud to avoid conflicts</li>
                    <li>Customize event types: one-on-ones, team meetings, group <br /> sessions, and webinars.</li>
                </ul>
            </div>
            <div className='comb-img'>
                    <img className='screen-img1' src={screen3} alt="" />
                    <img  className='screen-img2'src={screen2} alt="" />
            </div>
        </div>
        <div className='info-bar'>
            <div>
                <h1>Here's what our <span style={{ color: "#1877F2"}}>customer</span> <br /> has to says</h1>
                <button 
                style={{ backgroundColor:'white',
                         color:"#1877F2",
                         width: "170px",
                         height: "35px",
                         border: "2px solid #1877F2",
                         borderRadius:"40px"
                }}>
                Read customer stories</button>
            </div>
            <div>
                <p><i class="fa-solid fa-star-of-life" style={{color: "#3c73d3",}}></i> One-on-ones, team meetings, group <br /> sessions, and webinars.</p>
            </div>
        </div>
        <div className='review-cards'>
            {testimonials.map((review) => (
                <div key={review.id} className='r-card'>
                    <p style={{ fontSize:"18px"}}>{review.title}</p>
                    <p>{review.description}</p>
                    <div className='r-car-1'>
                        <div className='blue-dott'></div>
                        <div>
                            <p>{review.name}</p>
                            <p>{review.designation}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <h1>All Link Apps and Integrations</h1>
        <div className='app-list'>
            {appdata.map((app) => (
                <div className='app-card'>
                    <img className='app-icon' src={app.icon} alt="" />
                    <div><p>{app.title}</p><p style={{ fontSize:"13px"}}>{app.description}</p></div>
                </div>
                
            ))} 
        </div>
        <div className='h-footer'>
            <div className='f1'>
                <div><button style={{width: "70px", height:"5vh"}} onClick={() => navigate('/login')}>Lg In</button> <button onClick={() => navigate('/register')} className='signup-button'>Sign up free</button></div>
                <div className='fo-links'>
                    {footerLinks.map((link, index) => (
                    <p key={index}>{link}</p>
                    ))}
                </div>
            </div>
            <div className='h-bottom'>
                <p>We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri <br />
                     people of the Kulin Nation, and pay our respects to Elders past, present and emerging.</p>
                <div className='h-icons'>
                <i class="fa-brands fa-twitter fa-2xl"></i>
                <i class="fa-brands fa-square-instagram fa-2xl"></i>
                <i class="fa-brands fa-youtube fa-2xl"></i>
                <i class="fa-brands fa-tiktok fa-2xl"></i>
                <i class="fa-solid fa-cube fa-2xl"></i>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
