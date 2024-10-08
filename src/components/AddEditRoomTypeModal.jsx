import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { BuildingOfficeIcon, ClipboardDocumentListIcon, ListBulletIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';

const AddEditRoomTypeModal = ({
    isEditMode,
    newRoomType,
    setNewRoomType,
    errors,
    modalLoading,
    handleSubmit,
    resetForm
}) => {
    const formatRateType = (rateType) => {
        if (rateType === 'under_4_hours') {
            return 'Under 4 Hours (hourly rate):';
        }
        // Replace underscores with spaces and split the string into words
        const words = rateType.replace(/_/g, ' ').split(' ');

        // Capitalize the first letter of each word
        const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

        // Join the words back into a single string
        return formattedWords.join(' ') + ':';
    };

    const handleInputChange = (e, category, rateType) => {
        const { name, value } = e.target;
        if (category && rateType) {
            setNewRoomType(prev => ({
                ...prev,
                rate_list: prev.rate_list.map(item =>
                    item.category === category
                        ? {
                            ...item,
                            rates: item.rates.map(rate =>
                                rate.rate_type === rateType ? { ...rate, rate: value } : rate
                            )
                        }
                        : item
                )
            }));
        } else {
            setNewRoomType(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <dialog id="add_room_type_form" className="modal">
            <div className="modal-box md:w-11/12 md:max-w-5xl">
                <form method="dialog">

                </form>
                <div className="flex  mb-6 gap-3">
                    <PresentationChartBarIcon className="size-8 text-primary" />
                    <h1 className="font-bold text-xl">{isEditMode ? 'Edit Room Type' : 'Add New Room Type'}</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <FloatingLabelInput
                            label="Room Type Name"
                            name="name"
                            value={newRoomType.name}
                            onChange={handleInputChange}
                            error={errors.name}
                        />
                        <FloatingLabelInput
                            label="Capacity"
                            name="capacity"
                            type="number"
                            value={newRoomType.capacity}
                            onChange={handleInputChange}
                            error={errors.capacity}
                        /></div>

                    <div className="flex mb-2 gap-3">
                        <ClipboardDocumentListIcon className="size-8 text-primary" />
                        <h1 className='text-xl font-semibold'>Rates List</h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Rate Type</th>
                                    {newRoomType.rate_list.map((category, index) => (
                                        <th key={index} className="capitalize">{category.category}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {['per_hour', 'per_day', 'under_4_hours'].map((rateType, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{formatRateType(rateType)}</td>
                                        {newRoomType.rate_list.map((category, colIndex) => {
                                            const rate = category.rates.find(r => r.rate_type === rateType);
                                            return (
                                                <td key={colIndex}>
                                                    <label className="input input-bordered flex items-center gap-2">
                                                        Rs.
                                                        <input
                                                            type="number"
                                                            className="grow border-none focus:outline-none focus:ring-0"
                                                            placeholder="Rate"
                                                            name={`${category.category}_${rate.rate_type}`}
                                                            value={rate.rate}
                                                            onChange={(e) => handleInputChange(e, category.category, rate.rate_type)}
                                                        />
                                                    </label>                            </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={() => { resetForm(); document.getElementById('add_room_type_form').close() }}>
                            Cancel
                        </button>
                        <button type="submit" className={`btn btn-primary ${modalLoading  && "btn-disabled"}`} >
                            { modalLoading && <span className="loading loading-spinner"></span>}
                            { modalLoading ? "Please wait..." : isEditMode ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default AddEditRoomTypeModal;