import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { PlusCircleIcon, PencilIcon, ChevronRightIcon, MagnifyingGlassIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const MeetingRooms = () => {
    const [loading, setLoading] = useState(true);
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State for form fields
    const [newRoom, setNewRoom] = useState({
        name: '',
        type: 'Seminar Room',
    });

    // Function to handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
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
            type: 'Seminar Room',
        });
        setIsEditMode(false);
        setCurrentRoomId(null);
    };

    useEffect(() => {
        // Api call here to fetch data and populate the above states
        // Dummy data for meeting rooms
        setMeetingRooms([
            { id: "1", name: "Room A", type: "Seminar Room" },
            { id: "2", name: "Room B", type: "Conference Room" },
        ]);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    // Function to handle edit button click
    const handleEdit = (roomId) => {
        const roomToEdit = meetingRooms.find(room => room.id === roomId);
        setNewRoom({
            name: roomToEdit.name,
            type: roomToEdit.type,
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

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            {/* Add/Edit Room Modal */}
            <dialog id="add_room_form" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{isEditMode ? 'Edit Room' : 'Add New Room'}</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Room Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={newRoom.name}
                            onChange={handleInputChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Room Type</span>
                        </label>
                        <select
                            name="type"
                            value={newRoom.type}
                            onChange={handleInputChange}
                            className="select select-bordered"
                        >
                            <option value="Seminar Room">Seminar Room</option>
                            <option value="Conference Room">Conference Room</option>
                        </select>
                    </div>
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
                    <h3 className="font-bold text-lg">Delete Room</h3>
                    <p>Are you sure you want to delete this room?</p>
                    <div className="alert alert-warning">This action may result in unexpected consequences or behaviour.</div>
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
                                <h1 className='text-xl font-semibold'>{room.name}</h1>
                            </div>
                            <p className='text-gray-500'>{room.type}</p>
                            {expandedRoomId === room.id && (
                                <div className="flex gap-2 mt-3">
                                    <button className="btn btn-primary text-base-100">
                                        <CalendarDaysIcon className='size-5' />
                                        View Bookings
                                    </button>
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
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Sidebar>
    );
};

export default MeetingRooms;