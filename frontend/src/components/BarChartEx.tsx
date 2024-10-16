import React from 'react';

interface BarChartProps {
  scores: number[];
}

// Average scoring component
const AverageRating: React.FC<BarChartProps> = ({ scores }) => {
  // Calculate the average score
  const averageRating = (scores.reduce((sum, rating) => sum + rating, 0) / scores.length).toFixed(1);

  // Calculate the count of each star and create an array of objects
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: scores.filter((rating) => rating === star).length,
  }));

  // Sort by count in descending order
  starCounts.sort((a, b) => b.count - a.count);

  // Find the maximum count (used to calculate the bar scale)
  const maxCount = Math.max(...starCounts.map(item => item.count));

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2 style={{ textAlign: 'left' }}>
        Average Rating: <span style={{ color: '#ff0000', marginLeft: '10px' }}>{averageRating}</span> / 5
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {starCounts.map(({ star, count }, index) => (
          <li
            key={star}
            style={{
              textAlign: 'left',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Star label */}
            <span style={{
              minWidth: '80px',
            }}>{star} stars:</span>
            {/* Bar chart */}
            <div
              style={{
                height: '10px',
                minWidth: count > 0 ? `${(count / maxCount) * 100}%` : '10px', // Handle the case of 0.
                backgroundColor: '#ffd600',
                marginLeft: '10px',
                borderRadius: '5px',
                transition: 'width 0.3s ease', // Add animation transition effect
              }}
            ></div>
            {/* Number of people */}
            <span style={{ marginLeft: '15px' }}>{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AverageRating;
