import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Plus, X, Copy } from 'lucide-react';

import '../../styles/availabilityView.css';

export default function AvailabilityView() {
    const [timezone, setTimezone] = useState('');
    const [schedule, setSchedule] = useState({
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    });

    useEffect(() => {
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    useEffect(() => {
        // Send schedule updates whenever schedule changes
        if (timezone) {
            sendScheduleUpdate();
        }
    }, [schedule]);

    const sendScheduleUpdate = async () => {
        try {

            const token = localStorage.getItem("authToken");
            if (!token) return;

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/availability/add`, 
            {
                availability :schedule,
                timeZone : timezone
            },
            {
                headers: {
                    Authorization: token, // Add token to headers
                    "Content-Type": "application/json",
                }
            });

            console.log('Schedule updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    };

    const handleDayToggle = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].length > 0 ? [] : [{ startTime: '', endTime: '' }]
        }));
    };

    const addTimeSlot = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: [...prev[day], { startTime: '', endTime: '' }]
        }));
    };

    const removeTimeSlot = (day, index) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const updateTimeSlot = (day, index, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            )
        }));
    };

    return (
        <div className='container-m'>
            <div className='form-header'>
                <p>Activity</p>
                <div className='timezone'>
                    <p>TimeZone</p>
                    <a href="#">{timezone}</a>
                </div>
            </div>
            <div className='content'>
                <p>Weekly hours</p>
                <div className="schedule-list">
                    {Object.entries(schedule).map(([day, timeSlots]) => (
                        <div key={day} className="day-row">
                            <div className="day-label">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={timeSlots.length > 0}
                                        onChange={() => handleDayToggle(day)}
                                    />
                                    <span>&nbsp;&nbsp;{day}</span>
                                </label>
                            </div>
                            {timeSlots.length === 0 ? (
                                <div className="unavailable">Unavailable</div>
                            ) : (
                                <div className="time-slots">
                                    {timeSlots.map((slot, index) => (
                                        <div key={index} className="time-slot">
                                            <input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) => updateTimeSlot(day, index, 'startTime', e.target.value)}
                                            />
                                            <span>-</span>
                                            <input
                                                type="time"
                                                value={slot.endTime}
                                                onChange={(e) => updateTimeSlot(day, index, 'endTime', e.target.value)}
                                            />                                            
                                            <X size={12} onClick={() => removeTimeSlot(day, index)} />                                           
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="time-slot-actions">
                                <Plus size={10} onClick={() => addTimeSlot(day)} />
                                <Copy size={10} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
