import React, { useState } from "react";
import axios from "axios";
import formStyles from "../../styles/Forms.module.scss";
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';

// Define the expected structure of an article
interface Article {
  _id: string;
  title: string;
  status: string;
  submitted_at?: string;
  moderated_at?: string;
  analyzed_at?: string;
}

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

const LookupSubmission = () => {
  const [input, setInput] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState("");

  // Function to return user-friendly status messages
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'The article has been submitted and is in the queue for a moderator to review.';
      case 'approved_by_moderator':
        return 'Your article has been approved by the moderator and is now with the analyst to analyze the claim made.';
      case 'published':
        return 'Your article is live, YAY! Click the link below to view it.';
      case 'rejected':
        return 'Sorry, your article was been rejected.';
      default:
        return 'Unknown status';
    }
  };

  // Function to format dates into a user-friendly format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date Unavailable';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Function to get the correct date based on the article's status and format it
  const getDate = (article: Article) => {
    if (article.status === 'published') return formatDate(article.analyzed_at);
    if (article.status === 'approved_by_moderator') return formatDate(article.moderated_at);
    return formatDate(article.submitted_at);
  };

  const handleLookup = async () => {
    if (!input) {
      setError("Please enter your email or submission ID.");
      return;
    }

    setError("");
    setArticles([]); // Clear previous results

    try {
      // Determine if input is an email (by checking for "@")
      const query = input.includes('@') ? `email=${input}` : `submissionId=${input}`;
      const response = await axios.get(`${API_URL}/articles/track?${query}`);

      if (response.data.length === 0) {
        setError("No submissions found.");
      } else {
        setArticles(response.data);
      }
    } catch (err) {
      setError("There was an issue retrieving your submissions. Please try again later.");
    }
  };

  // Handle Enter key for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  return (
    <div className={formStyles.container}>
      <h1 className={formStyles.header}>Track My Submissions</h1>

      <div className={formStyles.field} style={{ position: 'relative', paddingRight: '40px' }}>
        <input
          type="text"
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your email or submission ID"
          className={formStyles.inputField}
          onKeyPress={handleKeyPress} // enter to search
        />
        <FaSearch
          className={formStyles.searchIcon}
          onClick={handleLookup}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {error && <p className={formStyles.errorMessage}>{error}</p>}

      {articles.length > 0 && (
        <div className={formStyles.submissionsList}>
          <h2>Your Submitted Articles</h2>
          {articles.map((article) => (
            <div key={article._id} className={formStyles.articleCard}>
              <p><strong>Title:</strong> {article.title}</p>
              <p><strong>Submission ID:</strong> {article._id}</p>
              <p><strong>Status:</strong> {getStatusMessage(article.status)}</p>
              <p><strong>{article.status === 'published' ? 'Published On' : article.status === 'approved_by_moderator' ? 'Moderated On' : 'Submitted On'}:</strong> {getDate(article)}</p>

              {/* Show link to the article if its published */}
              {article.status === 'published' && (
                <p><Link href={`/articles/${article._id}`} legacyBehavior>
                    <a>View Publised Article</a>
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LookupSubmission;
