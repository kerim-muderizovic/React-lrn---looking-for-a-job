import React, { useEffect, useState } from "react";
import axios from "axios";
import './activityLog.css';
import Loading from './isLoading';
import { useTranslation } from 'react-i18next';

// Helper function to determine activity badge class
const getActivityBadgeClass = (activity) => {
  const activityLower = activity.toLowerCase();
  if (activityLower.includes('login')) return 'login';
  if (activityLower.includes('logout')) return 'logout';
  if (activityLower.includes('create') || activityLower.includes('add')) return 'create';
  if (activityLower.includes('update') || activityLower.includes('edit')) return 'update';
  if (activityLower.includes('delete') || activityLower.includes('remove')) return 'delete';
  return '';
};

const ActivityLog = ({ users }) => {
  const { t } = useTranslation();
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10); // Logs per page
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Fetch activity logs from the API
  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const response = await axios.get("http://localhost:8000/Admin/GetAllActivities", {
          withCredentials: true,
        });

        console.log(response.data, "Activity logs");

        if (response.data && Array.isArray(response.data.activityLogs)) {
          // Sort logs by date (newest first)
          const sortedLogs = response.data.activityLogs.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          setActivityLogs(sortedLogs);
          setFilteredLogs(sortedLogs);
        } else {
          console.error("API response is not an array:", response.data);
          setActivityLogs([]);
          setFilteredLogs([]);
        }
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        setActivityLogs([]);
        setFilteredLogs([]);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchActivityLogs();
  }, []);

  // Filter logs when selectedUser changes
  useEffect(() => {
    if (selectedUser === "all") {
      setFilteredLogs(activityLogs);
    } else {
      const filtered = activityLogs.filter(
        (log) => log.user_id === parseInt(selectedUser)
      );
      setFilteredLogs(filtered);
    }
  }, [selectedUser, activityLogs]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get current logs for pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="activity-log-container">
      <h1 className="activity-log-title">{t('admin.activityLog')}</h1>

      {/* Filter by user */}
      <div className="filter-container">
        <label htmlFor="userFilter" className="filter-label">{t('admin.users')}:</label>
        <select
          id="userFilter"
          className="filter-select"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="all">{t('admin.users')}</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Activity log table */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>{t('admin.name')}</th>
                  <th>{t('admin.description')}</th>
                  <th>{t('admin.lastLogin')}</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((log, index) => {
                    const user = users.find((u) => u.id === log.user_id);
                    const userName = user ? user.name : "Unknown User";
                    const badgeClass = getActivityBadgeClass(log.activity);

                    return (
                      <tr key={index}>
                        <td>
                          <div className="user-info">
                            <span className="user-name">{userName}</span>
                          </div>
                        </td>
                        <td>
                          <div className="activity-info">
                            <span className={`activity-badge ${badgeClass}`}></span>
                            <span className="activity-text">{log.activity}</span>
                          </div>
                        </td>
                        <td>
                          <span className="activity-date">
                            {formatDate(log.created_at)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="no-logs">
                      {t('admin.loading')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredLogs.length > logsPerPage && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                &laquo;
              </button>
              {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-button ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredLogs.length / logsPerPage)}
                className="pagination-button"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityLog;