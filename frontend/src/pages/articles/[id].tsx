import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState } from 'react';
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
  baseURL: string;
}

const ArticleDetails: NextPage<ArticleDetailsProps> = ({ article, baseURL }) => {
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  async function getAvagerScore(id: string) {
    const result = await axios.get(baseURL + `/api/scores/average/${id}`);
    const average_score: number = result.data.average_score || 0;
    return average_score;
  }

  function handleRatingChange(rating: number) {
    setRating(rating);
  }

  async function handleSubmitRating() {
    try {
      const result = await axios.post(baseURL + `/api/scores/`, {
        doc_id: article.id,
        average_score: rating
      });

      if (result.status == 201) {
        const result = await getAvagerScore(article.id);
        setScore(result);
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


      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '30px'
      }}>
        Please grade the article:
        <Rating onChange={handleRatingChange}></Rating>
        <button style={{
          marginLeft: '10px'
        }} onClick={handleSubmitRating}>Submit Rating</button>
        <div style={{
          marginLeft: '10px'
        }}>Average score of articles: <span style={{ color: 'red' }}>{score}</span></div>
      </div>

    </div>
  );
};


export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios.get(process.env.ACCESS_URL + `/api/articles/published`);
  const articles = response.data;

  const paths = articles.map((article: any) => ({
    params: { id: article._id },
  }));

  return {
    paths,
    fallback: true, // Enable fallback pages
  };
};

export const getStaticProps: GetStaticProps<ArticleDetailsProps> = async ({ params }) => {
  try {
    const response = await axios.get(process.env.ACCESS_URL + `/api/articles/${params?.id}`);
    const article = response.data;

    // Log the article data to see what is being retrieved
    console.log("Fetched article data:", article);

    return {
      props: {
        baseURL: process.env.ACCESS_URL || "",
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
    };
  } catch (error) {
    console.error("Error fetching article details:", error);
    return {
      notFound: true, // Return 404 if article is not found
    };
  }
};

export default ArticleDetails;
