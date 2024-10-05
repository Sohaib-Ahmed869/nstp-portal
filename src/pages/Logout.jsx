import React, { useState, useEffect } from 'react';
import NSTPLoader from '../components/NSTPLoader';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call with a timeout of 2 seconds
    setTimeout(() => {
      setLoading(false);
      // Navigate to the login page or home page after logout
      navigate('/');
    }, 2000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen ">
      {loading ? (
        <NSTPLoader display={"Logging out..."} />
      ) : (
        <div>
          <p>Successfully logged out.</p>
        </div>
      )}
    </div>
  );
};

export default Logout;