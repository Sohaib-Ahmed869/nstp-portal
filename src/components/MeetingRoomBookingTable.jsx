import React, { useEffect, useState } from 'react'
import { InformationCircleIcon, XCircleIcon, CalendarDaysIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';


const MeetingRoomBookingTable = ({ meetingRoomSchedule, role, dashboardComponent = false }) => {
    const [meetingToCancel, setMeetingToCancel] = useState();
    const [meetingCancellationReason, setMeetingCancellationReason] = useState("The meeting was not approved because the room was already booked for the same time slot.");
    const [modalLoading, setModalLoading] = useState(false);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        setSortField('dateBooked');
    }, [meetingRoomSchedule]);

    const cancelMeeting = (meetingId) => {
        setModalLoading(true);
        // Simulate API call with timer
        setTimeout(() => {
            console.log(`Cancelling meeting with ID: ${meetingId}`);
            setModalLoading(false);
            document.getElementById('meeting_cancellation').close();
        }, 2000);
    };

    const fetchReasonForCancellation = (bookingId) => {
        setMeetingCancellationReason("Fetching reason for meeting cancellation...");
        document.getElementById('meeting_unapproved_reason').showModal();
        // Simulate API call with timer
        setTimeout(() => {
            document.getElementById('meeting_unapproved_reason').close();
            console.log("Fetching reason for meeting cancellation for booking ID: ", bookingId);
            setMeetingCancellationReason("The meeting was not approved because the room was already booked for the same time slot.");
            document.getElementById('meeting_unapproved_reason').showModal();
        }, 1000);
    };

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value === 'All' ? '' : e.target.value);
        setCurrentPage(1); // Reset to the first page when filter changes
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredData = dashboardComponent ? meetingRoomSchedule : meetingRoomSchedule.filter(row => {
        return (filterStatus === '' || row.status === filterStatus) &&
            (role !== 'receptionist' || row.company?.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    const sortedData = dashboardComponent ? filteredData : filteredData.sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        if (typeof a[sortField] === 'string') {
            return sortOrder === 'asc'
                ? a[sortField].localeCompare(b[sortField])
                : b[sortField].localeCompare(a[sortField]);
        } else {
            return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
        }
    });

    const paginatedData = dashboardComponent ? sortedData : sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);


    const approveMeeting = (meetingId) => {
        // Simulate API call with timer
        console.log(`Approving meeting with ID: ${meetingId}`);
        setTimeout(() => {
            console.log(`Meeting with ID: ${meetingId} has been approved.`);
        }, 2000);
    }

    const unapproveMeeting = (meetingId) => {
        // Simulate API call with timer
        console.log(`Unapproving meeting with ID: ${meetingId}`);
        setTimeout(() => {
            console.log(`Meeting with ID: ${meetingId} has been unapproved.`);
        }, 2000);
    }


    return (
        <>    {/* modal with confirmation for meeting room cancellation */}
            <dialog
                id="meeting_cancellation"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">
                        Are you sure you want to cancel this booking?
                    </h3>
                    <p className="py-4">Please click "Yes" if you wish to cancel it.</p>
                    <div className="modal-action">
                        <button
                            className={`btn mr-2 ${modalLoading && "btn-disabled"}`}
                            onClick={() => {
                                setMeetingToCancel(null);
                                document.getElementById("meeting_cancellation").close();
                            }}
                        >
                            Close
                        </button>
                        <button
                            className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
                            onClick={() => { cancelMeeting(meetingToCancel) }}
                        >
                            {modalLoading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            {modalLoading ? "Please wait..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* modal with reason for unapproved meeting */}
            <dialog
                id="meeting_unapproved_reason"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">This meeting was not approved.</h3>
                    <p className="py-4">{meetingCancellationReason}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn mr-2">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>

            {/** meeting room schedule table */}
            <div className="">
                <div className="flex justify-between mb-3 items-center">
                    <p className="mb-3 font-bold"> Meeting Room Schedule</p>
                    {dashboardComponent &&
                        <Link className="btn btn-primary text-white btn-md" to="bookings">
                            <CalendarDaysIcon className="size-7" /> View All
                        </Link>
                    }
                </div>

                {/* Sorting, Filtering, and Search Controls */}
                {!dashboardComponent && (
                    <div className="flex justify-between mb-3 items-center">

                        <div className="relative w-full md:max-w-xs">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="input input-bordered w-full pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>

                        <div className="w-full md:w-4/12 flex items-center justify-end">
                            <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                            <select value={filterStatus === '' ? 'All' : filterStatus} onChange={handleFilterChange} className="select select-bordered w-full md:max-w-xs max-sm:mt-2">
                                <option value="All">All</option>
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                                <option value="Unapproved">Unapproved</option>
                            </select>
                        </div>

                    </div>
                )}
                { }
                <div className="max-h-full overflow-y-auto bg-base-100">
                    {paginatedData.length === 0 ? (
                        <p className="text-gray-500">No data to show for now.</p>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr className="bg-base-200 cursor-pointer">
                                    <th onClick={() => handleSortChange('roomNo')}>Room {sortField === 'roomNo' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                                    <th onClick={() => handleSortChange('status')}>Status {sortField === 'status' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                                    {role === 'receptionist' && <th onClick={() => handleSortChange('company')}>Company {sortField === 'company' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>}
                                    <th onClick={() => handleSortChange('dateBooked')}>Booked on {sortField === 'dateBooked' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                                    <th onClick={() => handleSortChange('dateBooking')}>Booked for {sortField === 'dateBooking' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                                    <th onClick={() => handleSortChange('time')}>Time {sortField === 'time' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row, index) => (
                                    <tr key={row.bookingId} className="relative group">
                                        <th>{row.roomNo}</th>
                                        <td>
                                            <div className={`rounded-md text-center p-1 ${row.status === 'Approved'
                                                ? 'bg-lime-200 text-lime-900'
                                                : row.status === 'Unapproved'
                                                    ? 'bg-red-300 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {row.status}
                                            </div>
                                        </td>
                                        {role === 'receptionist' && <td>{row.company}</td>}
                                        <td>{row.dateBooked}</td>
                                        <td>{row.dateBooking}</td>
                                        <td>{row.time}</td>
                                        <td>
                                            {row.status === 'Pending' ? (
                                                role === 'receptionist' ? (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-outline btn-primary mr-2"
                                                            onClick={() => {
                                                                approveMeeting(row.bookingId);
                                                            }}>
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline btn-error"
                                                            onClick={() => {
                                                                unapproveMeeting(row.bookingId);
                                                            }}>
                                                            Unapprove
                                                        </button>
                                                    </>

                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-outline btn-error"
                                                        onClick={() => {
                                                            setMeetingToCancel(row.bookingId);
                                                            document.getElementById('meeting_cancellation').showModal();
                                                        }}>
                                                        <XCircleIcon className="h-5 w-5" />
                                                        Cancel
                                                    </button>
                                                )
                                            ) : row.status === 'Unapproved' && role !== 'receptionist' ? (
                                                <button
                                                    className="btn btn-sm btn-outline btn-neutral"
                                                    onClick={() => {
                                                        fetchReasonForCancellation(row.bookingId);
                                                    }}>
                                                    <InformationCircleIcon className="h-5 w-5" />
                                                    Reason
                                                </button>
                                            ) : (
                                                <></>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                {!dashboardComponent && meetingRoomSchedule.length > rowsPerPage && (
                    <div className="flex justify-between mt-4">
                        <button
                            className="btn btn-ghost"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}>
                            Previous
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default MeetingRoomBookingTable
