import React from "react";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from "mdb-react-ui-kit";
import './crmTaskList.css';
const TaskList = ({ tasks, priorityColors, updateTaskProgress, t }) => {
  return (
    <div className="task-list-container">
<button class="animated-button">
  <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
    ></path>
  </svg>
  <span class="text">Sort by</span>
  <span class="circle"></span>
  <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
    ></path>
  </svg>
</button>

      {tasks.map(task => (
        <MDBCard
          key={task.id}
          style={{
            backgroundColor: priorityColors[task.priority],
            marginBottom: "15px",
            position: "relative",
          }}
        >
          <MDBCardBody className="Task">
            <MDBCardTitle>
              {task.title}
              <span
                style={{
                  backgroundColor: new Date(task.due_date) < new Date() ? "red" : "#ffc107",
                  color: "#fff",
                  fontSize: "12px",
                  padding: "5px 8px",
                  borderRadius: "5px",
                  marginLeft: "10px",
                }}
              >
                📅 {t("crm.tasks.due")}: {new Date(task.due_date).toLocaleDateString()}
              </span>
            </MDBCardTitle>
            <MDBCardText>{task.description}</MDBCardText>
            <MDBCardText>{t("crm.tasks.progress")}: {task.progress}%</MDBCardText>

            {/* Progress Bar */}
            <div
              style={{
                position: "relative",
                height: "20px",
                backgroundColor: "#d3d3d3",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onMouseDown={(e) => {
                const boundingRect = e.target.getBoundingClientRect();
                const offsetX = e.clientX - boundingRect.left;
                const newProgress = Math.min(100, Math.max(0, Math.round((offsetX / boundingRect.width) * 100)));
                updateTaskProgress(task.id, newProgress);
              }}
              onMouseMove={(e) => {
                if (e.buttons !== 1) return;
                const boundingRect = e.target.getBoundingClientRect();
                const offsetX = e.clientX - boundingRect.left;
                const newProgress = Math.min(100, Math.max(0, Math.round((offsetX / boundingRect.width) * 100)));
                updateTaskProgress(task.id, newProgress);
              }}
            >
              <div
                style={{
                  width: `${task.progress}%`,
                  height: "100%",
                  backgroundColor: "#4caf50",
                  borderRadius: "5px",
                  transition: "width 0.2s ease-in-out",
                }}
              />
            </div>
          </MDBCardBody>
        </MDBCard>
      ))}
    </div>
  );
};

export default TaskList;
