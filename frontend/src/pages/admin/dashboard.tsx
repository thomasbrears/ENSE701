import React, { useEffect, useState } from "react";
import axios from "axios";
import SortableTable from "@/components/SortableTable"; // Import for SortableTable component
import Link from "next/link"; // Next.js Link component for client-side routing

// API URL based on the environment (production or development)
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

// Interface to define the structure of an Article object
interface Article {
  _id: string; // Unique identifier for the article
  title: string; // Title of the article
  authors: string[]; // List of authors
  publication_year: number; // Year of publication
}

// Interface to define the structure of a Role object
interface Role {
  email: string; // Email of the user
  role: string; // Role of the user (e.g., moderator, analyst)
}

// Function to add a new role for a user
const addRole = async (role: Role) => {
  try {
    const response = await axios.post(`${API_URL}/roles`, role); // API call to add a new role
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Throw error if something goes wrong
  }
};

// Function to delete a user role based on the email
const deleteRole = async (email: string) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${email}`); // API call to delete the role
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Throw error if something goes wrong
  }
};

// Function to get all roles (fetch all roles from the backend)
const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`); // API call to fetch all roles
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Throw error if something goes wrong
  }
};

// Main AdminDashboard component
const AdminDashboard = () => {
  const [roles, setEmails] = useState<Role[]>([]); // State for storing list of roles/emails
  const [newEmail, setNewEmail] = useState<string>(''); // State for storing new email input
  const [newRole, setRole] = useState<string>('moderator'); // State for storing selected role (default: moderator)
  const [articles, setArticles] = useState<Article[]>([]); // State for storing list of articles
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // Error state in case of issues fetching data

  // Function to fetch all roles from the backend
  const fetchRoles = async () => {
    try {
      console.log("Fetching roles");
      const data = await getAllRoles(); // Fetch roles
      console.log(data); // Log the data for debugging
      setEmails(data); // Update state with fetched roles
    } catch (error) {
      console.error('Error fetching emails:', error); // Log error if something goes wrong
    }
  };

  // Function to fetch all articles from the backend
  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/articles`); // Fetch articles from API
      setArticles(response.data); // Update state with fetched articles
    } catch (error) {
      console.error('Error fetching articles.', error); // Log error if something goes wrong
      setError('Error fetching articles.'); // Set error state
    } finally {
      setIsLoading(false); // Set loading state to false when the request completes
    }
  };

  // Use useEffect to fetch roles and articles when the component mounts
  useEffect(() => {
    fetchRoles(); // Fetch roles on mount
    fetchArticles(); // Fetch articles on mount
  }, []); // Empty dependency array ensures this runs once on component mount

  // Table headers for displaying articles
  const headers = [
    { key: "title", label: "Title" }, // Title of the article
    { key: "authors", label: "Authors" }, // Authors of the article
    { key: "publication_year", label: "Publication Year" }, // Publication year
    { key: "status", label: "Status" }, // Status of the article
    { key: 'actions', label: '' }, // Actions (e.g., edit button)
  ];

  // Function to handle adding a new email and role
  const handleAddEmail = async () => {
    try {
      const role = {
        email: newEmail, // Email from input state
        role: newRole // Role from select input state
      };
      await addRole(role); // Call the addRole function to send the API request
      setNewEmail(''); // Reset the email input field after adding
      fetchRoles(); // Refresh the roles list
    } catch (error) {
      console.error('Error adding email:', error); // Log error if something goes wrong
    }
  };

  // Function to handle deleting an email/role
  const handleDeleteEmail = async (email: string) => {
    try {
      await deleteRole(email); // Call the deleteRole function to send the API request
      fetchRoles(); // Refresh the roles list
    } catch (error) {
      console.error('Error deleting email:', error); // Log error if something goes wrong
    }
  };

  // Prepare the data for the sortable table component
  const tableData = articles.map((article) => ({
    ...article, // Spread the article properties (title, authors, etc.)
    authors: article.authors.join(', '), // Convert authors array into a string
    actions: (
      <Link href={`/admin/${article._id}`} passHref> {/* Link to edit the article */}
        <button
          style={{
            cursor: 'pointer',
            padding: '0.5em 1em',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Edit
        </button>
      </Link>
    ),
  }));

  // Render the component
  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      {/* Input form to add a new email and role */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)} // Update email input state
          style={{ marginRight: '10px', padding: '8px', width: '300px' }}
        />
        <select
          value={newRole}
          onChange={(e) => setRole(e.target.value)} // Update role input state
          style={{ marginRight: '10px', padding: '8px', width: '150px' }}
        >
          <option value="moderator">Moderator</option> {/* Moderator role option */}
          <option value="analyst">Analyst</option> {/* Analyst role option */}
        </select>
        <button
          onClick={handleAddEmail} // Handle adding the new role on button click
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Add Email
        </button>
      </div>

      {/* Display the roles in a table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((email) => ( // Loop through roles and display them in table rows
            <tr key={email.email}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{email.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{email.role}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => handleDeleteEmail(email.email)} // Handle delete button click
                  style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display loading state or error message */}
      {isLoading ? (
        <p>Loading articles...</p>
      ) : error ? (
        <p>{error}</p>
      ) : articles.length > 0 ? (
        <SortableTable headers={headers} data={tableData} /> // Show table with articles
      ) : (
        <p>No articles available</p> // Show message if no articles are available
      )}
    </div>
  );
};

export default AdminDashboard;
