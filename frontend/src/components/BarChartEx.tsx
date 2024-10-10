import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import moment from 'moment';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

interface BarChartProps {
  articleId?: string;
}

interface Score {
  _id: string;
  doc_id: string,
  average_score: number,
  create_time: Date,
}

const BarChartEx: React.FC<BarChartProps> = ({ articleId }) => {

  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleScores = async () => {
      try {
        const response = await axios.get(`${API_URL}/scores/${articleId}`);
        let data = response.data;

        // 按 average_score 从大到小排序
        data = data.sort((a: any, b: any) => b.average_score - a.average_score);

        // 格式化 create_time
        data = data.map((item: any) => ({
          ...item,
          create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
        }));

        setScores(data);
      } catch (error) {
        console.error('Error fetching articles for analysis:', error);
        setError('Error fetching articles for analysis.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleScores();

  }, [articleId]);

  return (
    <>
      {
        isLoading ? (
          <p>Loading scores...</p>
        ) : error ? (
          <p>{error}</p>
        ) : scores.length > 0 ? (
          <BarChart width={800} height={600} data={scores} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="create_time" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="average_score" fill="#8884d8" />
          </BarChart>
        ) : (
          <p>No scores.</p>
        )
      }
    </>
  );
};



export default BarChartEx;