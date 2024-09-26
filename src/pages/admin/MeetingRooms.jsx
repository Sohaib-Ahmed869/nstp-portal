import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { PlusCircleIcon, PencilIcon, ChevronRightIcon, MagnifyingGlassIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const DUMMY_PHOTO_URLS = [
    "https://media.istockphoto.com/id/1363105039/photo/businesspeople-do-video-conference-call-with-big-wall-tv-in-office-meeting-room-diverse-team.jpg?s=612x612&w=0&k=20&c=o7UjhyG3YmLj7jTtSdMkN-K_tE4HSfAq9wWdhiRDFAA=",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-8D4isLqFIao-pvIKzhUSgfZi3VPePVk07A&s",
    "https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg",
]

const MeetingRooms = () => {
    const [loading, setLoading] = useState(true);
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});

    // State for form fields
    const [newRoom, setNewRoom] = useState({
        name: '',
        floor: '',
        startTime: '',
        endTime: '',
        seatingCapacity: '',
    });

    const validateTime = (time) => {
        const regex = /^([01]?\d|2[0-3]?):?([0-5]?\d?)$/;
        return regex.test(time);
    };

    const isCompleteTime = (time) => {
        const completeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return completeRegex.test(time);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if ((name === 'startTime' || name === 'endTime') && !validateTime(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'Invalid time format',
            }));
            return;
        }

        if ((name === 'startTime' || name === 'endTime') && isCompleteTime(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }

        setNewRoom((prevRoom) => ({
            ...prevRoom,
            [name]: value,
        }));
    };


    // Function to handle form submission for editing a room
    const saveEditedRoom = () => {
        setModalLoading(true);
        setTimeout(() => {
            setMeetingRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room.id === currentRoomId
                        ? { ...room, ...newRoom }
                        : room
                )
            );

            setModalLoading(false);
            document.getElementById('add_room_form').close();
            resetForm();
        }, 2000);
    };

    // Function to handle form submission for adding a new room
    const handleSubmit = () => {
        setModalLoading(true);
        setTimeout(() => {
            console.log(newRoom);
            // Append to the meeting rooms array
            setMeetingRooms((prevRooms) => [
                ...prevRooms,
                {
                    id: (prevRooms.length + 1).toString(),
                    name: newRoom.name,
                    type: newRoom.type,
                    floor: newRoom.floor,
                    startTime: newRoom.startTime,
                    endTime: newRoom.endTime,
                    seatingCapacity: newRoom.seatingCapacity,
                    photoUrl: getRandomPhotoUrl(),
                },
            ]);

            setModalLoading(false);
            document.getElementById('add_room_form').close();
            resetForm();
        }, 2000);
    };

    // Function to handle form cancellation
    const handleCancel = () => {
        resetForm();
        document.getElementById('add_room_form').close();
    };


    // Function to reset form fields
    const resetForm = () => {
        setNewRoom({
            name: '',
            floor: '',
            startTime: '',
            endTime: '',
            seatingCapacity: '',
        });
        setIsEditMode(false);
        setCurrentRoomId(null);
    };


    // Function to handle edit button click
    const handleEdit = (roomId) => {
        const roomToEdit = meetingRooms.find(room => room.id === roomId);
        setNewRoom({
            name: roomToEdit.name,
            floor: roomToEdit.floor,
            startTime: roomToEdit.startTime,
            endTime: roomToEdit.endTime,
            seatingCapacity: roomToEdit.seatingCapacity,
        });
        setIsEditMode(true);
        setCurrentRoomId(roomId);
        document.getElementById('add_room_form').showModal();
    };

    const handleDelete = (roomId) => {
        setModalLoading(true);
        setTimeout(() => {
            setMeetingRooms((prevRooms) => prevRooms.filter(room => room.id !== roomId));
            setModalLoading(false);
            document.getElementById('delete_room_modal').close();
        }, 2000);

        console.log(`Delete room with id: ${roomId}`);
    };

    const toggleExpand = (roomId) => {
        setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
    };

    const filteredRooms = meetingRooms.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRandomPhotoUrl = () => {
        return DUMMY_PHOTO_URLS[Math.floor(Math.random() * DUMMY_PHOTO_URLS.length)];
    };


    useEffect(() => {
        // Api call here to fetch data and populate the above states
        // Dummy data for meeting rooms with photo URLs
        setMeetingRooms([
            { id: "1", name: "Room A", floor: 1, startTime: "11:20", endTime: "12:00", seatingCapacity: 50, photoUrl: getRandomPhotoUrl() },
            { id: "2", name: "Room B", floor: 4, startTime: "09:00", endTime: "03:00", seatingCapacity: 10, photoUrl: getRandomPhotoUrl() },
        ]);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            {/* Add/Edit Room Modal */}
            <dialog id="add_room_form" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">{isEditMode ? 'Edit Room' : 'Add New Room'}</h3>
                    <FloatingLabelInput
                        name="name"
                        type="text"
                        id="room_name"
                        label="Room Name"
                        value={newRoom.name}
                        onChange={handleInputChange}
                    />
                    <FloatingLabelInput
                        name="floor"
                        type="number"
                        id="room_floor"
                        label="Floor"
                        value={newRoom.floor}
                        onChange={handleInputChange}
                    />
                    <div className="flex gap-4">
                        <div className="flex w-1/2 flex-col">
                            <FloatingLabelInput
                                name="startTime"
                                type="text"
                                id="start_time"
                                label="Opening Time (HH:MM)"
                                value={newRoom.startTime}
                                onChange={handleInputChange}
                            />
                            {errors.startTime && <p className="text-red-500 -mt-5 text-sm">{errors.startTime}</p>}
                        </div>
                        <div className="flex flex-col w-1/2">
                            <FloatingLabelInput
                                name="endTime"
                                type="text"
                                id="end_time"
                                label="Closing Time (HH:MM)"
                                value={newRoom.endTime}
                                onChange={handleInputChange}
                            />
                            {errors.endTime && <p className="text-red-500 -mt-5 text-sm">{errors.endTime}</p>}
                        </div>
                    </div>
                    <FloatingLabelInput
                        name="seatingCapacity"
                        type="number"
                        id="seating_capacity"
                        label="Seating Capacity"
                        value={newRoom.seatingCapacity}
                        onChange={handleInputChange}
                    />
                    <div className="modal-action">
                        <button className="btn" onClick={handleCancel}>Cancel</button>
                        <button
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={isEditMode ? saveEditedRoom : handleSubmit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/** confirmation modal for deletion of room */}
            <dialog id="delete_room_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Delete Room</h3>
                    <p>Are you sure you want to delete this room?</p>
                    <div role="alert" className="alert my-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Warning: This action may result in unexpected behaviour or consequences</span>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-outline" onClick={() => document.getElementById('delete_room_modal').close()}>Cancel</button>
                        <button className={`btn btn-primary ${modalLoading && "btn-disabled"}`} onClick={() => { handleDelete(currentRoomId); }}>
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Main Page Content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}>
                {/* Header + add new room btn */}
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Meeting Rooms</h1>
                    <button
                        className="btn btn-primary text-white"
                        onClick={() => {
                            setIsEditMode(false);
                            document.getElementById("add_room_form").showModal();
                        }}
                    >
                        <PlusCircleIcon className="size-6" />
                        Add New Room
                    </button>
                </div>
                <hr className="my-5 text-gray-200" />

                <div className="relative w-full md:max-w-xs mb-5">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full pl-10"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
                <div className="flex flex-col gap-5">
                    {filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            className={`relative card p-5 rounded-lg transition-all duration-300 ${expandedRoomId === room.id ? 'transform scale-95' : ''}`}
                        >
                            <div className="absolute top-0 p-3 rounded-tr-md rounded-br-md right-0 h-full bg-primary flex items-center justify-center cursor-pointer" onClick={() => toggleExpand(room.id)}>
                                <ChevronRightIcon className={`size-6 text-base-100 transition-transform duration-300 ${expandedRoomId === room.id ? 'rotate-180' : ''}`} />
                            </div>
                            <div className='flex items-center gap-3 mb-3'>
                                <img
                                    src={room.photoUrl}
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
                                        <p>Seating capacity: {room.seatingCapacity}</p>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Link to="/admin/bookings" className="btn btn-primary text-base-100">
                                            <CalendarDaysIcon className='size-5' />
                                            View Bookings
                                        </Link>
                                        <button
                                            className='btn btn-outline btn-secondary text-white'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(room.id);
                                            }}
                                        >
                                            <PencilIcon className='size-5' />
                                            Edit
                                        </button>

                                        <button
                                            className='btn btn-outline btn-error text-white'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                document.getElementById('delete_room_modal').showModal();
                                                setCurrentRoomId(room.id);
                                            }}
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
            </div>
        </Sidebar>
    );
};

export default MeetingRooms;