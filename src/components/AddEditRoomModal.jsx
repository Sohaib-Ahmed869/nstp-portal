import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';

const AddEditRoomModal = ({ isEditMode, newRoom, setNewRoom, roomTypes, errors, modalLoading, handleSubmit, resetForm }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prevRoom => ({ ...prevRoom, [name]: value }));
    };

    return (
        <dialog id="add_room_form" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">{isEditMode ? 'Edit Room' : 'Add New Room'}</h3>
                <form onSubmit={handleSubmit}>
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
                        type="time"
                        id="start_time"
                        label="Opening Time"
                        value={newRoom.startTime}
                        onChange={handleInputChange}
                        error={errors.startTime}
                    />
                    <FloatingLabelInput
                        name="endTime"
                        type="time"
                        id="end_time"
                        label="Closing Time"
                        value={newRoom.endTime}
                        onChange={handleInputChange}
                        error={errors.endTime}
                    />
                    <select
                        name="roomType"
                        value={newRoom.roomType}
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