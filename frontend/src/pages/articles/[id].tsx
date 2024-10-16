import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from "next/router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "../../styles/ArticleDetails.module.scss";
import Rating from "../../components/Rating";
import BarChartEx from "../../components/BarChartEx";

// Define the props for the article details
interface ArticleDetailsProps {
  article: {
    id: string;
    title: string;
    authors: string;
    journal: string;
    se_practice: string | null;
    research_type: string | null;
    publication_year: string;
    volume: string | null;
    number: string | null;
    pages: string | null;
    doi: string;
    claim: string;
    evidence: string | null;
    evidence_summary: string | null;
    analysis_notes: string | null;
    summary: string;
  };
}

// API URL based on environment (production or development)
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

// ArticleDetails component to display the article
const ArticleDetails: NextPage<ArticleDetailsProps> = ({ article }) => {
  const router = useRouter();

  // State to store rating, average score, and scores for the chart
  const [rating, setRating] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [scores, setScores] = useState<number[]>([]);

  // Fetch the average score and scores when the article is loaded
  useEffect(() => {
    if (article?.id) {
      const fetchAverageScore = async () => {
        try {
          const averageScore = await getAverageScore(article.id);
          setScore(averageScore);
          const scores = await getArticleScores(article.id);
          setScores(scores);
        } catch (error) {
          toast.error("Failed to load average score.");
          console.error("Error fetching average score:", error);
        }
      };

      fetchAverageScore();
    }
  }, [article?.id]);

  // Fallback for loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Function to fetch the average score of the article
  async function getAverageScore(id: string) {
    const result = await axios.get(`${API_URL}/scores/average/${id}`);
    const average_score: number = result.data.average_score || 0;
    return average_score;
  }

  // Function to fetch all scores for the article
  async function getArticleScores(articleId: string) {
    const response = await axios.get(`${API_URL}/scores/${articleId}`);
    let data = response.data;

    // Sort data by average_score in descending order
    data = data.sort((a: any, b: any) => b.average_score - a.average_score);
    const scoresArray: [] = data.map((item: any) => item.average_score);

    return scoresArray;
  }

  // Handler for rating change
  function handleRatingChange(rating: number) {
    setRating(rating);
  }

  // Function to submit the user's rating
  async function handleSubmitRating() {

    if (rating === 0) {
      toast.error("Please select the number of stars.");
      return;
    }
    
    try {
      const result = await axios.post(`${API_URL}/scores/`, {
        doc_id: article.id,
        average_score: rating,
      });

      if (result.status === 201) {
        // Update the average score and scores after submitting
        const newAverageScore = await getAverageScore(article.id);
        setScore(newAverageScore);
        const newScores = await getArticleScores(article.id);
        setScores(newScores);
        toast.success("Rating submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      toast.error("Failed to submit the rating. Please try again.");
    }
  }

  return (
    <div className={styles.container}>
      {/* Article Title */}
      <h1 className={styles.title}>{article.title}</h1>

      <div className={styles.divider}></div>

      {/* Article Information */}
      <div className={styles.subtitle}>
        <b>{article.journal}</b>
        <br />
        (Volume: <b>{article.volume}</b>, Number: <b>{article.number}</b>, Pages: <b>{article.pages}</b>)
        <br />
        Published in <b>{article.publication_year}</b> by <b>{article.authors}</b>
        <br />
        DOI: <b>{article.doi}</b>
        <br />
        Type of Research: <b>{article.research_type}</b>
        <br />
        Software Engineering Practice: <b>{article.se_practice}</b>
        <br />
        <h2>Average User Rating: <span style={{ color: 'red' }}>{score}</span></h2>
      </div>

      {/* Article Summary */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p className={styles.text}>{article.summary}</p>
      </div>

      {/* Conditional Rendering of Claims, Evidence, Analyst Notes, and Evidence Summary */}
      {article.claim && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Claims</h2>
          <p className={styles.text}>{article.claim}</p>
        </div>
      )}

      {article.evidence && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Evidence of the Claims</h2>
          <p className={styles.text}>{article.evidence}</p>
        </div>
      )}

      {article.analysis_notes && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Analyst Notes</h2>
          <p className={styles.text}>{article.analysis_notes}</p>
        </div>
      )}

      {article.evidence_summary && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Evidence Summary</h2>
          <p className={styles.text}>{article.evidence_summary}</p>
        </div>
      )}

      {/* Rating Section */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
        Please rate this article:
        <Rating onChange={handleRatingChange} />
        <button
          style={{ marginLeft: '10px' }}
          onClick={handleSubmitRating}
          onMouseEnter={() => {
            if (rating === 0) {
              toast.error("Please select the number of stars.");
            }
          }}
          disabled={rating === 0} // Disable the submit button if rating is 0
        >
          Submit Rating
        </button>
      </div>

      {/* Bar Chart */}
      <div style={{ marginTop: '30px' }}>
        <BarChartEx scores={scores} />
      </div>

      {/* Toast Notifications */}
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

// Get the paths for static generation of articles
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles/published`);
    const articles = response.data;

    const paths = articles.map((article: any) => ({
      params: { id: article._id },
    }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
};

// Fetch article details at build time
export const getStaticProps: GetStaticProps<ArticleDetailsProps> = async ({ params }) => {
  try {
    const response = await axios.get(`${API_URL}/articles/${params?.id}`);
    const article = response.data;

    return {
      props: {
        article: {
          id: article._id,
          title: article.title || "No title available",
          authors: article.authors ? article.authors.join(", ") : "No authors available",
          journal: article.journal || "No journal name available",
          se_practice: article.se_practice || "No SE practice available",
          research_type: article.research_type || "No research type available",
          publication_year: article.publication_year?.toString() || "Unknown",
          volume: article.volume || "-",
          number: article.number || "-",
          pages: article.pages || "-",
          doi: article.doi || "No DOI available",
          claim: article.claim || "No Claim available",
          evidence: article.evidence || "No Evidence not available",
          evidence_summary: article.evidence_summary || "No evidence summary available",
          analysis_notes: article.analysis_notes || "No analysis notes available",
          summary: article.summary || "No summary available",
        },
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    toast.error("Failed to load article details.");
    console.error("Error fetching article details:", error);
    return {
      notFound: true, // Return 404 if article is not found
    };
  }
};

export default ArticleDetails;
