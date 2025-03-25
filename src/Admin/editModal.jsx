import React, { useState, useEffect, useRef } from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
  MDBTextArea
} from 'mdb-react-ui-kit';
import { useTranslation } from 'react-i18next';
import './editModal.css';

const EditModal = ({ isOpen, onClose, type, data, onChange, onSave }) => {
  const [formData, setFormData] = useState({});
  const { t } = useTranslation();
  const modalRef = useRef(null);
  
  console.log("EditModal render with isOpen:", isOpen, "type:", type, "data:", data);

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      console.log('EditModal data updated:', data);
      // Ensure role has a default value if it's undefined
      const updatedData = {...data};
      if (type === 'user' && !updatedData.role) {
        updatedData.role = 'user';
      }
      setFormData(updatedData);
    }
  }, [data, type]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Re-enable scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    
    const updatedData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedData);
    
    // Also update parent component state if onChange is provided
    if (onChange) {
      onChange(updatedData);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    
    // First update parent state with the latest formData
    if (onChange) {
      onChange(formData);
    }
    
    // Then call the save function
    if (onSave) {
      onSave(formData);
    }
  };

  // Render appropriate fields based on edit type (user or task)
  const renderFields = () => {
    if (type === 'user') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="name">{t('admin.name')}</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('admin.email')}</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">{t('admin.role')}</label>
            <select
              className="form-control"
              id="role"
              name="role"
              value={formData.role || 'user'}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {/* Debug info for role */}
            <div className="small text-muted mt-1">
              Current role value: {formData.role || 'not set'}
            </div>
          </div>
        </>
      );
    } else if (type === 'task') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="title">{t('crm.tasks.taskName')}</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">{t('crm.tasks.taskDescription')}</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="4"
              value={formData.description || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">{t('crm.tasks.priority')}</label>
            <select
              className="form-control"
              id="priority"
              name="priority"
              value={formData.priority || 'medium'}
              onChange={handleChange}
            >
              <option value="low">{t('crm.tasks.low')}</option>
              <option value="medium">{t('crm.tasks.medium')}</option>
              <option value="high">{t('crm.tasks.high')}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="progress">
              {t('crm.tasks.progress')}: {formData.progress || 0}%
            </label>
            <input
              type="range"
              className="form-range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              value={formData.progress || 0}
              onChange={handleChange}
            />
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ 
                  width: `${formData.progress || 0}%`,
                  backgroundColor: 
                    (formData.progress || 0) < 30 ? 'var(--danger)' : 
                    (formData.progress || 0) < 70 ? 'var(--warning)' : 
                    'var(--success)'
                }}
              ></div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="due_date">{t('crm.tasks.dueDate', 'Due Date')}</label>
            <input
              type="date"
              className="form-control"
              id="due_date"
              name="due_date"
              value={formData.due_date || ''}
              onChange={handleChange}
            />
          </div>
        </>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={handleBackdropClick}>
      <div className="custom-modal" ref={modalRef}>
        <div className="custom-modal-header">
          <h5 className="custom-modal-title">
            {type === 'user' ? t('admin.editUser') : t('admin.editTask')}
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="custom-modal-body">
          <form onSubmit={handleSubmit}>
            {renderFields()}
            <div className="custom-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                {t('admin.cancel')}
              </button>
              <button type="submit" className="btn btn-primary">
                {t('admin.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
