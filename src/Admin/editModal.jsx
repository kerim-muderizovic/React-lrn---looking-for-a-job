import React from 'react';

const EditModal = ({ 
  isOpen, 
  type, 
  data, 
  onChange, 
  onSave, 
  onClose 
}) => {
  console.log("Checking Modal Visibility: ", isOpen);
  if (!isOpen) return null; // Don't render anything if modal is closed

  return (
    <div
      className={`modal fade show d-block`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit {type === "user" ? "User" : "Task"}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {type === "user" && data && (
              <div>
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.name}
                  onChange={(e) => onChange({ ...data, name: e.target.value })}
                />
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={data.email}
                  onChange={(e) => onChange({ ...data, email: e.target.value })}
                />
              </div>
            )}
            {type === "task" && data && (
              <div>
                <label className="form-label">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.title}
                  onChange={(e) => onChange({ ...data, title: e.target.value })}
                />
                <label className="form-label">Progress (%):</label>
                <input
                  type="number"
                  className="form-control"
                  value={data.progress}
                  onChange={(e) => onChange({ ...data, progress: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
