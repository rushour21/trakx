import React,{ useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import dayjs from 'dayjs'
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";


const localizer = momentLocalizer(moment);

export default function calenderView() {
    const [events, setEvents] = useState();
  return (
    <div style={{ height: "80vh", padding: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['day', 'week', 'month', 'agenda']} // Shows Day, Week, Month, and Agenda views
        style={{ height: "100%", fontFamily: "Arial" }}
      />
    </div>
  )
}
