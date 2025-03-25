import React, { useState } from 'react';
import EditModal from './editModal';
import './editModal.css';

const TestModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('user');
  const [modalData, setModalData] = useState(null);

  const openUserModal = () => {
    const userData = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };
    setModalType('user');
    setModalData(userData);
    setIsModalOpen(true);
  };

  const openTaskModal = () => {
    const taskData = {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task description',
      priority: 'medium',
      progress: 50
    };
    setModalType('task');
    setModalData(taskData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (updatedData) => {
    console.log('Saving data:', updatedData);
    alert(`Data saved: ${JSON.stringify(updatedData, null, 2)}`);
    setIsModalOpen(false);
  };

  const handleDataChange = (newData) => {
    console.log('Data changed:', newData);
    setModalData(newData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Modal Test Page</h1>
      <p>Click the buttons below to test the modal functionality:</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={openUserModal}>
          Open User Modal
        </button>
        
        <button className="btn btn-success" onClick={openTaskModal}>
          Open Task Modal
        </button>
      </div>
      
      <div>
        <h3>Current Modal State:</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          {JSON.stringify({
            isModalOpen,
            modalType,
            modalData
          }, null, 2)}
        </pre>
      </div>
      
      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
        data={modalData}
        onChange={handleDataChange}
        onSave={handleSave}
      />
    </div>
  );
};

export default TestModal; 