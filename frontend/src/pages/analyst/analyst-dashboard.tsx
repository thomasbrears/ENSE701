import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SortableTable from '@/components/SortableTable'; // Adjust the path

interface Article {
  _id: string;
  title: string;
  authors: string[];
  summary: string;
  publication_year: number;
  research_type: string | null;
  se_practice: string | null;
  journal: string;
  status: string;
  evidence: string;
}

const AnalystDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/analysis/articles/`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles for analysis:', error);
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
    { key: "journal", label: "Journal/Conference" },
    { key: "se_practice", label: "SE Practice" },
    { key: "research_type", label: "Research Type" },
    { key: 'actions', label: '' },
  ];

  const tableData = articles.map((article) => ({
    ...article,
    authors: article.authors.join(', '),
    actions: (
      <Link href={`/analyst/${article._id}`} passHref>
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
      <h1>Analyst Dashboard</h1>
      {isLoading ? (
        <p>Loading articles...</p>
      ) : error ? (
        <p>{error}</p>
      ) : articles.length > 0 ? (
        <SortableTable headers={headers} data={tableData} />
      ) : (
        <p>No articles required for analysis.</p>
      )}
    </div>
  );
};

export default AnalystDashboard;
