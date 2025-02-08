import React, { useEffect, useState } from "react";
import axios from "axios";
import './activityLog.css';
import Loading from './isLoading';
const ActivityLog = ({ users }) => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10); // Logs per page
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
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
          setActivityLogs(response.data.activityLogs);
          setFilteredLogs(response.data.activityLogs);
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
        setIsLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchActivityLogs();
  }, []);

  // Filter logs by selected user
  useEffect(() => {
    if (selectedUser === "all") {
      setFilteredLogs(activityLogs);
    } else {
      const filtered = activityLogs.filter((log) => log.userId === selectedUser);
      setFilteredLogs(filtered);
    }
  }, [selectedUser, activityLogs]);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = Array.isArray(filteredLogs) ? filteredLogs.slice(indexOfFirstLog, indexOfLastLog) : []; // ✅ Fix slice error

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="activity-log">
      <h2>Activity Log</h2>

      {/* User Filter Dropdown */}
      <div className="filter-section">
        <label htmlFor="user-filter">Filter by User:</label>
        <div className="select">
          <div
            className="selected"
            data-default={selectedUser === 'all' ? 'All' : users.find((user) => user.id === parseInt(selectedUser))?.name}
          >
            {selectedUser === 'all'
              ? 'All Users'
              : users.find((user) => user.id === parseInt(selectedUser))?.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              className="arrow"
            >
              <path
                d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
              ></path>
            </svg>
          </div>
          <div className="options">
            <div title="all">
              <input
                id="all"
                name="option"
                type="radio"
                checked={selectedUser === 'all'}
                onChange={handleUserChange}
                value="all"
              />
              <label className="option" htmlFor="all" data-txt="All"></label>
            </div>
            {users.map((user) => (
              <div key={user.id} title={user.name}>
                <input
                  id={`option-${user.id}`}
                  name="option"
                  type="radio"
                  checked={selectedUser === user.id.toString()}
                  onChange={handleUserChange}
                  value={user.id}
                />
                <label className="option" htmlFor={`option-${user.id}`} data-txt={user.name}></label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
<Loading/>


      ) : (
        <>
          {/* Activity Log Table */}
          <table className="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>{log.user.name}</td>
                  <td>{log.activity}</td>
                  <td>{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(filteredLogs.length / logsPerPage) },
              (_, i) => (
                <button key={i + 1} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLog;