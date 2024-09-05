import React, { useState, useEffect } from 'react';
import NSTPLogo from '../assets/nstp.png';

const MESSAGES = ["Please Wait...", "Loading...", "Hang tight...", "Almost there...", "Just a moment...", "Working on it...", "Almost done..."];

const NSTPLoader = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(randomMessage);
  }, []);

  return (
    <div className="loader-container w-full min-h-screen overflow-hidden overflow-y-hidden overflow-x-hidden  flex flex-col items-center justify-center"> 
      <img src={NSTPLogo} alt="NSTP Logo" className="w-20 h-20 animate-spin animate-infinite animate-ease-in-out" />
      <p className="text-lg font-sm mt-3 text-primary ml-2">{message}</p>
    </div>
  );
};

export default NSTPLoader;