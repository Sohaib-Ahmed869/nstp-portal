import React from 'react';
import { PencilIcon, TrashIcon, CalendarDaysIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DUMMY_PHOTO_URLS = [
    "https://media.istockphoto.com/id/1363105039/photo/businesspeople-do-video-conference-call-with-big-wall-tv-in-office-meeting-room-diverse-team.jpg?s=612x612&w=0&k=20&c=o7UjhyG3YmLj7jTtSdMkN-K_tE4HSfAq9wWdhiRDFAA=",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-8D4isLqFIao-pvIKzhUSgfZi3VPePVk07A&s",
    "https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg",
]

const getRandomPhotoUrl = () => {
    return DUMMY_PHOTO_URLS[Math.floor(Math.random() * DUMMY_PHOTO_URLS.length)];
};



const RoomList = ({ rooms, onEdit, onDelete }) => {
    const [expandedRoomId, setExpandedRoomId] = React.useState(null);

    const toggleExpand = (roomId) => {
        setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
    };

    return (
        <div className="flex flex-col gap-5">
            {rooms.map((room) => (
                <div
                    key={room.id}
                    className={`relative card p-5 rounded-lg transition-all duration-300 ${expandedRoomId === room.id ? 'transform scale-95' : ''}`}
                >
                    <div className="absolute top-0 p-3 rounded-tr-md rounded-br-md right-0 h-full bg-primary flex items-center justify-center cursor-pointer" onClick={() => toggleExpand(room.id)}>
                        <ChevronRightIcon className={`size-6 text-base-100 transition-transform duration-300 ${expandedRoomId === room.id ? 'rotate-180' : ''}`} />
                    </div>
                    <div className='flex items-center gap-3 mb-3'>
                        <img
                            src={getRandomPhotoUrl()}
                            alt="Meeting Room"
                            className="size-20 rounded-full object-cover"
                        />
                        <h1 className='text-xl font-semibold border-r border-r-gray-200 pr-4 ml-3'>{room.name}</h1>
                        <p className='text-gray-500'>{"Floor " + room.floor}</p>
                    </div>
                    {expandedRoomId === room.id && (
                        <div className="flex flex-col">
                            <div>
                                <p>Room timings: {room.startTime} - {room.endTime}</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Link to="/admin/bookings" className="btn btn-primary text-base-100">
                                    <CalendarDaysIcon className='size-5' />
                                    View Bookings
                                </Link>
                                <button
                                    className='btn btn-outline btn-secondary text-white'
                                    onClick={() => onEdit(room)}
                                >
                                    <PencilIcon className='size-5' />
                                    Edit
                                </button>
                                <button
                                    className='btn btn-outline btn-error text-white'
                                    onClick={() => onDelete(room.id)}
                                >
                                    <TrashIcon className='size-5' />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RoomList;