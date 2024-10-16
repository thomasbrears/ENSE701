import React from 'react';

interface BarChartProps {
  scores: number[];
}

// Average scoring component
const AverageRating: React.FC<BarChartProps> = ({ scores }) => {

  // Calculate the average score
  const averageRating = (scores.reduce((sum, rating) => sum + rating, 0) / scores.length).toFixed(1);

  // Calculate the count of each star.
  const starCounts = [5, 4, 3, 2, 1].map(
    (star) => scores.filter((rating) => rating === star).length
  );

  // Find the number of people with the highest rating (used to calculate the bar scale)
  const maxCount = Math.max(...starCounts);

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2 style={{ textAlign: 'left' }}>
        Average Rating: <span style={{ color: '#ff0000', marginLeft: '10px' }}>{averageRating}</span> / 5
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {starCounts.map((count, index) => (
          <li
            key={index}
            style={{
              textAlign: 'left',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Star label */}
            <span style={{
              width: '80px',
              marginRight: index === 0 ? '22px' : '0', // The first li adds a left margin. 
            }}>{5 - index} stars:</span>
            {/* bar chart */}
            <div
              style={{
                height: '10px',
                width: count > 0 ? `${(count / maxCount) * 100}%` : '10px', // Handle the case of 0.
                backgroundColor: '#ffd600',
                marginLeft: '10px',
                borderRadius: '5px',
                transition: 'width 0.3s ease', // Add animation transition effect
              }}
            ></div>
            {/* number of people */}
            <span style={{ marginLeft: '15px' }}>{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AverageRating;
