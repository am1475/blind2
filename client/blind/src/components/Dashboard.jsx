import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidateText, challengeText, startTime, endTime } = location.state || {};
  
  const [accuracy, setAccuracy] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!candidateText || !challengeText || !startTime || !endTime) {
    return <div className="p-4 text-red-600">Missing test data. Please take the test first.</div>;
  }

  // Function to compute results and send POST request
  const handleSubmitResults = () => {
    // Guard against multiple submissions
    if (submitted) return;
    setSubmitted(true);

    const sanitize = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
    
    const candidateWords = sanitize(candidateText).split(/\s+/);
    const challengeWords = sanitize(challengeText).split(/\s+/);
    
    let correct = 0;
    for (let i = 0; i < challengeWords.length; i++) {
      if (candidateWords[i] && candidateWords[i] === challengeWords[i]) {
        correct++;
      }
    }
    
    const computedAccuracy = (correct / challengeWords.length) * 100;
    setAccuracy(computedAccuracy.toFixed(2));
    
    const computedTime = ((endTime - startTime) / 1000).toFixed(2); // in seconds
    setTimeTaken(computedTime);

    const resultData = {
      accuracy: computedAccuracy,
      timeTaken: computedTime,
      timestamp: new Date(),
    };

    fetch('http://localhost:5000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Result stored:', data);
      })
      .catch(err => {
        console.error('Error storing result:', err);
      });
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl mb-4 font-bold">Test Results</h1>
      {(accuracy !== null && timeTaken !== null) ? (
        <>
          <p className="mb-2 text-lg">
            Accuracy: <span className="font-bold">{accuracy}%</span>
          </p>
          <p className="mb-4 text-lg">
            Time Taken: <span className="font-bold">{timeTaken} seconds</span>
          </p>
          <button
            onClick={handleViewResults}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Leaderboard
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleSubmitResults}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
            disabled={submitted}  // disable after submission
          >
            Submit Results
          </button>
        </>
      )}
    </div>
  );
}

export default Dashboard;
