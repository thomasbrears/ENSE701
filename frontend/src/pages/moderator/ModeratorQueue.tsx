import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SortableTable from '@/components/SortableTable';

interface ArticlesInterface {
    id: string;
    title: string;
    authors: string;
    pubyear: string;
    journal: string;
    se_practice: string;
    research_type: string;
}

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

const ModeratorQueue: React.FC = () => {
    const [articles, setArticles] = useState<ArticlesInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${API_URL}/moderation/articles`);
                const formattedArticles = response.data.map((article: any) => ({
                    id: article._id,
                    title: article.title,
                    authors: Array.isArray(article.authors) ? article.authors.join(", ") : article.authors,
                    pubyear: article.publication_year?.toString() ?? "",
                    journal: article.journal ?? "",
                    se_practice: article.se_practice ?? "",
                    research_type: article.research_type ?? "",
                }));

                setArticles(formattedArticles);
            } catch (error) {
                console.error('Error fetching articles for moderation:', error);
                setError('Failed to load articles for moderation.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const headers = [
        { key: "title", label: "Title" },
        { key: "authors", label: "Authors" },
        { key: "pubyear", label: "Publication Year" },
        { key: 'actions', label: 'Actions' },
    ];

    const tableData = articles.map((article) => ({
        ...article,
        authors: article.authors,
        actions: (
            <>
                <Link href={`/moderator/${article.id}`} passHref>
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginRight: '10px'
                        }}
                    >
                        Review
                    </button>
                </Link>
                <Link href={`/moderator/${article.id}`} passHref>
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginRight: '10px'
                        }}
                    >
                        Pass
                    </button>
                </Link>
                <Link href={`/moderator/${article.id}`} passHref>
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
                        Reject
                    </button>
                </Link>
            </>
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
