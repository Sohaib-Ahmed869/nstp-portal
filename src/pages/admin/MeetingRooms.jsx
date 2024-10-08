import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { PlusCircleIcon, MagnifyingGlassIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import RoomList from '../../components/RoomList';
import RoomTypeList from '../../components/RoomTypeList';
import AddEditRoomModal from '../../components/AddEditRoomModal.jsx';
import AddEditRoomTypeModal from '../../components/AddEditRoomTypeModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { AdminService } from '../../services';
import { TowerContext } from '../../context/TowerContext.jsx';
import showToast from '../../util/toast.jsx';

const DUMMY_PHOTO_URLS = [
    "https://media.istockphoto.com/id/1363105039/photo/businesspeople-do-video-conference-call-with-big-wall-tv-in-office-meeting-room-diverse-team.jpg?s=612x612&w=0&k=20&c=o7UjhyG3YmLj7jTtSdMkN-K_tE4HSfAq9wWdhiRDFAA=",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-8D4isLqFIao-pvIKzhUSgfZi3VPePVk07A&s",
    "https://t4.ftcdn.net/jpg/00/80/91/11/360_F_80911186_RoBCsyLrNTrG7Y1EOyCsaCJO5DyHgTox.jpg",
]

const getRandomPhotoUrl = () => {
    return DUMMY_PHOTO_URLS[Math.floor(Math.random() * DUMMY_PHOTO_URLS.length)];
};

const MeetingRooms = () => {
    const [loading, setLoading] = useState(true);
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [currentRoomTypeId, setCurrentRoomTypeId] = useState(null);
    const [roomSearchQuery, setRoomSearchQuery] = useState('');
    const [roomTypeSearchQuery, setRoomTypeSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [newRoom, setNewRoom] = useState({
        name: '',
        floor: '',
        startTime: '',
        endTime: '',
        seatingCapacity: '',
        roomType: '',
    });
    const [newRoomType, setNewRoomType] = useState({
        name: '',
        capacity: '',
        rate_list: [
            {
                category: 'company',
                rates: [
                    { rate_type: 'per_hour', rate: '' },
                    { rate_type: 'per_day', rate: '' },
                    { rate_type: 'under_4_hours', rate: '' },
                ],
            },
            {
                category: 'startup',
                rates: [
                    { rate_type: 'per_hour', rate: '' },
                    { rate_type: 'per_day', rate: '' },
                    { rate_type: 'under_4_hours', rate: '' },
                ],
            },
        ],
    });

    const { tower } = useContext(TowerContext);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const roomsResponse = await AdminService.getRooms(tower.id);
            if (roomsResponse.error) {
                showToast(false, roomsResponse.message);
                return;
            }

            const mappedData = roomsResponse.data.rooms.map(room => ({
                id: room._id,
                name: room.name,
                floor: room.floor,
                startTime: room.time_start,
                endTime: room.time_end,
                photoUrl: getRandomPhotoUrl(),
                type: room.type, //this is currently the ID , it should be the Name
            }));

            setMeetingRooms(mappedData);

            const roomTypesResponse = await AdminService.getRoomTypes(tower.id);
            if (roomTypesResponse.error) {
                showToast(false, roomTypesResponse.message);
                return;
            }
            console.log("Room types response:", roomTypesResponse);
            const mappedData2 = roomTypesResponse.data.roomTypes.map(type => ({
                id: type._id,
                name: type.name,
                capacity: type.capacity,
                rate_list: type.rate_list,
            }));
            setRoomTypes(mappedData2);
            console.log("Room types response:", roomTypesResponse.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        console.log("Submitting room data:", newRoom);

        try {
            // Simulate API call
            // await new Promise(resolve => setTimeout(resolve, 2000));

            if (isEditMode) {
                setMeetingRooms(prevRooms =>
                    prevRooms.map(room =>
                        room.id === currentRoomId ? { ...room, ...newRoom } : room
                    )
                );
            } else {

                // const newRoomWithId = { ...newRoom, id: Date.now().toString() };
                // setMeetingRooms(prevRooms => [...prevRooms, newRoomWithId]);
            }

            resetRoomForm();
            document.getElementById('add_room_form').close();
        } catch (error) {
            console.error("Error submitting room data:", error);
            setErrors({ submit: "Failed to submit room data. Please try again." });
        } finally {
            setModalLoading(false);
        }
    };

    const handleRoomTypeSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        console.log("Submitting room type data:", newRoomType);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (isEditMode) {
                setRoomTypes(prevTypes =>
                    prevTypes.map(type =>
                        type.id === currentRoomTypeId ? { ...type, ...newRoomType } : type
                    )
                );
            } else {
                const response = await AdminService.addRoomType(tower.id, newRoomType);
                console.log("Add room response:", response);
                if (response.error) {
                    showToast(false, response.message);
                    return;
                }

                console.log("Add room response:", response.data);

                // add new room type to the list

                showToast(true, response.message);

                const newRoomTypeReturned = {
                    id: response.data.roomType._id,
                    name: response.data.roomType.name,
                    capacity: response.data.roomType.capacity,
                    rate_list: response.data.roomType.rate_list,
                }
                //add to list
                setRoomTypes(prevTypes => [...prevTypes, newRoomTypeReturned]);
                


            }

            resetRoomTypeForm();
            document.getElementById('add_room_type_form').close();
        } catch (error) {
            console.error("Error submitting room type data:", error);
            setErrors({ submit: "Failed to submit room type data. Please try again." });
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        setModalLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setMeetingRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
            document.getElementById('delete_room_modal').close();
        } catch (error) {
            console.error("Error deleting room:", error);
            setErrors({ delete: "Failed to delete room. Please try again." });
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteRoomType = async (roomTypeId) => {
        setModalLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setRoomTypes(prevTypes => prevTypes.filter(type => type.id !== roomTypeId));
            document.getElementById('delete_room_type_modal').close();
        } catch (error) {
            console.error("Error deleting room type:", error);
            setErrors({ delete: "Failed to delete room type. Please try again." });
        } finally {
            setModalLoading(false);
        }
    };

    const resetRoomForm = () => {
        setNewRoom({
            name: '',
            floor: '',
            startTime: '',
            endTime: '',
            seatingCapacity: '',
            roomType: '',
        });
        setIsEditMode(false);
        setCurrentRoomId(null);
        setErrors({});
    };

    const resetRoomTypeForm = () => {
        setNewRoomType({
            name: '',
            capacity: '',
            rate_list: [
                {
                    category: 'company',
                    rates: [
                        { rate_type: 'per_hour', rate: '' },
                        { rate_type: 'per_day', rate: '' },
                        { rate_type: 'under_4_hours', rate: '' },
                    ],
                },
                {
                    category: 'startup',
                    rates: [
                        { rate_type: 'per_hour', rate: '' },
                        { rate_type: 'per_day', rate: '' },
                        { rate_type: 'under_4_hours', rate: '' },
                    ],
                },
            ],
        });
        setIsEditMode(false);
        setCurrentRoomTypeId(null);
        setErrors({});
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            <AddEditRoomModal
                isEditMode={isEditMode}
                newRoom={newRoom}
                setNewRoom={setNewRoom}
                roomTypes={roomTypes}
                errors={errors}
                setErrors={setErrors}
                modalLoading={modalLoading}
                handleSubmit={handleRoomSubmit}
                resetForm={resetRoomForm}
            />

            <AddEditRoomTypeModal
                isEditMode={isEditMode}
                newRoomType={newRoomType}
                setNewRoomType={setNewRoomType}
                errors={errors}
                setErrors={setErrors}
                modalLoading={modalLoading}
                handleSubmit={handleRoomTypeSubmit}
                resetForm={resetRoomTypeForm}
            />

            <DeleteConfirmationModal
                id="delete_room_modal"
                title="Delete Room"
                message="Are you sure you want to delete this room?"
                onConfirm={() => handleDeleteRoom(currentRoomId)}
                modalLoading={modalLoading}
            />

            <DeleteConfirmationModal
                id="delete_room_type_modal"
                title="Delete Room Type"
                message="Are you sure you want to delete this room type?"
                onConfirm={() => handleDeleteRoomType(currentRoomTypeId)}
                modalLoading={modalLoading}
            />

            <div className={`flex gap-5 max-md:flex-col max-[1105px]:flex-col  ${loading && "hidden"} w-full`}>
                <div className={`w-full  md:w-3/5 bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg `}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                        <div className="flex gap-3 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 32 32">
                                <path fill="#87b37a" d="M10 30H8v-3H4v3H2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm20 0h-2v-3h-4v3h-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm-10 0h-2v-3h-4v3h-2v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z"></path>
                                <circle cx={16} cy={22} r={2} fill="#87b37a"></circle>
                                <circle cx={6} cy={22} r={2} fill="#87b37a"></circle>
                                <circle cx={26} cy={22} r={2} fill="#87b37a"></circle>
                                <circle cx={21} cy={18} r={2} fill="#87b37a"></circle>
                                <circle cx={11} cy={18} r={2} fill="#87b37a"></circle>
                                <path fill="#87b37a" d="M26 14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2M6 4v8h20V4Z"></path>
                            </svg>

                            <h1 className="text-2xl font-bold  md:mb-0">Meeting Rooms</h1>
                        </div>

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
                    <div className="">
                        <div className="relative w-full mb-5">
                            <input
                                type="text"
                                placeholder="Search rooms..."
                                value={roomSearchQuery}
                                onChange={(e) => setRoomSearchQuery(e.target.value)}
                                className="input input-bordered w-full pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                        <RoomList
                            rooms={meetingRooms.filter(room =>
                                room.name.toLowerCase().includes(roomSearchQuery.toLowerCase()) ||
                                room.type?.toLowerCase().includes(roomSearchQuery.toLowerCase())
                            )}
                            onEdit={(room) => {
                                setNewRoom(room);
                                setIsEditMode(true);
                                setCurrentRoomId(room.id);
                                document.getElementById("add_room_form").showModal();
                            }}
                            onDelete={(roomId) => {
                                setCurrentRoomId(roomId);
                                document.getElementById('delete_room_modal').showModal();
                            }}
                        />
                    </div>

                </div>

                <div className=" flex-grow bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ">
                    <div className="w-full flex flex-col">
                        <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-5">
                            <div className="flex flex-row gap-3 items-center  mb-3">
                                <RectangleGroupIcon className="size-8 text-primary" />
                                <h1 className="text-2xl font-bold md:mb-0">Meeting Room Types</h1>
                            </div>
                            <button
                                className="btn btn-secondary text-white"
                                onClick={() => {
                                    setIsEditMode(false);
                                    document.getElementById("add_room_type_form").showModal();
                                }}
                            >
                                <PlusCircleIcon className="size-6" />
                                Add New Room Type
                            </button>
                        </div>
                        <div className="relative w-full mb-5">
                            <input
                                type="text"
                                placeholder="Search room types..."
                                value={roomTypeSearchQuery}
                                onChange={(e) => setRoomTypeSearchQuery(e.target.value)}
                                className="input input-bordered w-full pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                        <RoomTypeList
                            roomTypes={roomTypes.filter(type =>
                                type.name.toLowerCase().includes(roomTypeSearchQuery.toLowerCase())
                            )}
                            onEdit={(roomType) => {
                                setNewRoomType(roomType);
                                setIsEditMode(true);
                                setCurrentRoomTypeId(roomType.id);
                                document.getElementById("add_room_type_form").showModal();
                            }}
                            onDelete={(roomTypeId) => {
                                setCurrentRoomTypeId(roomTypeId);
                                document.getElementById('delete_room_type_modal').showModal();
                            }}
                        />

                    </div>
                </div>
            </div>

        </Sidebar>
    );
};

export default MeetingRooms;