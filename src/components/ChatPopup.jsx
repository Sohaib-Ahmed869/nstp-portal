import React, { useState } from 'react';
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ChatPopup = ({ chatHistory, setChatHistory, onClose, complaintType }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const staffRole = complaintType === "services" ? "Receptionist" : "Admin";

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        const newMessage = {
            timeStamp: new Date().toISOString(),
            from: 'user',
            message: message.trim(),
        };

        setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        setMessage('');

        setTimeout(() => {
            // Simulate typing and response
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const responseMessage = {
                timeStamp: new Date().toISOString(),
                from: 'staff',
                message: "I'm sorry to hear you've been facing this issue. I will take the action to fix it.",
            };
            setChatHistory((prevHistory) => [...prevHistory, responseMessage]);
        }, 3000); // 3 seconds typing + 3 seconds delay

        }, 3000)
       
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-0 right-5 w-full h-full lg:w-80 lg:h-[35rem] z-50 bg-white shadow-lg rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Chat with NSTP</h3>
                <button onClick={onClose}>
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
            </div>
            <div className="overflow-y-auto flex-grow mb-4">
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat ${chat.from === 'staff' ? 'chat-start' : 'chat-end'}`}>
                        <div className={`chat-bubble ${chat.from === 'staff' ? 'chat-bubble-primary bg-opacity-35' : 'chat-bubble-secondary'}`}>
                            {chat.message}
                        </div>
                        <div className="chat-footer opacity-50">
                            {chat.from === 'staff' ? staffRole : 'You'}
                            <time className="text-xs ml-2 opacity-50">{new Date(chat.timeStamp).toLocaleTimeString()}</time>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="chat chat-start">
                        <div className="chat-bubble chat-bubble-primary bg-opacity-35">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                        <div className="chat-footer opacity-50">
                            {staffRole}
                            <time className="text-xs ml-2 opacity-50">{new Date().toLocaleTimeString()}</time>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    className="input input-bordered w-full mr-2"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                    <PaperAirplaneIcon className="h-5 w-5 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ChatPopup;