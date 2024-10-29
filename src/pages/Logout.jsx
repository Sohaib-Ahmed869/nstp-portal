import React, { useState, useEffect, useContext } from 'react';
import NSTPLoader from '../components/NSTPLoader';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AuthService } from '../services';
import showToast from '../util/toast';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {

    async function logoutUser() {
      try {
        const response = await AuthService.logout();
        setTimeout(() => {
          console.log("🚀 ~ logoutUser ~ response", response);
        if (response.error) {
          console.error(response.error);
        }
        logout();
        showToast(true, response.message);
        navigate('/');
        setLoading(false);
        }, 1000)
      } catch (error) {
        console.error(error);
        setLoading(false);
      } 
    }

    logoutUser();
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