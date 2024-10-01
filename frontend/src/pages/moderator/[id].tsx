import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/ArticleDetails.module.scss";
import Rating from "@/components/Rating";

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
    summary: string;
  };
}

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

const ArticleDetails: NextPage<ArticleDetailsProps> = ({ article }) => {
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // Fetch average score when the article changes
    if (article.id) {
      const fetchAverageScore = async () => {
        const result = await getAverageScore(article.id);
        setScore(result);
      };
      fetchAverageScore();
    }
  }, [article.id]);

  if (router.isFallback) {
    return <div>Loading...</div>; // Handle fallback state
  }

  async function getAverageScore(id: string) {
    const result = await axios.get(`${API_URL}/scores/average/${id}`);
    const average_score: number = result.data.average_score || 0;
    return average_score;
  }

  function handleRatingChange(rating: number) {
    setRating(rating);
  }

  async function handleSubmitRating() {
    try {
      const result = await axios.post(`${API_URL}/scores/`, {
        doc_id: article.id,
        average_score: rating,
      });

      if (result.status === 201) {
        const newAverageScore = await getAverageScore(article.id);
        setScore(newAverageScore);
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("Failed to submit the score. Please try again.");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{article.title}</h1>
      <div className={styles.divider}></div>
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
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Summary</h2>
        <p className={styles.text}>{article.summary}</p>
      </div>

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
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/published`);
    const articles = response.data;

    const paths = articles.map((article: any) => ({
      params: { id: article._id },
    }));

    return {
      paths,
      fallback: 'blocking', // Use fallback blocking for better UX
    };
  } catch (error) {
    console.error("Error fetching paths:", error);
    return {
      paths: [],
      fallback: 'blocking', // Ensure pages are built on demand if data is missing
    };
  }
};

export const getStaticProps: GetStaticProps<ArticleDetailsProps> = async ({ params }) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${params?.id}`);
    const article = response.data;

    if (!article) {
      return { notFound: true }; // Return 404 if no article is found
    }

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
          summary: article.summary || "No summary available",
        },
      },
      revalidate: 60, // Revalidate the page every 60 seconds
    };
  } catch (error) {
    console.error("Error fetching article details:", error);
    return {
      notFound: true, // Return 404 if an error occurs
    };
  }
};

export default ArticleDetails;
