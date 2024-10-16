import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SortableTable from '@/components/SortableTable'; // Adjust the path
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Article {
  _id: string;
  title: string;
  authors: string[];
  publication_year: number;
  rejection_reason: string;
}

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/articles/rejected/`);
        console.log(response.data);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles for analysis:', error);
        toast.error('Failed to load articles for analysis.');
        setError('Error fetching articles for analysis.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const headers = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors" },
    { key: "publication_year", label: "Publication Year" },
    { key: "rejection_reason", label: "Rejection Reason" },
    { key: 'actions', label: '' },
  ];

  const tableData = articles.map((article) => ({
    ...article,
    authors: article.authors.join(', '),
    actions: (
      <Link href={`/admin/${article._id}`} passHref>
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
          View
        </button>
      </Link>
    ),
  }));

  return (
    <div className="container">
      <h1>Rejected Articles</h1>
      {isLoading ? (
        <p>Loading articles...</p>
      ) : error ? (
        <p>{error}</p>
      ) : articles.length > 0 ? (
        <SortableTable headers={headers} data={tableData} />
      ) : (
        <p>No articles required for analysis.</p>
      )}

      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminDashboard;
