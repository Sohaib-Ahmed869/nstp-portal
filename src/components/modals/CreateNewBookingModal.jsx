import React, { useEffect, useState } from 'react'
import showToast from '../../util/toast';

import { TenantService } from '../../services';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
const CreateNewBookingModal = ({ roomOptions: initialRoomOptions }) => {
    const [modalLoading, setModalLoading] = useState(false);
    const [roomOptions, setRoomOptions] = useState(initialRoomOptions || []);
    const [errorMessage, setErrorMessage] = useState('');
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    const minTime = today.toTimeString().split(' ')[0].slice(0, 5); // Format as HH:MM

    useEffect(() => {
        if (initialRoomOptions !== undefined) {
            setRoomOptions(initialRoomOptions);
        }
    }, [initialRoomOptions]);

    const [newBooking, setNewBooking] = useState({
        date: "",
        startTime: "",
        endTime: "",
        roomId: "",
    });

    const validateDateTime = (date, time) => {
        if (!date || !time) return true; // Skip validation if either is empty
        const selectedDateTime = new Date(`${date}T${time}`);
        return selectedDateTime > new Date();
    };

    const validateEndTime = (startTime, endTime) => {
        if (!startTime || !endTime) return true; // Skip validation if either is empty
        return endTime > startTime;
    };

    const handleNewBookingChange = (e) => {
        const { name, value } = e.target;
        let updatedBooking = { ...newBooking };
        let error = '';

        switch (name) {
            case 'date':
                const selectedDate = new Date(value);
                if (selectedDate < today && selectedDate.toDateString() !== today.toDateString()) {
                    error = 'The booking date must not be in the past.';
                } else {
                    updatedBooking.date = value;
                    // Validate times if they exist
                    if (updatedBooking.startTime && !validateDateTime(value, updatedBooking.startTime)) {
                        error = 'The start time must be after the current time.';
                        updatedBooking.startTime = '';
                        updatedBooking.endTime = '';
                    }
                }
                break;

            case 'startTime':
                if (!validateDateTime(updatedBooking.date, value)) {
                    error = 'The start time must be after the current time.';
                } else {
                    updatedBooking.startTime = value;
                    // Clear end time if it's before start time
                    if (updatedBooking.endTime && !validateEndTime(value, updatedBooking.endTime)) {
                        error = 'The end time must be after the start time.';
                        updatedBooking.endTime = '';
                    }
                }
                break;

            case 'endTime':
                if (!validateEndTime(updatedBooking.startTime, value)) {
                    error = 'The end time must be after the start time.';
                } else {
                    updatedBooking.endTime = value;
                }
                break;

            default:
                updatedBooking[name] = value;
        }

        setErrorMessage(error);
        setNewBooking(updatedBooking);
    };

    const submitNewBooking = async () => {
        setModalLoading(true);

        try {
            const response = await TenantService.requestRoomBooking(newBooking);
            console.log(response);
            if (response.error) {
                console.log(response.message);
                showToast(false, response.error);
            }

            console.log("New booking submitted: ", response.data.booking);
            showToast(true, response.message);

            //clear the fields
            setNewBooking({ date: '', startTime: '', endTime: '', roomId: '' });
            document.getElementById('new_booking_modal').close();

        } catch (error) {
            console.log("Error submitting new booking: ", error);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        async function fetchData() {
            if (!initialRoomOptions) {
                try {
                    const roomsResponse = await TenantService.getRooms();
                    if (roomsResponse.error) {
                        console.log(roomsResponse.message);
                        return;
                    }
                    console.log("Rooms: ", roomsResponse.data.rooms);

                    const mappedRooms = roomsResponse.data.rooms.map(room => ({
                        value: room._id,
                        label: room.name,
                    }));

                    setRoomOptions(mappedRooms);
                } catch (error) {
                    console.error("Error fetching rooms: ", error);
                }
            }
        }
        fetchData();
    }, []);

    return (
        <dialog
            id="new_booking_modal"
            className="modal modal-bottom sm:modal-middle"
        >
            <div className="modal-box">
                <h3 className="font-bold text-lg">New Booking Request</h3>
                <div className="py-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Date</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={newBooking.date}
                            onChange={handleNewBookingChange}
                            className="input input-bordered w-full"
                            min={minDate}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Start Time</span>
                        </label>
                        <input
                            type="time"
                            name="startTime"
                            value={newBooking.startTime}
                            onChange={handleNewBookingChange}
                            className="input input-bordered w-full"
                            min={newBooking.date === minDate ? minTime : undefined}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">End Time</span>
                        </label>
                        <input
                            type="time"
                            name="endTime"
                            value={newBooking.endTime}
                            onChange={handleNewBookingChange}
                            className="input input-bordered w-full"
                            min={newBooking.startTime || undefined}
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Room</span>
                        </label>
                        <select
                            name="roomId"
                            value={newBooking.roomId}
                            onChange={handleNewBookingChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select a room</option>
                            {roomOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errorMessage && <p className="text-red-700 rounded-lg p-3 mt-3 flex gap-2 items-center bg-red-100"> <ExclamationTriangleIcon className="size-5" /> {errorMessage}</p>}
                </div>
                <div className="modal-action">
                    <button
                        className="btn"
                        onClick={() => {
                            //clear fields
                            setNewBooking({ date: '', startTime: '', endTime: '', roomId: '' });
                            setErrorMessage('');
                            document.getElementById("new_booking_modal").close()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className={`btn btn-primary ${(errorMessage || modalLoading) && "btn-disabled"}`}
                        onClick={submitNewBooking}
                    >
                        {modalLoading && (
                            <span className="loading loading-spinner"></span>
                        )}
                        {modalLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default CreateNewBookingModal