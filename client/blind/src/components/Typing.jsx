// client/src/components/Typing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Typing() {
  const navigate = useNavigate();
  const challengeText = localStorage.getItem('challengeText') || '';
  const [candidateText, setCandidateText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const handleStart = () => {
    setTestStarted(true);
    setStartTime(Date.now());
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    // Pass data via router state to Dashboard
    navigate('/dashboard', { state: { candidateText, challengeText, startTime, endTime } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl text-white mb-8 font-bold">Blindfold Typing Challenge</h1>
      {testStarted ? (
        <div className="w-full max-w-2xl px-4">
          <textarea
            className="w-full h-40 p-4 bg-gray-800 text-white caret-white border border-gray-600 rounded focus:outline-none"
            placeholder="Type here..."
            value={candidateText}
            onChange={(e) => setCandidateText(e.target.value)}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="none"
          />
          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-full"
          >
            Submit Test
          </button>
        </div>
      ) : (
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600"
        >
          Start Test
        </button>
      )}
    </div>
  );
}

export default Typing;
