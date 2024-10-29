import React, { useState, useEffect } from 'react';
import NSTPLogo from '../assets/nstp.png';

const MESSAGES = ["Please Wait...", "Loading...", "Hang tight...", "Almost there...", "Just a moment...", "Working on it...", "Almost done..."];

const NSTPLoader = ({ display }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (display) {
      setMessage(display);
    } else {
      const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setMessage(randomMessage);
    }
  }, [display]);

  return (
    <div className=" fixed inset-0 lg:left-20 flex flex-col items-center justify-center bg-base-100 z-50">
      <img src={NSTPLogo} alt="NSTP Logo" className="w-20 h-20 animate-jump animate-infinite animate-duration-[1500ms] animate-delay-0 animate-ease-linear" />
      <p className="text-lg font-sm mt-3 text-primary ml-2">{message}</p>
    </div>
  );
};

export default NSTPLoader;