import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getAllEmails, addEmail, deleteEmail } from "../../api/roles";

const Email = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [role, setRole] = useState('moderator');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const data = await getAllEmails();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleAddEmail = async () => {
    try {
      await addEmail(newEmail, role);
      setNewEmail('');
      fetchEmails();
    } catch (error) {
      console.error('Error adding email:', error);
    }
  };

  const handleDeleteEmail = async (email) => {
    try {
      await deleteEmail(email);
      fetchEmails();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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
          value={role}
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
          {emails.map((email) => (
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

export default Email;
