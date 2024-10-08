import React from 'react';
import { PencilIcon, TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const RoomTypeList = ({ roomTypes, onEdit, onDelete }) => {
    const [expandedTypeId, setExpandedTypeId] = React.useState(null);

    const toggleExpand = (typeId) => {
        setExpandedTypeId(expandedTypeId === typeId ? null : typeId);
    };

    const formatRateType = (rateType) => {
        // Replace underscores with spaces and split the string into words
        const words = rateType.replace(/_/g, ' ').split(' ');

        // Capitalize the first letter of each word
        const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

        // Join the words back into a single string
        return formattedWords.join(' ') + ':';
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="flex flex-col gap-5">
            {roomTypes.map((type) => (
                <div
                    key={type.id}
                    className={`relative card p-5 rounded-lg transition-all duration-300 ${expandedTypeId === type.id ? 'transform scale-95' : ''}`}
                >
                    <div className="absolute top-0 p-3 rounded-tr-md rounded-br-md right-0 h-full bg-secondary flex items-center justify-center cursor-pointer" onClick={() => toggleExpand(type.id)}>
                        <ChevronRightIcon className={`size-6 text-base-100 transition-transform duration-300 ${expandedTypeId === type.id ? 'rotate-180' : ''}`} />
                    </div>
                    <div className='flex items-center gap-3 mb-3'>
                        <h1 className='text-xl font-semibold'>{type.name}</h1>
                        <p className='text-gray-500'>Capacity: {type.capacity}</p>
                    </div>
                    {expandedTypeId === type.id && (
                        <div className="flex flex-col">
                            <div className="mt-3">
                                <h2 className="font-semibold">Rates:</h2>
                                <div className="overflow-x-auto">
                                    <table className="table w-4/5">
                                        <thead>
                                            <tr>
                                                <th>Rate Type</th>
                                                {type.rate_list.map((rateCategory, index) => (
                                                    <th key={index}>{capitalize(rateCategory.category)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {['per_day', 'per_hour', 'under_4_hours'].map((rateType, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td>{formatRateType(rateType)}</td>
                                                    {type.rate_list.map((rateCategory, colIndex) => {
                                                        const rate = rateCategory.rates.find(r => r.rate_type === rateType);
                                                        return (
                                                            <td key={colIndex}>
                                                                {rate ? `Rs. ${rate.rate}` : ' - '}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    className='btn btn-outline btn-secondary text-white'
                                    onClick={() => onEdit(type)}
                                >
                                    <PencilIcon className='size-5' />
                                    Edit
                                </button>
                                <button
                                    className='btn btn-outline btn-error text-white'
                                    onClick={() => onDelete(type.id)}
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

export default RoomTypeList;