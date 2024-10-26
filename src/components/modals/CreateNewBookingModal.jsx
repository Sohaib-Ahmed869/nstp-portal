import React, { useEffect, useState } from 'react'
import showToast from '../../util/toast';

import { TenantService } from '../../services';
const CreateNewBookingModal = ({ roomOptions: initialRoomOptions }) => {
    const [modalLoading, setModalLoading] = useState(false);
    const [roomOptions, setRoomOptions] = useState(initialRoomOptions || []);


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


    const handleNewBookingChange = (e) => {
        setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
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
                </div>
                <div className="modal-action">
                    <button
                        className="btn"
                        onClick={() =>
                            document.getElementById("new_booking_modal").close()
                        }
                    >
                        Close
                    </button>
                    <button
                        className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
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
