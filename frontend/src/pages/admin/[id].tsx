import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from "../../styles/ArticleDetails.module.scss";
import formStyles from "../../styles/Forms.module.scss";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the structure of an Article object
interface Article {
    _id: string; // Unique identifier for the article
    title: string; // Title of the article
    authors: string[]; // List of authors
    journal: string; // Journal where the article is published
    se_practice: string | null; // Software engineering practice
    research_type: string | null; // Type of research
    publication_year: number; // Year of publication
    volume: string | null; // Volume number of the journal
    number: string | null; // Issue number of the journal
    pages: string | null; // Page range of the article
    doi: string; // Digital Object Identifier
    claim: string | null; // Claim made in the article
    evidence: string | null; // Evidence to support the claim
    analysis_notes: string | null; // Notes from the analysis
    evidence_summary: 'weak' | 'moderate' | 'strong' | null; // Summary of the evidence strength
    summary: string; // Summary of the article
    status: string; // Current status of the article
}

// Determine the API URL based on the environment
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://ense701-g6.vercel.app/api' // Production URL
    : 'http://localhost:8000/api'; // Development URL

const ArticleDetails: React.FC = () => {
    const router = useRouter(); // Get router instance from Next.js
    const { id } = router.query; // Get the article ID from the URL
    const [article, setArticle] = useState<Article | null>(null); // State to hold article details
    const [evidence, setEvidence] = useState<string>(''); // State for evidence input
    const [analysisNotes, setAnalysisNotes] = useState<string>(''); // State for analysis notes input
    const [claim, setClaim] = useState<string>(''); // State for claim input
    const [evidenceSummary, setEvidenceSummary] = useState<'weak' | 'moderate' | 'strong' | null>(null); // State for evidence summary
    const [error, setError] = useState<string | null>(null); // Error state for API calls
    const [activeEditField, setActiveEditField] = useState<string | null>(null); // Track which field is being edited
    const [editableStatus, setEditableStatus] = useState<string>(''); // State for article status

    // Predefined article statuses for dropdown selection
    const statusOptions = ['published', 'approved_by_moderator', 'rejected', 'pending'];

    // Fetch article details when the component mounts or when the ID changes
    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                try {
                    const response = await axios.get(`${API_URL}/articles/${id}`); // Fetch article from API
                    setArticle(response.data); // Set article data in state
                    setEvidence(response.data.evidence || ''); // Initialize evidence state
                    setAnalysisNotes(response.data.analysis_notes || ''); // Initialize analysis notes state
                    setClaim(response.data.claim || ''); // Initialize claim state
                    setEvidenceSummary(response.data.evidence_summary || null); // Initialize evidence summary state
                    setEditableStatus(response.data.status); // Set initial editable status
                } catch (error) {
                    console.error('Error fetching article details:', error);
                    setError('Error fetching article details.'); // Update error state
                    toast.error('Error fetching article details.'); // Show error message
                }
            };
            fetchArticle(); // Call fetchArticle function
        }
    }, [id]); // Dependency array ensures the effect runs when the ID changes

    // Function to set the active editing field
    const handleEdit = (field: string) => {
        setActiveEditField(field); // Set the active editing field
    };

    // Function to save updated analysis notes
    const handleSaveAnalysisNotes = async () => {
        if (!article) return; // Return if no article is available
        try {
            const response = await axios.post(`${API_URL}/admin/articles/${article._id}/analysis_notes`, {
                analysis_notes: analysisNotes, // Send updated analysis notes
            });
            if (response.status === 200 || response.status === 201) {
                setActiveEditField(null); // Exit edit mode after saving
                toast.success('Analysis notes updated successfully.'); // Show success message
                setArticle({ ...article, analysis_notes: analysisNotes }); // Update article data with new notes
            } else {
                toast.error('Error: Failed to update analysis notes.'); // Show error message
            }
        } catch (error) {
            console.error('Error updating analysis notes:', error);
            toast.error('Error updating analysis notes.'); // Show error message
        }
    };

    // Function to save updated evidence
    const handleSaveEvidence = async () => {
        if (!article) return; // Return if no article is available
        try {
            const response = await axios.post(`${API_URL}/admin/articles/${article._id}/evidence`, {
                evidence, // Send updated evidence
            });
            if (response.status === 200 || response.status === 201) {
                setActiveEditField(null); // Exit edit mode after saving
                toast.success('Evidence updated successfully.'); // Show success message
                setArticle({ ...article, evidence }); // Update article data with new evidence
            } else {
                toast.error('Error: Failed to update evidence.'); // Show error message
            }
        } catch (error) {
            console.error('Error updating evidence:', error);
            toast.error('Error updating evidence.'); // Show error message
        }
    };

    // Function to save updated claim
    const handleSaveClaim = async () => {
        if (!article) return; // Return if no article is available
        try {
            const response = await axios.post(`${API_URL}/admin/articles/${article._id}/claim`, {
                claim, // Send updated claim
            });
            if (response.status === 200 || response.status === 201) {
                setActiveEditField(null); // Exit edit mode after saving
                toast.success('Claim updated successfully.'); // Show success message
                setArticle({ ...article, claim }); // Update article data with new claim
            } else {
                toast.error('Error: Failed to update claim.'); // Show error message
            }
        } catch (error) {
            console.error('Error updating claim:', error);
            toast.error('Error updating claim.'); // Show error message
        }
    };

    // Function to handle updates to evidence summary
    const handleEvidenceSummaryChange = async (newEvidenceSummary: 'weak' | 'moderate' | 'strong' | '') => {
        if (!article) return; // Return if no article is available
        const evidenceSummaryValue = newEvidenceSummary || null; // Reset to null if no valid summary is provided

        try {
            await axios.post(`${API_URL}/admin/articles/${article._id}/evidence_summary`, {
                evidence_summary: evidenceSummaryValue, // Send updated evidence summary
            });
            setArticle({ ...article, evidence_summary: evidenceSummaryValue }); // Update article data with new summary
            toast.success('Evidence summary updated successfully.'); // Show success message
        } catch (error) {
            console.error('Error updating evidence summary:', error);
            setError('Error updating evidence summary.'); // Update error state
            toast.error('Error updating evidence summary.'); // Show error message
        }
    };

    // Function to delete the article
    const handleDeleteArticle = async () => {
        if (!article) return; // Return if no article is available
        try {
            await axios.delete(`${API_URL}/admin/articles/${article._id}`); // Call delete API
            toast.success('Article deleted.', {
                autoClose: 1000,
                onClose: () => {
                    router.back(); // Navigate back after deletion
                },
            });
        } catch (error) {
            console.error('Error deleting article:', error);
            toast.error('Error deleting article.', {
                autoClose: 1000, // Show error message for 1 second
            });
        }
    };

    // Function to update the article's status
    const handleStatusChange = async (newStatus: string) => {
        if (!article) return; // Return if no article is available
        try {
            await axios.post(`${API_URL}/admin/articles/${article._id}/status`, {
                status: newStatus, // Send updated status
            });
            setArticle({ ...article, status: newStatus }); // Update article data with new status
            toast.success('Article status updated successfully.'); // Show success message
        } catch (error) {
            console.error('Error updating article status:', error);
            toast.error('Error updating article status.', {
                autoClose: 1000, // Show error message for 1 second
            });
        }
    };

    // Render error message if any error occurred
    if (error) {
        return <p>{error}</p>;
    }

    // Show loading message while article data is being fetched
    if (!article) {
        return <p>Loading article details...</p>;
    }

    // Main return block to render the component
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

            {/* Summary Section */}
            <p className={formStyles.sectionSeparator}><span>Summary</span></p>
            <p className={styles.text}>{article.summary}</p>

            {/* Claim Section */}
            <p className={formStyles.sectionSeparator}><span>Claim</span></p>
            {activeEditField === 'claim' ? (
                <textarea
                    className={styles.input}
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)} // Update claim state
                    placeholder="Enter the claim"
                    rows={5}
                    cols={50}
                ></textarea>
            ) : (
                <p className={styles.text}>{article.claim || 'No claim available'}</p>
            )}
            {activeEditField === 'claim' ? (
                <button className={formStyles.addButton} onClick={handleSaveClaim}>Save Claim</button> // Save updated claim
            ) : (
                <button className={formStyles.addButton} onClick={() => handleEdit('claim')}>Edit Claim</button> // Edit claim button
            )}

            {/* Evidence Section */}
            <p className={formStyles.sectionSeparator}><span>Evidence of the Claim</span></p>
            {activeEditField === 'evidence' ? (
                <textarea
                    className={styles.input}
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)} // Update evidence state
                    placeholder="Enter the evidence to support the claim"
                    rows={5}
                    cols={50}
                ></textarea>
            ) : (
                <p className={styles.text}>{article.evidence || 'No evidence available'}</p>
            )}
            {activeEditField === 'evidence' ? (
                <button className={formStyles.addButton} onClick={handleSaveEvidence}>Save Evidence</button> // Save updated evidence
            ) : (
                <button className={formStyles.addButton} onClick={() => handleEdit('evidence')}>Edit Evidence</button> // Edit evidence button
            )}

            {/* Analysis Notes Section */}
            <p className={formStyles.sectionSeparator}><span>Analysis Notes</span></p>
            {activeEditField === 'analysis_notes' ? (
                <textarea
                    className={styles.input}
                    value={analysisNotes}
                    onChange={(e) => setAnalysisNotes(e.target.value)} // Update analysis notes state
                    placeholder="Enter your analysis notes"
                    rows={5}
                    cols={50}
                ></textarea>
            ) : (
                <p className={styles.text}>{article.analysis_notes || 'No analysis notes available'}</p>
            )}
            {activeEditField === 'analysis_notes' ? (
                <button className={formStyles.addButton} onClick={handleSaveAnalysisNotes}>Save Analysis Notes</button> // Save updated analysis notes
            ) : (
                <button className={formStyles.addButton} onClick={() => handleEdit('analysis_notes')}>Edit Analysis Notes</button> // Edit analysis notes button
            )}

            {/* Evidence Summary Section */}
            <p className={formStyles.sectionSeparator}><span>Evidence Summary</span></p>
            <div className={formStyles.form}>
                <select
                    className={formStyles.input}
                    value={evidenceSummary || ''}
                    onChange={(e) => {
                        const newEvidenceSummary = e.target.value as 'weak' | 'moderate' | 'strong' | '';
                        setEvidenceSummary(newEvidenceSummary || null); // Update evidence summary state
                        handleEvidenceSummaryChange(newEvidenceSummary); // Update evidence summary in backend
                    }}
                    required
                >
                    <option value="">Select Evidence Strength</option>
                    <option value="weak">Weak</option>
                    <option value="moderate">Moderate</option>
                    <option value="strong">Strong</option>
                </select>
            </div>

            {/* Article Status Section */}
            <p className={formStyles.sectionSeparator}><span>Article Status</span></p>
            <div>
                <select
                    id="status"
                    value={editableStatus}
                    onChange={(e) => {
                        const newStatus = e.target.value; // Get new status from dropdown
                        setEditableStatus(newStatus); // Update status state
                        handleStatusChange(newStatus); // Update article status in backend
                    }}
                    className={formStyles.input}
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status.replace(/_/g, ' ')} {/* Replace underscores with spaces for readability */}
                        </option>
                    ))}
                </select>
                <br />
            </div>
            <br />

            {/* Button to delete the article */}
            <button className={formStyles.removeButton} onClick={handleDeleteArticle}>Delete Article</button>
            <br />
            <br />

            {/* Button to navigate back to the dashboard */}
            <button className={formStyles.addButton} onClick={() => router.back()}>Back to Dashboard</button>
            <br />
            
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

export default ArticleDetails; // Export the component for use in other parts of the application
