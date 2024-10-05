import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CheckIcon, ClockIcon, ArchiveBoxIcon, PrinterIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import NSTPLoader from '../../components/NSTPLoader';
import { TowerContext } from '../../context/TowerContext';
import AdminService from '../../services/AdminService';
import showToast from '../../util/toast';

const Etags = () => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [loadingOldRequests, setLoadingOldRequests] = useState(false);
    const { tower } = useContext(TowerContext);
    const itemsPerPage = 10;
    const [etagRequests, setEtagRequests] = useState([]);
    const [fetchedOldRequests, setFetchedOldRequests] = useState(false);
    const [reasonForRejection, setReasonForRejection] = useState(null);

    useEffect(() => {
        // API call to fetch E-tag requests
        async function fetchEtagRequests() {
            try {
                const response = await AdminService.getPendingEtagAllocations(tower.id);
                console.log("🚀 ~ fetchEtagRequests ~ response", response);
                if (response.error) {
                    console.error("Error fetching E-tag requests", response.error);
                    return;
                }
                console.log("🚀 ~ fetchEtagRequests ~ response.data.etagAllocations", response.data.etagAllocations);
                
                // Transform the data to match the expected structure
                const transformedData = response.data.etagAllocations.map(item => {
                    let expiresOn = " - ";
                    if (item.is_issued) {
                        const dateIssued = new Date(item.date_issued);
                        const expiresDate = new Date(dateIssued.setMonth(dateIssued.getMonth() + 6));
                        expiresOn = expiresDate.toLocaleString();
                    }
    
                    return {
                        id: item._id,
                        employeeId: item.employee_id._id,
                        requestedOn: new Date(item.date_requested).toLocaleString(),
                        expiresOn: expiresOn,
                        companyName: item.employee_id.tenant_name,
                        employeeName: item.employee_id.name,
                        employeeCnic: item.employee_id.cnic,
                        issued: item.is_issued,
                        active: item.is_requested && !item.is_returned,
                        carRegistrationNumber: item.vehicle_number
                    };
                });
    
                setEtagRequests(transformedData);
    
            } catch (error) {
                console.error("Error fetching E-tag requests", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchEtagRequests();
    }, [tower.id]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (field) => {
        const order = sortField === (field === 'status' ? 'issued' : field) && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field === 'status' ? 'issued' : field);
        setSortOrder(order);
    };

    const handleApproveReject = async (request, action) => {
        setModalLoading(true);
        console.log(`${action} request for`, request);
        console.log("reason for rejection ", reasonForRejection)
        // API call to approve/reject the request
        try {
            console.log("🚀 ~ handleApproveReject ~ request", request);
            const response = await AdminService.handleEtagAllocationRequest(request.id, action, reasonForRejection);
            if (response.error) {
                console.error("Error approving/rejecting request", response.error);
                showToast(false, response.error);
                return;
            }
            console.log("🚀 ~ handleApproveReject ~ response", response);         
            showToast(true, response.message);  
            setEtagRequests((prevRequests) => prevRequests.filter((r) => r.id !== request.id));
        } catch (error) {
            console.error("Error approving/rejecting request", error);
        } finally {
            setModalLoading(false);
            setReasonForRejection(null);
            document.getElementById('confirmation_modal').close();
        }
    };

    const fetchOldRequests = () => {
        async function fetchOldRequests() {
            setLoadingOldRequests(true);
            const oldRequests = [];
            try {
                const response = await AdminService.getNonPendingEtagAllocations(tower.id);
                if (response.error) {
                    console.error("Error fetching old requests", response.error);
                    return;
                }
                console.log("🚀 ~ fetchOldRequests ~ response.data.etagAllocations", response.data.etagAllocations);
                setFetchedOldRequests(true);

                //checklength of response.data.etagAllocations
                if (response.data.etagAllocations.length === 0) {
                    setLoadingOldRequests(false);
                    return;
                }

                // Transform the data to match the expected structure
                const transformedData = response.data.etagAllocations.map(item => {
                    let expiresOn = " - ";
                    if (item.is_issued) {
                        const dateIssued = new Date(item.date_issued);
                        const expiresDate = new Date(dateIssued.setMonth(dateIssued.getMonth() + 6));
                        expiresOn = expiresDate.toLocaleString();
                    }
    
                    return {
                        id: item._id,
                        employeeId: item.employee_id._id,
                        requestedOn: new Date(item.date_requested).toLocaleString(),
                        expiresOn: expiresOn,
                        companyName: item.employee_id.tenant_name,
                        employeeName: item.employee_id.name,
                        employeeCnic: item.employee_id.cnic,
                        issued: item.is_issued,
                        active: item.is_requested && !item.is_returned,
                        carRegistrationNumber: item.vehicle_number
                    };
                });
                
                //before setting old requests, filter out elements which have the same id , so no duplicate keys occur.
                setEtagRequests((prevRequests) => prevRequests.filter((r) => !transformedData.some((t) => t.id === r.id)));

                oldRequests.push(...transformedData);
                setEtagRequests((prevRequests) => [...prevRequests, ...oldRequests]);

                // Sort by issued date, oldest first
                setSortField('issued');
                setSortOrder('asc');
                setLoadingOldRequests(false);
            } catch (error) {
                console.error("Error fetching old requests", error);
                return;
            }
        }

        fetchOldRequests();
    };

    const filteredData = etagRequests.filter((request) => {
        return (
            (filter === 'All' || (filter === 'Pending' && !request.issued) || (filter === 'Issued' && request.issued)) &&
            (request.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.employeeCnic.includes(searchQuery))
        );
    });

    const sortedData = filteredData.sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        if (typeof a[sortField] === 'string') {
            return sortOrder === 'asc'
                ? a[sortField].localeCompare(b[sortField])
                : b[sortField].localeCompare(a[sortField]);
        } else if (typeof a[sortField] === 'boolean') {
            return sortOrder === 'asc'
                ? (a[sortField] === b[sortField] ? 0 : a[sortField] ? 1 : -1)
                : (a[sortField] === b[sortField] ? 0 : a[sortField] ? -1 : 1);
        } else {
            return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
        }
    });

    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <Sidebar>
            {/* Modal */}
            <dialog id="confirmation_modal" className="modal">
                <div className="modal-box w-11/12 max-w-xl">
                    <div className="flex items-center gap-3 mb-3">
                        {
                            currentRequest?.action === 'approve' ? <HandThumbUpIcon className="size-8 text-primary" /> : <HandThumbDownIcon className="size-8 text-error " />
                        }
                        <h3 className="font-bold text-lg">{currentRequest?.action === 'approve' ? 'Approve Request' : 'Reject Request'}</h3>
                    </div>
                    <p className="text-sm ">
                        Are you sure you want to {currentRequest?.action} this request?
                    </p>
                    {
                        currentRequest?.action === 'reject' && (
                            <div className="mt-3">
                                <label htmlFor="reason" className="label">Please provide a reason below to the tenant for rejecting their request </label>
                                <textarea id="reason" className="textarea textarea-bordered w-full" placeholder="Enter reason for rejection"
                                    rows={5}
                                    value={reasonForRejection}
                                    onChange={(e) => setReasonForRejection(e.target.value)}
                                ></textarea>
                            </div>
                        )

                    }
                    <div className="modal-action">
                        <button className="btn mr-1" onClick={() => document.getElementById('confirmation_modal').close()}>Cancel</button>
                        <button
                            className={`btn ${ currentRequest?.action == "approve" ? "btn-primary" : "btn-error" } text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={() => handleApproveReject(currentRequest.request, currentRequest.action)}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : currentRequest?.action === "approve" ? "Approve" : "Reject"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Loading spinner */}
            {loading && <NSTPLoader />}

            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">E-tag Requests</h1>
                    <button
                        className={`btn btn-primary text-white ${loadingOldRequests && 'btn-disabled'} ${fetchedOldRequests && 'btn-disabled'}`}
                        onClick={fetchOldRequests}
                        disabled={loadingOldRequests}
                    >
                        {loadingOldRequests ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Please wait...
                            </>
                        ) : (
                            <>
                                <ArchiveBoxIcon className="size-6 mr-2" />
                                Fetch Old Requests
                            </>
                        )}
                    </button>
                </div>

                <div className="flex flex-row max-sm:flex-col items-center justify-between mt-4">
                    <div className="relative w-full md:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="input input-bordered w-full pl-10"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    </div>
                    <div className="w-full md:w-4/12 flex items-center justify-end">
                        <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                        <select value={filter} onChange={handleFilterChange} className="select select-bordered w-full md:max-w-xs max-sm:mt-2">
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Issued">Issued</option>
                        </select>
                    </div>
                </div>

                {filteredData.length === 0 ? (
                    <p className="text-gray-500 mt-10">No data to show for now.</p>
                ) : (
                    <div className="h-full min-h-content overflow-y-auto">
                        <p className="my-2 text-gray-500 text-sm">Click on any column header to sort data</p>
                        <table className="table mt-5 min-h-full rounded-lg mb-9">
                            <thead>
                                <tr className="bg-base-200 cursor-pointer">
                                    {['requestedOn', 'expiresOn', 'companyName', 'employeeName', 'employeeCnic', 'carRegistrationNumber', 'status'].map((field) => (
                                        <th key={field} onClick={() => handleSortChange(field)}>
                                            {sortField === (field === 'status' ? 'issued' : field) ? (sortOrder === 'asc' ? '▲' : '▼') : ''} {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </th>
                                    ))}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((request) => (
                                    <tr id={`request-row-${request.id}`} key={request.id} className="relative group">
                                        <td>{request.requestedOn}</td>
                                        <td>{request.expiresOn}</td>
                                        <td>{request.companyName}</td>
                                        <td>{request.employeeName}</td>
                                        <td>{request.employeeCnic}</td>
                                        <td>{request.carRegistrationNumber}</td>
                                        <td>
                                            <div className={`badge p-3 ${request.issued ? "badge-success text-lime-100" : "badge-accent text-white"} text-sm mt-2`}>
                                                {request.issued ? <CheckIcon className="size-4 mr-2" /> : <ClockIcon className="size-4 mr-2" />} {request.issued ? "Issued" : "Pending"}
                                            </div>
                                        </td>
                                        <td>
                                            {!request.issued && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline btn-success mr-2"
                                                        onClick={() => {
                                                            setCurrentRequest({ request, action: 'approve' });
                                                            document.getElementById('confirmation_modal').showModal();
                                                        }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-error btn-outline"
                                                        onClick={() => {
                                                            setCurrentRequest({ request, action: 'reject' });
                                                            document.getElementById('confirmation_modal').showModal();
                                                        }}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-4">
                            <button
                                className="btn btn-outline"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <div className="flex flex-col items-center justify-center">
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <span className="font-bold text-sm">
                                    Showing {Math.min(itemsPerPage, filteredData.length - (currentPage - 1) * itemsPerPage)} of {filteredData.length} requests
                                </span>
                            </div>
                            <button
                                className="btn btn-outline"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default Etags;