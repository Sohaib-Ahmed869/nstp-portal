import React, { useState } from 'react';
import FloatingLabelInput from '../FloatingLabelInput';

const AddEditRoomModal = ({ isEditMode, newRoom, setNewRoom, roomTypes, errors, setErrors, modalLoading, handleSubmit, resetForm }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prevRoom => ({ ...prevRoom, [name]: value }));
        console.log("newroom", newRoom);
    };

    const validateTimeFormat = (time) => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex for 24-hour format HH:MM
        return timeRegex.test(time);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let valid = true;
        let newErrors = {};

        if (!validateTimeFormat(newRoom.startTime)) {
            newErrors.startTime = 'Please enter a valid time in 24-hour format (HH:MM)';
            valid = false;
        }

        if (!validateTimeFormat(newRoom.endTime)) {
            newErrors.endTime = 'Please enter a valid time in 24-hour format (HH:MM)';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            handleSubmit(e);
        }
    };

    return (
        <dialog id="add_room_form" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{isEditMode ? 'Edit Room' : 'Add New Room'}</h3>
                <form onSubmit={handleFormSubmit}>
                    <FloatingLabelInput
                        name="name"
                        type="text"
                        id="room_name"
                        label="Room Name"
                        value={newRoom.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                    <FloatingLabelInput
                        name="floor"
                        type="number"
                        id="room_floor"
                        label="Floor"
                        value={newRoom.floor}
                        onChange={handleInputChange}
                        error={errors.floor}
                    />
                    <FloatingLabelInput
                        name="startTime"
                        type="text"
                        id="start_time"
                        label="Opening Time"
                        value={newRoom.startTime}
                        onChange={handleInputChange}
                    />
                    {errors.startTime && <p className="text-error text-sm mt-1">{errors.startTime}</p>}
                    <FloatingLabelInput
                        name="endTime"
                        type="text"
                        id="end_time"
                        label="Closing Time"
                        value={newRoom.endTime}
                        onChange={handleInputChange}
                    />
                    {errors.endTime && <p className="text-error text-sm mt-1">{errors.endTime}</p>}
                    <select
                        name="roomType"
                        value={newRoom.type}
                        onChange={handleInputChange}
                        className="select select-bordered w-full mb-4"
                    >
                        <option value="">Select Room Type</option>
                        {roomTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                    {errors.roomType && <p className="text-error text-sm mt-1">{errors.roomType}</p>}
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={() => { resetForm(); document.getElementById('add_room_form').close(); }}>Cancel</button>
                        <button
                            type="submit"
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default AddEditRoomModal;