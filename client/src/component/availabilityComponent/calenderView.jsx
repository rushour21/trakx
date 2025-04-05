import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import '../../styles/calenderView.css';

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("https://your-api-url.com/meetings");

        const formattedEvents = response.data.map((meeting, i) => {
          const start = new Date(`${meeting.date}T${meeting.time}`);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // 1hr duration
          return {
            title: meeting.title,
            start,
            end,
            color: i % 2 === 0 ? "#E0F2FE" : "#EDE9FE", // alternate colors
            borderColor: i % 2 === 0 ? "#38BDF8" : "#8B5CF6"
          };
        });

        setAllEvents(formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = allEvents.filter((event) =>
      event.title.toLowerCase().includes(value)
    );
    setEvents(filtered);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderLeft: `4px solid ${event.borderColor}`,
        color: "#000",
        borderRadius: "8px",
        padding: "5px",
      },
    };
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div className="left-controls">
          <h3>Activity</h3>
          <span>Event type ▾</span>
        </div>
        <div className="center-controls">
          <span>Indian Time Standard ▾</span>
        </div>
        <div className="right-controls">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["day", "week", "month"]}
        eventPropGetter={eventStyleGetter}
        style={{ height: "80vh" }}
      />
    </div>
  );
}
