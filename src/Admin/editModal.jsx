import React, { useState, useEffect } from 'react';
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

const EditModal = ({ isOpen, onClose, type, data, onSave }) => {
  const [formData, setFormData] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const renderFields = () => {
    if (type === 'user') {
      return (
        <>
          <MDBInput
            label={t('admin.name')}
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="mb-4"
          />
          <MDBInput
            label={t('admin.email')}
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="mb-4"
          />
          <MDBInput
            label={t('admin.role')}
            name="role"
            value={formData.role || ''}
            onChange={handleChange}
            className="mb-4"
          />
        </>
      );
    } else if (type === 'task') {
      return (
        <>
          <MDBInput
            label={t('crm.tasks.taskName')}
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="mb-4"
          />
          <MDBTextArea
            label={t('crm.tasks.taskDescription')}
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="mb-4"
          />
          <select
            className="form-select mb-4"
            name="priority"
            value={formData.priority || 'Medium'}
            onChange={handleChange}
          >
            <option value="Low">{t('crm.tasks.low')}</option>
            <option value="Medium">{t('crm.tasks.medium')}</option>
            <option value="High">{t('crm.tasks.high')}</option>
          </select>
        </>
      );
    }
    return null;
  };

  return (
    <MDBModal show={isOpen} onHide={onClose} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>
              {type === 'user' ? t('admin.editUser') : t('admin.editTask')}
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {renderFields()}
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='secondary' onClick={onClose}>
              {t('admin.cancel')}
            </MDBBtn>
            <MDBBtn onClick={handleSubmit}>
              {t('admin.saveChanges')}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default EditModal;
