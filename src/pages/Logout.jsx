import React, { useState, useEffect, useContext } from 'react';
import NSTPLoader from '../components/NSTPLoader';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      logout();
      // Navigate to the login page or home page after logout
      navigate('/');
    }, 1200);
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