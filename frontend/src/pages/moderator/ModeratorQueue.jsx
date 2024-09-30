import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SortableTable from '@/components/SortableTable'; 

//I stole ur UX formatting whoever did analyst, Thank you, it looked good :)

const ModeratorQueue = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(process.env.ACCESS_URL + `/api/moderation/moderationQueue`);
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles for moderation:', error);
                setError('Error fetching articles for moderation.');
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
        { key: 'actions', label: 'Actions' },
    ];

    const tableData = articles.map((article) => ({
        ...article,
        authors: article.authors.join(', '),
        actions: (
            <Link href={`/moderator/${article._id}`} passHref>
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
                    Review
                </button>
            </Link>
        ),
    }));

    return (
        <div className="container">
            <h1>Moderator Queue</h1>
            {isLoading ? (
                <p>Loading articles...</p>
            ) : error ? (
                <p>{error}</p>
            ) : articles.length > 0 ? (
                <SortableTable headers={headers} data={tableData} />
            ) : (
                <p>No articles in the moderation queue.</p>
            )}
        </div>
    );
};

export default ModeratorQueue;
