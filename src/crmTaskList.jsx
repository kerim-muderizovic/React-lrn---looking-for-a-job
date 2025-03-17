import React from "react";
import './crmTaskList.css';

const TaskList = ({ tasks, priorityColors, updateTaskProgress, t }) => {
  return (
    <div className="task-list-container">
      <button className="animated-button">
        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
          ></path>
        </svg>
        <span className="text">{t("crm.tasks.sortNewest")}</span>
        <span className="circle"></span>
        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
          ></path>
        </svg>
      </button>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="task-card"
            style={{
              borderLeftColor: priorityColors[task.priority]
            }}
          >
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <span
                className={`due-date-tag ${new Date(task.due_date) < new Date() ? "overdue" : "upcoming"}`}
              >
                📅 {t("crm.tasks.due")}: {new Date(task.due_date).toLocaleDateString()}
              </span>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            <div className="task-progress">
              <p className="progress-text">{t("crm.tasks.progress")}: {task.progress}%</p>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor:
                      task.progress < 30 ? "var(--error)" : 
                      task.progress < 70 ? "var(--warning)" : 
                      "var(--success)"
                  }}
                ></div>
              </div>
            </div>

            <div className="task-actions">
              <button
                className="action-button decrease"
                onClick={() => updateTaskProgress(task.id, Math.max(0, task.progress - 10))}
                disabled={task.progress <= 0}
              >
                -
              </button>
              <button
                className="action-button increase"
                onClick={() => updateTaskProgress(task.id, Math.min(100, task.progress + 10))}
                disabled={task.progress >= 100}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
