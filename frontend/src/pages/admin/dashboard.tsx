import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

interface Role {
  email: string,
  role: string
}

const addRole = async (role: Role) => {
  try {
    const response = await axios.post(`${API_URL}/roles`, role);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteRole = async (email: string) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const AdminDashboard = () => {
  const [roles, setEmails] = useState<Role[]>([]);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newRole, setRole] = useState<string>('moderator');

  const fetchRoles = async () => {
    try {
      console.log("请求角色");
      const data = await getAllRoles();
      console.log(data)

      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddEmail = async () => {
    try {
      const role = {
        email: newEmail,
        role: newRole
      };
      await addRole(role);
      setNewEmail('');
      fetchRoles();
    } catch (error) {
      console.error('Error adding email:', error);
    }
  };

  const handleDeleteEmail = async (email: string) => {
    try {
      await deleteRole(email);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '8px', width: '300px' }}
        />
        <select
          value={newRole}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginRight: '10px', padding: '8px', width: '150px' }}
        >
          <option value="moderator">Moderator</option>
          <option value="analyst">Analyst</option>
        </select>
        <button
          onClick={handleAddEmail}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Add Email
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((email) => (
            <tr key={email.email}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{email.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{email.role}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => handleDeleteEmail(email.email)}
                  style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
