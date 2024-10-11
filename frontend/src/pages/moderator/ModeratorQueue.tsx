import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SortableTable from '@/components/SortableTable';

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

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://ense701-g6.vercel.app/api'
    : 'http://localhost:8000/api';

const ModeratorQueue: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${API_URL}/moderation/articles/`);
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
        { key: 'actions', label: 'Actions', width: '350px!important'},
    ];

    const handleReject = async (articleId:string)=>{
       try {
            const result = await axios.post(`${API_URL}/moderation/articles/${articleId}/reject`);
            if(result.status === 200){
                alert('Article rejected successfully')
                setArticles(articles.filter(article => article._id !== articleId));
            }
       }catch (error) {
            console.error('Error rejecting article:', error);
            setError('Error rejecting article.');
       }
    }
    

    const handleApprove = async(articleId:string)=>{
        try {
            const result =  await axios.post(`${API_URL}/moderation/articles/${articleId}/approve`);
            if(result.status === 200){
                alert('Article approve successfully')
                setArticles(articles.filter(article => article._id !== articleId));
            }
        }catch (error) {
            console.error('Error approving article:', error);
            setError('Error approving article.');
        }
    }

    const tableData = articles.map((article) => ({
        ...article,
        authors: article.authors,
        actions: (
            <>
                <Link href={`/moderator/${article._id}`} passHref>
                    <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginTop: '10px'
                        }}
                    >
                        Review
                    </button>
                </Link>
                <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginTop: '10px'
                        }}
                        onClick={()=>handleApprove(article._id)}
                    >
                    Approve
                </button>
                <button
                        style={{
                            cursor: 'pointer',
                            padding: '0.5em 1em',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            marginTop: '10px'
                        }}
                        onClick={()=>handleReject(article._id)}
                    >
                        Reject
                    </button>
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
