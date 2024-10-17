import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SortableTable from '@/components/SortableTable';
import InputDialog from '@/components/InputDialog';

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
    repeat_flag: boolean;
}

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://ense701-g6.vercel.app/api'
    : 'http://localhost:8000/api';

const ModeratorQueue: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [currentArticle, setCurrentArticle] = useState<Article>();
    const [currentText, setCurrentText] = useState<string>();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${API_URL}/moderation/articles/`);
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
        { key: "journal", label: "Journal/Conference" },
        { key: "se_practice", label: "SE Practice" },
        { key: "research_type", label: "Research Type" },
        { key: "warning", label: "Warning" },
        { key: 'actions', label: 'Actions', width: '350px!important' },
    ];

    async function submitReject(article: Article, rejection_reason: string) {
        if (!article) {
            return;
        }

        try {
            const result = await axios.post(`${API_URL}/moderation/articles/${article._id}/reject`, {
                rejection_reason: rejection_reason || ""
            });
            if (result.status === 200) {
                toast.success('Article rejected successfully');
                setArticles(articles.filter(article => article._id !== article._id));
            } else {
                throw new Error('Error rejecting article.');
            }
        } catch (error) {
            console.error('Error rejecting article:', error);
            toast.error('Error rejecting article.');
            setError('Error rejecting article.');
        }
    }

    const handleReject = async (article: Article) => {

        if (article.repeat_flag) {
            setCurrentArticle(article);
            setModalIsOpen(true);
            return;
        }

        submitReject(article, '');
    }


    const handleApprove = async (articleId: string) => {
        try {
            const result = await axios.post(`${API_URL}/moderation/articles/${articleId}/approve`);
            if (result.status === 200) {
                toast.success('Article approved successfully');
                setArticles(articles.filter(article => article._id !== articleId));
            }
        } catch (error) {
            console.error('Error approving article:', error);
            toast.error('Error approving article.');
            setError('Error approving article.');
        }
    }

    const tableData = articles.map((article) => ({
        ...article,
        authors: article.authors,
        warning: (
            <>
                <div>
                    <span style={{
                        color: article.repeat_flag ? '#d0b50b' : 'green'
                    }}>{article.repeat_flag ? 'Duplicate' : 'Normal'}</span>
                </div>
            </>
        ),
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
                    onClick={() => handleApprove(article._id)}
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
                    onClick={() => handleReject(article)}
                >
                    Reject
                </button>
            </>
        ),
    }));

    function handleClose() {
        setModalIsOpen(false);
    }

    function handleInput(text: string) {
        if(!text || text.trim() === ''){
            toast.warning('Please enter a reason for rejection.');
            return;
        }

        if (currentArticle) {
            submitReject(currentArticle, text);
            setCurrentText('');
            setModalIsOpen(false);
        }
    }

    return (
        <div className="container">
            <h1>Moderator Queue</h1>
            {isLoading ? (
                <p>Loading articles...</p>
            ) : error ? (
                <p>{error}</p>
            ) : articles.length > 0 ? (
                <>
                    <SortableTable headers={headers} data={tableData} />
                    <InputDialog
                        isOpen={modalIsOpen}
                        onClose={handleClose}
                        onSave={handleInput}
                        title="Rejection Reason"
                        value={currentText}
                        placeholder="Please enter a reason for rejection"
                    />
                </>
            ) : (
                <p>No articles in the moderation queue.</p>
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

export default ModeratorQueue;
