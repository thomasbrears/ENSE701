import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from "../../styles/ArticleDetails.module.scss";
import fromStyles from "../../styles/Forms.module.scss";

interface Article {
    _id: string;
    title: string;
    authors: string[];
    journal: string;
    se_practice: string | null;
    research_type: string | null;
    publication_year: number;
    volume: string | null;
    number: string | null;
    pages: string | null;
    doi: string;
    claim: string | null;
    evidence: string | null;
    summary: string;
}

const ArticleDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // Get the article ID from the URL
    const [article, setArticle] = useState<Article | null>(null);
    const [evidence, setEvidence] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/articles/${id}`);
                    setArticle(response.data);
                    setEvidence(response.data.evidence || '');
                } catch (error) {
                    console.error('Error fetching article details:', error);
                    setError('Error fetching article details.');
                }
            };

            fetchArticle();
        }
    }, [id]);

    const handleEvidenceSubmit = async () => {
        if (!article) return;

        try {
            await axios.post(`http://localhost:8000/api/analysis/articles/${article._id}/evidence`, {
                evidence,
            });
            setMessage('Evidence updated successfully.');
        } catch (error) {
            console.error('Error updating evidence:', error);
            setMessage('Error updating evidence.');
        }
    };

    const handleApprove = async () => {
        if (!article) return;

        try {
            await axios.post(`http://localhost:8000/api/analysis/articles/${article._id}/approve`);
            setMessage('Article approved and published.');
            // Optionally, redirect back to the dashboard
            router.push('/analyst-dashboard');
        } catch (error) {
            console.error('Error approving article:', error);
            setMessage('Error approving article.');
        }
    };

    const handleReject = async () => {
        if (!article) return;

        try {
            await axios.post(`http://localhost:8000/api/analysis/articles/${article._id}/reject`);
            setMessage('Article rejected.');
            // Optionally, redirect back to the dashboard
            router.push('/analyst-dashboard');
        } catch (error) {
            console.error('Error rejecting article:', error);
            setMessage('Error rejecting article.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!article) {
        return <p>Loading article details...</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{article.title}</h1>
            <div className={styles.divider}></div>
            <div className={styles.subtitle}>
                <b>{article.journal || 'No journal name available'}</b>
                <br />
                (Volume: <b>{article.volume || 'N/A'}</b>, Number: <b>{article.number || 'N/A'}</b>, Pages: <b>{article.pages || 'N/A'}</b>)
                <br />
                Published in <b>{article.publication_year || 'Unknown'}</b> by <b>{article.authors.join(', ') || 'No authors available'}</b>
                <br />
                DOI: <b>{article.doi || 'No DOI available'}</b>
                <br />
                Type of Research: <b>{article.research_type || 'No research type available'}</b>
                <br />
                Software Engineering Practice: <b>{article.se_practice || 'No SE practice available'}</b>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Summary</h2>
                <p className={styles.text}>{article.summary}</p>
            </div>

            {article.claim && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Claims</h2>
                    <p className={styles.text}>{article.claim || 'No claim available'}</p>
                </div>
            )}

            {article.evidence && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Evidence of the Claims</h2>
                    <p className={styles.text}>{article.evidence || 'No Evidence available'}</p>
                </div>
            )}

            <h3>Add Evidence</h3>
            <textarea className={fromStyles.input}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder='Enter the evidence to support the claim'
                rows={5}
                cols={50}
            ></textarea>
            <br />
            <button className={fromStyles.addButton} onClick={handleEvidenceSubmit}>Save Evidence</button>
            <br />
            <button className={fromStyles.addButton} onClick={handleApprove}>Approve and Publish</button>
            <button className={fromStyles.removeButton}
                style={{margin: '1em'}}
                onClick={handleReject}>Reject</button>
            <br />
            <button className={fromStyles.addButton} onClick={() => router.back()}>Back to Dashboard</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default ArticleDetails;
