import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { getArticleById, getAvagerScore } from "./all-articles";
import Rating from "@/components/Rating";
import axios from "axios";



const ArticleDetails = () => {
  const router = useRouter();
  const id: any = router.query.id ?? "";

  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const handleRatingChange = (rating: number) => {
    setCurrentRating(rating);
  };

  async function handleSubmitRating() {
    console.log("Submit Score", currentRating);
    try {
      const result = await axios.post("http://127.0.0.1:8000/api/scores/", {
        doc_id: id,
        average_score: currentRating
      });

      if (result.status == 201) {
        alert("Scoring success");

        try {
          const result = await getAvagerScore(id);
          setScore(result);
        } catch (err) {
          setError("Failed to fetch article score.");
        } finally {
          // setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("Failed to submit the score. Please try again.");
    }
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const result = await getArticleById(id);
        setArticle(result);
      } catch (err) {
        setError("Failed to fetch article");
      } finally {
        // setLoading(false);
      }
    };

    const fetchScore = async () => {
      try {
        const result = await getAvagerScore(id);
        setScore(result);
      } catch (err) {
        setError("Failed to fetch article score.");
      } finally {
        // setLoading(false);
      }
    }

    if (id) {
      Promise.all([fetchArticle(), fetchScore()]).then(() => {
        setLoading(false);
      });
      // fetchArticle();
      // fetchScore();
      // Promise.all([fetchArticle]);
    }
  }, [id]);


  if (loading) {
    return <div className="container">
      <h1>Article Details Placeholder</h1>
      <p>This is the Article Details page.</p>
      <div>
        Loading...
      </div>
    </div>;
  }

  if (error) {
    return <div className="container">
      <h1>Article Details Placeholder</h1>
      <p>This is the Article Details page.</p>
      <div>
        Error: {error}
      </div>
    </div>;
  }

  return (
    <div className="container">
      <h1>{article.title}</h1>
      <p>{article.summary}</p>
      <div style={{
        textAlign: 'center'
      }}>
      </div>

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

      <div style={{ marginTop: '10px', color: 'red' }}>
        This is a repetitive article.
      </div>
    </div>
  );
};

export default ArticleDetails;
