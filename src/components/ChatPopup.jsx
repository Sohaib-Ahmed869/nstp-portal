import React, { useState, useEffect, useRef, useContext } from 'react';
import { XMarkIcon, PaperAirplaneIcon, ChevronUpIcon, ChevronDownIcon, ChatBubbleLeftEllipsisIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { TenantService, AdminService, ReceptionistService } from '../services';
import { AuthContext } from '../context/AuthContext';
import showToast from '../util/toast';

const ChatPopup = ({ onClose, complaintType, complaintSelectedForChat, setComplaintSelectedForChat, complaintId }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    const staffRole = complaintType === "services" ? "Receptionist" : "Admin";
    const { role } = useContext(AuthContext);

    const chatContainerRef = useRef(null);
    const detailsRef = useRef(null);

    useEffect(() => {
        if (complaintSelectedForChat?.chatHistory) {
            let chat = complaintSelectedForChat.chatHistory;
            // sort chat by date
            chat = chat.sort((a, b) => new Date(a.date) - new Date(b.date));
            chat = chat.map((chat) => ({
                timeStamp: new Date(chat.date).toISOString(),
                from: chat.is_tenant? 'user' : 'staff',
                message: chat.feedback,
            }));

            setChatHistory(chat);
        } else {
            setChatHistory([]);
        }
    }, [complaintSelectedForChat]);

    const handleSendMessage = async () => {
        const newMessage = message.trim();
        if (newMessage === '') return;

        let response;
        if (role === 'tenant') {
            response = await TenantService.giveComplaintFeedback(complaintId, newMessage);
        } else if (role === 'admin') {
            response = await AdminService.giveComplaintFeedback(complaintId, newMessage);
        } else if (role === 'receptionist') {
            response = await ReceptionistService.giveComplaintFeedback(complaintId, newMessage);
        }

        if (response.error) {
            console.error(response.error);
            showToast(false, response.error);
            return;
        }

        const newChatMessage = {
            timeStamp: new Date().toISOString(),
            from: role === 'tenant' ? 'user' : 'staff',
            message: newMessage,
        };

        setChatHistory((prevHistory) => [...prevHistory, newChatMessage]);
        setMessage('');

        // const newMessage = {
        //     timeStamp: new Date().toISOString(),
        //     from: 'user',
        //     message: message.trim(),
        // };

        // setChatHistory((prevHistory) => [...prevHistory, newMessage]);
        // setMessage('');

        // setTimeout(() => {
        //     setIsTyping(true);
        //     setTimeout(() => {
        //         setIsTyping(false);
        //         const responseMessage = {
        //             timeStamp: new Date().toISOString(),
        //             from: 'staff',
        //             message: "I'm sorry to hear you've been facing this issue. I will take the action to fix it.",
        //         };
        //         setChatHistory((prevHistory) => [...prevHistory, responseMessage]);
        //     }, 3000);
        // }, 3000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const scrollToDetails = () => {
        if (detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: 'smooth' });
            setIsDetailsVisible(true);
        }
    };

    // Check if details are visible in viewport
    const checkDetailsVisibility = () => {
        if (chatContainerRef.current && detailsRef.current) {
            const containerRect = chatContainerRef.current.getBoundingClientRect();
            const detailsRect = detailsRef.current.getBoundingClientRect();
            setIsDetailsVisible(
                detailsRect.top >= containerRect.top &&
                detailsRect.bottom <= containerRect.bottom
            );
        }
    };

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', checkDetailsVisibility);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', checkDetailsVisibility);
            }
        };
    }, [chatHistory, isTyping]);

    const getUrgencyLabel = (urgency) => {
        switch (urgency) {
            case 3: return "High";
            case 2: return "Medium";
            case 1: return "Low";
            default: return "N/A";
        }
    };

    const closeChat = (    )   => {
        
        setComplaintSelectedForChat((prevComplaint) => ({
            ...prevComplaint,
            chatHistory: chatHistory,
        }));
        //API CALL HERE TO UPDATE COMPLAINT
        onClose();
    }

    return (
        <div className="fixed bottom-0 right-5 w-full h-full lg:w-96 lg:h-[35rem] z-50 bg-base-100 shadow-lg rounded-lg flex flex-col">
            {/* Header */}
            <div className="flex flex-col border-b border-base-200">
                <div className="flex justify-between items-center p-4">
                    <h3 className="font-bold text-lg">Chat with NSTP</h3>
                    <button onClick={closeChat}>
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                
                {/* Complaint Quick Access Ribbon - shown when details not visible */}
                {!isDetailsVisible && (
                    <button 
                        onClick={scrollToDetails}
                        className="flex items-center justify-between w-full p-2 bg-primary bg-opacity-10 hover:bg-opacity-20 transition-all"
                    >
                        <span className="font-medium text-primary">
                            {complaintSelectedForChat.type === 'general' 
                                ? complaintSelectedForChat.subject 
                                : complaintSelectedForChat.serviceType}
                        </span>
                        <ChevronUpIcon className="h-4 w-4 text-primary" />
                    </button>
                )}
            </div>

            {/* Chat Container */}
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto scrollbar-hide p-4">
                {/* Pinned Complaint Details */}
                <div 
                    ref={detailsRef}
                    className="mb-4 p-4 rounded-lg border-2 border-secondary border-opacity-40 bg-base-100"
                >
                    <h4 className="text-center font-bold text-primary mb-3">
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 inline-block mr-1" />
                        Complaint Details</h4>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="font-semibold">Type:</span> {complaintSelectedForChat.type === 'general' 
                                ? 'General' 
                                : 'Service Request'}
                        </p>
                        <p>
                            <span className="font-semibold">{complaintSelectedForChat.type === 'general' 
                                ? 'Subject' 
                                : 'Service Type'}:</span> {complaintSelectedForChat.type === 'general'
                                    ? complaintSelectedForChat.subject
                                    : complaintSelectedForChat.serviceType}
                        </p>
                        <p>
                            <span className="font-semibold">Description:</span> {complaintSelectedForChat.description}
                        </p>
                        <p>
                            <span className="font-semibold">Urgency:</span> {getUrgencyLabel(complaintSelectedForChat.urgency)}
                        </p>
                        <p>
                            <span className="font-semibold">Date Submitted:</span> {complaintSelectedForChat.date}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span> {complaintSelectedForChat.isResolved ? 'Resolved' : 'Pending'}
                        </p>
                        {complaintSelectedForChat.isResolved && (
                            <p>
                                <span className="font-semibold">Resolved Date:</span> {complaintSelectedForChat.dateResolved}
                            </p>
                        )}
                    </div>
                </div>

                {/* Chat Messages */}
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat ${((chat.from === 'staff' && role == 'tenant') || (chat.from === "user" && role !== "tenant") ) ? 'chat-start' : 'chat-end'}`}>
                        <div className={`chat-bubble ${((chat.from === 'staff' && role == 'tenant') || (chat.from === "user" && role !== "tenant") ) ? 'chat-bubble-primary bg-opacity-35' : 'chat-bubble-secondary'}`}>
                            {chat.message}
                        </div>
                        <div className="chat-footer opacity-50">
                            {
                                ((chat.from == "user" && role == "tenant") || (chat.from == "staff" && role != "tenant") ) ? "You" 
                                :
                                (chat.from == "staff" && role == "tenant") ? staffRole
                                :
                                (chat.from == "user" && role != "tenant") ? "Tenant" : "Anonymous Person"

                            }
                            <time className="text-xs ml-2 opacity-50">
                                {new Date(chat.timeStamp).toLocaleTimeString()}
                            </time>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="chat chat-start">
                        <div className="chat-bubble chat-bubble-primary bg-opacity-35">
                            <span className="loading loading-dots loading-sm"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-base-200">
                <div className="flex items-center">
                  { 
                    complaintSelectedForChat.isResolved ? 
                    <div className="flex items-center  w-full p-4 bg-primary text-secondary bg-opacity-10 rounded-lg transition-all">
                       <CheckBadgeIcon className="size-5 mr-2" />
                        <span className="font-medium ">
                            This complaint is already resolved
                        </span>
                    </div> 
                    :
                   <>
                     <input
                         type="text"
                         className="input input-bordered w-full mr-2"
                         placeholder="Type your message here..."
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         onKeyPress={handleKeyPress}
                     />
                     <button className={`btn btn-primary `} onClick={handleSendMessage}>
                         <PaperAirplaneIcon className="h-5 w-5 text-white" />
                     </button>
                   </>}
                </div>
            </div>
        </div>
    );
};

export default ChatPopup;