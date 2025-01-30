import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";
const Calendar = ({ tasks }) => {
  const calendarRef = useRef(null);
  const [view, setView] = useState("dayGridMonth"); // Default view
  const [currentMonth, setCurrentMonth] = useState(""); // State for current month & year

  useEffect(() => {
    updateCurrentMonth();
  }, []);

  // Function to update current month & year
  const updateCurrentMonth = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const date = calendarApi.getDate();
      const monthYear = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date);
      setCurrentMonth(monthYear);
    }
  };

  // Transform tasks into FullCalendar events
  const events = tasks.map((task) => ({
    title: task.title,
    start: task.due_date,
    color: task.progress === 100 ? "gray" : task.priority === "High" ? "red" : "green",
    extendedProps: {
      description: task.description,
      progress: task.progress,
      users: task.users,
    },
  }));

  // Function to navigate to the previous month
  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    updateCurrentMonth();
  };

  // Function to navigate to the next month
  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    updateCurrentMonth();
  };

  // Function to change the view
  const handleViewChange = (event) => {
    const newView = event.target.value;
    setView(newView);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(newView);
    updateCurrentMonth();
  };

  return (
    <div>
      {/* Display Current Month & Year */}
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>{currentMonth}</h2>

      {/* Custom Navigation Buttons */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <button className="buttons" onClick={handlePrev}>Previous</button>
        <button className="buttons" onClick={handleNext} style={{ marginLeft: "10px" }}>
          Next
        </button>
        <select className="buttons" onChange={handleViewChange} value={view} style={{ marginLeft: "10px" }}>
          <option value="dayGridMonth">Month</option>
          <option value="timeGridWeek">Week</option>
          <option value="timeGridDay">Day</option>
        </select>
      </div>

      {/* FullCalendar Component */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        events={events}
        contentHeight="auto"
        handleWindowResize={false}
        headerToolbar={false}
        eventClick={(info) => {
          alert(`Task: ${info.event.title}\nDescription: ${info.event.extendedProps.description}`);
        }}
      />
    </div>
  );
};

export default Calendar;
