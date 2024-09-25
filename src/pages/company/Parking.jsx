import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { PlusCircleIcon, ChevronRightIcon, MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const Parking = () => {
    const [loading, setLoading] = useState(true);
    const [parkingData, setParkingData] = useState([]);
    const [expandedParkingId, setExpandedParkingId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [errors, setErrors] = useState({});
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const parkingPerPage = 10;

    const [newParking, setNewParking] = useState({
        name: '',
        cnic: '',
        parkingNumber: '',
        comments: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewParking((prevParking) => ({
            ...prevParking,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleSubmit = () => {
        const newErrors = {};

        if (!newParking.name) newErrors.name = 'Name is required';
        if (!newParking.cnic) newErrors.cnic = 'CNIC is required';
        if (!newParking.parkingNumber) newErrors.parkingNumber = 'Parking Number is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setModalLoading(true);
        setTimeout(() => {
            console.log(newParking);
            setPendingRequests((prevRequests) => [
                ...prevRequests,
                {
                    id: (prevRequests.length + 1).toString(),
                    name: newParking.name,
                    cnic: newParking.cnic,
                    comments: newParking.comments,
                    date: new Date().toLocaleString(),
                },
            ]);

            setModalLoading(false);
            document.getElementById('add_parking_form').close();
            resetForm();
        }, 2000);
    };

    const handleCancel = () => {
        resetForm();
        document.getElementById('add_parking_form').close();
    };

    const resetForm = () => {
        setNewParking({
            name: '',
            cnic: '',
            parkingNumber: '',
            comments: '',
        });
    };

    const toggleExpand = (parkingId) => {
        setExpandedParkingId(expandedParkingId === parkingId ? null : parkingId);
    };

    const filteredParkingData = parkingData.filter(parking =>
        parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parking.parkingNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastParking = currentPage * parkingPerPage;
    const indexOfFirstParking = indexOfLastParking - parkingPerPage;
    const currentParkingData = filteredParkingData.slice(indexOfFirstParking, indexOfLastParking);

    const totalPages = Math.ceil(filteredParkingData.length / parkingPerPage);

    useEffect(() => {
        // Simulate API call to fetch parking data
        setTimeout(() => {
            setParkingData([
                { id: '1', name: 'John Doe', cnic: '12345-6789012-3', parkingNumber: 'P-101', comments: 'Reserved spot' },
                { id: '2', name: 'Jane Smith', cnic: '23456-7890123-4', parkingNumber: 'P-102', comments: 'Near entrance' },
                { id: '3', name: 'Alice Johnson', cnic: '34567-8901234-5', parkingNumber: 'P-103', comments: 'None' },
                { id: '4', name: 'Bob Brown', cnic: '45678-9012345-6', parkingNumber: 'P-104', comments: 'Covered parking' },
                { id: '5', name: 'Charlie Davis', cnic: '56789-0123456-7', parkingNumber: 'P-105', comments: 'None' },
                // Add more dummy data as needed
            ]);

            setPendingRequests([
                { id: '1', name: 'Emily Clark', cnic: '67890-1234567-8', comments: 'Urgent', date: '2024-12-20 10:00 AM' },
                { id: '2', name: 'Michael Scott', cnic: '78901-2345678-9', comments: 'None', date: '2024-12-21 11:00 AM' },
                // Add more dummy data as needed
            ]);

            setLoading(false);
        }, 2000);
    }, []);

    const handleCancelRequest = () => {
        setPendingRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== selectedRequestId)
        );
        setSelectedRequestId(null);
        document.getElementById('cancel_request_modal').close();
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            {/* Cancel Request Modal */}
            <dialog id="cancel_request_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Cancel Request</h3>
                    <p>Are you sure you want to cancel this request?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('cancel_request_modal').close()}>No</button>
                        <button className="btn btn-error" onClick={handleCancelRequest}>Yes, Cancel</button>
                    </div>
                </div>
            </dialog>

            {/* Add Parking Modal */}
            <dialog id="add_parking_form" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Request New Parking Spot</h3>
                    <FloatingLabelInput
                        name="name"
                        type="text"
                        id="parking_name"
                        label="Name"
                        value={newParking.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    <FloatingLabelInput
                        name="cnic"
                        type="text"
                        id="parking_cnic"
                        label="CNIC"
                        value={newParking.cnic}
                        onChange={handleInputChange}
                    />
                    {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}
                    <FloatingLabelInput
                        name="parkingNumber"
                        type="text"
                        id="parking_number"
                        label="Parking Number"
                        value={newParking.parkingNumber}
                        onChange={handleInputChange}
                    />
                    {errors.parkingNumber && <p className="text-red-500 text-sm">{errors.parkingNumber}</p>}
                    <FloatingLabelInput
                        name="comments"
                        type="text"
                        id="parking_comments"
                        label="Comments"
                        value={newParking.comments}
                        onChange={handleInputChange}
                    />
                    <div className="modal-action">
                        <button className="btn" onClick={handleCancel}>Cancel</button>
                        <button
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={handleSubmit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Main Page Content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}>
                {/* Header + request new parking btn */}
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Parking</h1>
                    <button
                        className="btn btn-primary text-white"
                        onClick={() => {
                            document.getElementById("add_parking_form").showModal();
                        }}
                    >
                        <PlusCircleIcon className="size-6" />
                        Request New Parking Spot
                    </button>
                </div>
                <hr className="my-5 text-gray-200" />

                {/* Search Bar */}
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

                {/* Parking Spots */}
                <div className="flex flex-col gap-5">
                    {currentParkingData.map((parking) => (
                        <div
                            key={parking.id}
                            className={`relative card p-5 rounded-lg transition-all duration-300 ${expandedParkingId === parking.id ? 'transform scale-95' : ''}`}
                        >
                            <div className="absolute top-0 p-3 rounded-tr-md rounded-br-md right-0 h-full bg-primary flex items-center justify-center cursor-pointer" onClick={() => toggleExpand(parking.id)}>
                                <ChevronRightIcon className={`size-6 text-base-100 transition-transform duration-300 ${expandedParkingId === parking.id ? 'rotate-180' : ''}`} />
                            </div>
                            <div className='flex items-center gap-3 mb-3'>
                                <h1 className='text-xl font-semibold border-r border-r-gray-200 pr-4 ml-3'>{parking.name}</h1>
                                <p className='text-gray-500'>{"Parking No. " + parking.parkingNumber}</p>
                            </div>
                            {expandedParkingId === parking.id && (
                                <div className="flex flex-col">
                                    <div>
                                        <p>CNIC: {parking.cnic}</p>
                                        <p>Comments: {parking.comments !== 'None' ? parking.comments : 'None'}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/** pagination of parking spots */}
                <div className="flex justify-between items-center p-2 mt-4">
                    <button
                        className="btn btn-outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2">Showing page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>

                {/** table of pending req */}
                <div className="mt-10">
                    <div className="w-full rounded-md bg-primary bg-opacity-20 p-5 mb-4 flex items-center gap-3">
                        <ClockIcon className="size-8" />
                        <h2 className="text-xl font-bold">Pending Parking Requests</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>Date/Time</th>
                                    <th>Name</th>
                                    <th>CNIC</th>
                                    <th>Comments</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.date}</td>
                                        <td>{request.name}</td>
                                        <td>{request.cnic}</td>
                                        <td>{request.comments !== 'None' ? request.comments : 'None'}</td>
                                        <td>
                                            <button
                                                className="btn btn-error btn-outline btn-sm"
                                                onClick={() => {
                                                    setSelectedRequestId(request.id);
                                                    document.getElementById('cancel_request_modal').showModal();
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default Parking;