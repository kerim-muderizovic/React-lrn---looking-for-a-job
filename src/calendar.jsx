import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import "./calendar.css";

const Calendar = ({ tasks }) => {
  const { t, i18n } = useTranslation();
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
      // Use the current language for date formatting
      const monthYear = new Intl.DateTimeFormat(i18n.language === 'de' ? 'de-DE' : 'en-US', {
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
        <button className="buttons" onClick={handlePrev}>{t('calendar.previous')}</button>
        <button className="buttons" onClick={handleNext} style={{ marginLeft: "10px" }}>
          {t('calendar.next')}
        </button>
        <select className="buttons" onChange={handleViewChange} value={view} style={{ marginLeft: "10px" }}>
          <option value="dayGridMonth">{t('calendar.month')}</option>
          <option value="timeGridWeek">{t('calendar.week')}</option>
          <option value="timeGridDay">{t('calendar.day')}</option>
        </select>
      </div>

      {/* FullCalendar Component */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        events={events}
        contentHeight="auto"
        handleWindowResize={true}
        headerToolbar={false}
        locale={i18n.language}
        eventClick={(info) => {
          alert(`${t('calendar.task')}: ${info.event.title}\n${t('calendar.description')}: ${info.event.extendedProps.description}`);
        }}
      />
    </div>
  );
};

export default Calendar;
