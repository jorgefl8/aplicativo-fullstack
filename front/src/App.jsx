import { useState, useEffect } from 'react';
import './App.css';

// Define the base URL for the API. We'll use a relative path.
const API_BASE_URL = ''; // Use relative paths for API calls

function App() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial points when the component mounts
  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from relative path /api/points
        const response = await fetch(`${API_BASE_URL}/api/points`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPoints(data.points);
      } catch (e) {
        console.error("Failed to fetch points:", e);
        setError('Failed to load points. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle point increments
  const handleIncrement = async () => {
    setError(null);
    try {
      // Post to relative path /api/points/increment
      const response = await fetch(`${API_BASE_URL}/api/points/increment`, {
        method: 'POST',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPoints(data.points);
    } catch (e) {
      console.error("Failed to increment points:", e);
      setError(e.message || 'Failed to increment points.');
    }
  };

  // Function to handle point decrements
  const handleDecrement = async () => {
    setError(null);
    try {
      // Post to relative path /api/points/decrement
      const response = await fetch(`${API_BASE_URL}/api/points/decrement`, {
        method: 'POST',
      });
       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPoints(data.points);
    } catch (e) {
      console.error("Failed to decrement points:", e);
       setError(e.message || 'Failed to decrement points.');
    }
  };

  return (
    <div className="App">
      <h1>Points Counter</h1>
      {loading ? (
        <p>Loading points...</p>
      ) : (
        <div className="counter-container">
          <p className="points-display">Points: {points}</p>
          <div className="button-group">
            <button
              onClick={handleDecrement}
              disabled={points <= 0} // Disable if points are 0 or less
              className="button decrement-button"
            >
              Decrement (-)
            </button>
            <button
              onClick={handleIncrement}
              disabled={points >= 10} // Disable if points are 10 or more
              className="button increment-button"
            >
              Increment (+)
            </button>
          </div>
        </div>
      )}
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
}

export default App; 