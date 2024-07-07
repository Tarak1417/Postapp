
import React, { useState, useEffect } from "react";
import './App.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from "axios";
import Modal from 'react-modal';

// Set the root element for accessibility
Modal.setAppElement('#root');

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    id: null,
    name: '',
    username: '',
    email: '',
    phone: '',
    website: ''
  });
  const [editedData, setEditedData] = useState({
    id: null,
    name: '',
    username: '',
    email: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching user data. Please try again later.");
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedData(user);
  };

  const handleView = (user) => {
    setViewingUser(user);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUsers(users.map(user => (user.id === editedData.id ? editedData : user)));
    setEditingUser(null);
  };

  const handleAddSave = () => {
    setUsers([...users, { ...newUserData, id: users.length + 1 }]);
    setAddingUser(false);
    setNewUserData({
      id: null,
      name: '',
      username: '',
      email: '',
      phone: '',
      website: ''
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="user-page">Loading...</div>;
  }

  if (error) {
    return <div className="user-page">{error}</div>;
  }

  const actionsTemplate = (rowData) => {
    return (
      <div className="main_parent">
        <button className="btn btn-success" type="button" onClick={() => handleView(rowData)}>
          <i className="pi pi-eye"></i> View
        </button>
        <button className="btn btn-primary" type="button" onClick={() => handleEdit(rowData)}>
          <i className="pi pi-file-edit"></i> Edit
        </button>
        <button className="btn btn-danger" type="button" onClick={() => handleDelete(rowData.id)}>
          <i className="pi pi-trash"></i> Delete
        </button>
      </div>
    );
  };

  return (
    <div className="user-page">
      <div className="container">
        <h1>Welcome to postapp</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-bar"
          />
          <button className="btn btn-primary" onClick={() => setAddingUser(true)}>Add New</button>
        </div>
        <div className="userList">
          <DataTable value={filteredUsers}>
            <Column field="name" header="Name"></Column>
            <Column field="username" header="User Name"></Column>
            <Column field="email" header="Email Address"></Column>
            <Column field="phone" header="Phone Number"></Column>
            <Column field="website" header="Website"></Column>
            <Column header="Actions" body={actionsTemplate}></Column>
          </DataTable>
        </div>
        <Modal
          isOpen={!!editingUser}
          onRequestClose={() => setEditingUser(null)}
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>Edit User</h2>
          <form className="modal-form">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleEditChange}
            />
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={editedData.username}
              onChange={handleEditChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={editedData.email}
              onChange={handleEditChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={editedData.phone}
              onChange={handleEditChange}
            />
            <label>Website:</label>
            <input
              type="text"
              name="website"
              value={editedData.website}
              onChange={handleEditChange}
            />
            <div className="Edit-btn">
              <button type="button" className="btn-save" onClick={handleSave}>Save</button>
              <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={!!viewingUser}
          onRequestClose={() => setViewingUser(null)}
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>View User</h2>
          <div className="modal-view">
            <p><strong>Name:</strong> {viewingUser?.name}</p>
            <p><strong>Username:</strong> {viewingUser?.username}</p>
            <p><strong>Email:</strong> {viewingUser?.email}</p>
            <p><strong>Phone:</strong> {viewingUser?.phone}</p>
            <p><strong>Website:</strong> {viewingUser?.website}</p>
            <button type="button" className="btn-close" onClick={() => setViewingUser(null)}>Close</button>
          </div>
        </Modal>
        <Modal
          isOpen={addingUser}
          onRequestClose={() => setAddingUser(false)}
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2>Add New User</h2>
          <form className="modal-form">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newUserData.name}
              onChange={handleAddChange}
            />
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={newUserData.username}
              onChange={handleAddChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={newUserData.email}
              onChange={handleAddChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={newUserData.phone}
              onChange={handleAddChange}
            />
            <label>Website:</label>
            <input
              type="text"
              name="website"
              value={newUserData.website}
              onChange={handleAddChange}
            />
            <div className="Edit-btn">
              <button type="button" className="btn-save" onClick={handleAddSave}>Save</button>
              <button type="button" className="btn-cancel" onClick={() => setAddingUser(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

export default App;
