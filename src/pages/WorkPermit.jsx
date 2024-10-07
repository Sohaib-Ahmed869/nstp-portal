import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import NSTPLoader from '../components/NSTPLoader';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { PlusCircleIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, CheckIcon, ClockIcon, WrenchIcon, XMarkIcon, XCircleIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { TenantService, AdminService, ReceptionistService } from '../services';
import { TowerContext } from '../context/TowerContext';
import showToast from '../util/toast';

//IMP NOTE
//the format to display
// key: permit._id,
// id: permit._id,
// name: permit.name,
// department: permit.department,
// date: new Date(permit.valid_from).toLocaleDateString(),
// status: permit.is_resolved ? (permit.status === "approved" ? "approved" : "rejected") : "pending",
// detailedInfo: permit.detailed_information,
// equipment: permit.equipment,
// description: permit.description,

const WorkPermit = ({ role }) => {
    const [workPermits, setWorkPermits] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedWorkPermitId, setSelectedWorkPermitId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reasonForRejection, setReasonForRejection] = useState("");
    const [newWorkPermit, setNewWorkPermit] = useState({
        name: "",
        department: "",
        description: "",
        startDate: "",
        endDate: "",
        detailedInfo: "",
        ppe: "",
    });
    const { tower } = useContext(TowerContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    /** Effects */
    useEffect(() => {
        async function fetchWorkPermits() {
            setLoading(true);
            try {
                let response;
                if (role === "tenant") {
                    response = await TenantService.getWorkPermits();
                }
                else if (role === "receptionist") {
                    response = await ReceptionistService.getWorkPermits();
                } 
                else if (role === "admin") {
                    response = await AdminService.getWorkPermits(tower.id);
                }
                if (response.error) {
                    showToast(false)
                    console.error(response.error);
                    return;
                }

                const mappedData = response.data.workPermits.map(permit => ({
                    key: permit._id,
                    id: permit._id,
                    name: permit.name,
                    department: permit.department,
                    date: new Date(permit.valid_from).toLocaleDateString(),
                    status: permit.is_resolved ? (permit.status === "approved" ? "approved" : "rejected") : "pending",
                    detailedInfo: permit.detailed_information,
                    equipment: permit.equipment,
                    description: permit.description,
                    tenant: permit.tenant,
                    reasonDecline: permit.reason_decline,
                }));
                setWorkPermits(mappedData);


            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchWorkPermits();
    }, []);
    /** END Effects */

    /** Search, sort and filter related Functions & Controlled states */
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const filteredData = workPermits
        .filter((permit) => {
            if (filter === "All") return true;
            if (filter === "Approved") return permit.status === "approved";
            if (filter === "Pending") return permit.status === "pending";
            if (filter === "Rejected") return permit.status === "rejected";
            return false;
        })
        .filter((permit) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                permit.name.toLowerCase().includes(searchLower) ||
                permit.department.toLowerCase().includes(searchLower) ||
                permit.description?.toLowerCase().includes(searchLower) ||
                permit.ppe?.toLowerCase().includes(searchLower) ||
                (role === "receptionist" && permit.tenantName?.toLowerCase().includes(searchLower))
            );
        })
        .sort((a, b) => {
            if (sortField === "date") {
                return sortOrder === "asc"
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortField === "issued") {
                return sortOrder === "asc"
                    ? a.issued - b.issued
                    : b.issued - a.issued;
            } else {
                return sortOrder === "asc"
                    ? a[sortField].localeCompare(b[sortField])
                    : b[sortField].localeCompare(a[sortField]);
            }
        });
    /** END Search, sort and filter related Functions & Controlled states */

    /** Approve work permit (admin) */
    const handleApproveWorkPermit = async () => {
        //api call here
        setModalLoading(true);

        try {
            const response = await AdminService.handleWorkPermit(selectedWorkPermitId, true);
            if (response.error) {
                console.error(response.error);
                showToast(false, "Failed to approve work permit");
                return;
            }
            showToast(true, "Work permit approved successfully");
            // Update the work permit status
            const updatedWorkPermits = workPermits.map((permit) => {
                if (permit.id === selectedWorkPermitId) {
                    permit.status = "approved";
                }
                return permit;
            });
            setWorkPermits(updatedWorkPermits);

        } catch (error) {
            console.error(error);
            showToast(false, "Failed to approve work permit");
        } finally {
            setModalLoading(false);
            setSelectedWorkPermitId(null); // Reset selectedWorkPermitId
            document.getElementById('approve_work_permit_modal').close();
        }

    };

    /** Cancel work permit (admin) */
    const handleCancelWorkPermit = async (selectedWorkPermitId) => {
        setModalLoading(true);
        console.log("REASON " , reasonForRejection)
        console.log(`Selected Work Permit ID: ${selectedWorkPermitId}`);

        // Ensure selectedWorkPermitId is not undefined or null
        if (!selectedWorkPermitId) {
            console.error("Selected Work Permit ID is undefined or null");
            setModalLoading(false);
            return;
        }

        // Ensure selectedWorkPermitId is a string
        const selectedId = selectedWorkPermitId.toString();

        try {
            const response = await AdminService.handleWorkPermit(selectedId, false, reasonForRejection);
            if (response.error) {
                console.error(response.error);
                showToast(false, "Failed to cancel work permit");
                return;
            }

            showToast(true, "Work permit cancelled successfully");
            // Update the work permit status
            const updatedWorkPermits = workPermits.map((permit) => {
                if (permit.id === selectedId) {
                    permit.status = "rejected";
                }
                return permit;
            });
            setWorkPermits(updatedWorkPermits);

        } catch (error) {
            console.error(error);
            showToast(false, "Failed to cancel work permit");
        } finally {
            setModalLoading(false);
            setSelectedWorkPermitId(null); // Reset selectedWorkPermitId
            setReasonForRejection(''); // Reset reason for rejection
            document.getElementById('cancel_work_permit_modal').close();
        }
    };

    /** Tenant add new work permit related functions */
    const handleDateChange = (e) => {
        handleInputChange(e);
        // Set end date to end of the day
        const date = new Date(e.target.value);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999); // Set to the end of the day

        // Format the end date
        const formattedEndDate = endDate.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });

        setNewWorkPermit((prev) => ({ ...prev, endDate: formattedEndDate }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkPermit((prev) => ({ ...prev, [name]: value }));
    };

    const resetWorkPermit = () => {
        setNewWorkPermit({
            name: "",
            department: "",
            description: "",
            startDate: "",
            endDate: "",
            detailedInfo: "",
            ppe: "",
        });
    };

    const handleRequestWorkPermit = async (e) => {
        e.preventDefault();
        setModalLoading(true);

        try {
            const response = await TenantService.requestWorkPermit(newWorkPermit);
            if (response.error) {
                console.error(response.error);
                return;
            }
            const mappedNewWorkPermit = {
                id: response.data.id, // Assuming the response contains the new permit's ID
                key: response.data.id,
                name: newWorkPermit.name,
                department: newWorkPermit.department,
                date: new Date(newWorkPermit.startDate).toLocaleDateString(),
                status: "pending", // New permits are initially pending
                detailedInfo: newWorkPermit.detailedInfo,
                equipment: newWorkPermit.ppe, // Assuming ppe is the equipment field
                description: newWorkPermit.description,
                valid_from: newWorkPermit.startDate,
                is_resolved: false,
                reasonDecline: null,
                
            };

            setWorkPermits((prev) => [...prev, mappedNewWorkPermit]);
            showToast(true, "Work permit requested successfully");

        } catch (error) {
            console.error(error);
            showToast(false, "Failed to request work permit");
        } finally {
            setModalLoading(false);
            document.getElementById('request_work_permit_modal').close();
            resetWorkPermit();
        }
    };
    /** END Tenant add new work permit related functions */

    /** Pagination related functions */
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    /** END Pagination related functions */

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            {/** Modal for Viewing details of a work permit */}
            <dialog id="work_permit_details_modal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3" > <WrenchIcon className="size-6" /> Work Permit Details</h3>
                    <hr className="my-5 text-gray-200" />
                    {selectedWorkPermitId && (
                        <div>
                            <p className="mt-3"><strong className="text-primary">Description:</strong> {workPermits.find(permit => permit.id === selectedWorkPermitId).description}</p>
                            <p className="mt-3"><strong className="text-primary">Detailed Information:</strong> {workPermits.find(permit => permit.id === selectedWorkPermitId).detailedInfo}</p>
                            <p className="mt-3"><strong className="text-primary">Equipment:</strong> {workPermits.find(permit => permit.id === selectedWorkPermitId).equipment}</p>
                            <p className="mt-3"><strong className="text-primary">Status:</strong> {workPermits.find(permit => permit.id === selectedWorkPermitId).status}</p>
                            <p className="mt-3"><strong className="text-primary">Reason for rejection (if any):</strong> {workPermits.find(permit => permit.id === selectedWorkPermitId).reasonDecline || "N/A" }</p>
                            <p className="mt-3"><strong className="text-primary">Date Requested:</strong> {workPermits.find(permit => permit.id === selectedWorkPermitId).date}</p>
                            <p className="mt-3 text-gray-400">Note: The ending time is 23:59 on the same date. </p>
                        </div>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('work_permit_details_modal').close()}>Close</button>
                    </div>
                </div>
            </dialog>

            {/** Modal to approve work permit (Only for admin) */}
            <dialog id="approve_work_permit_modal" className="modal">
                <div className="modal-box">
                    <div className="mb-2 flex items-center gap-2">
                        <HandThumbUpIcon className="size-8 text-primary" />
                        <h3 className="font-bold text-lg ">Approve Work Permit</h3>
                    </div>
                    <p>Are you sure you want to approve this work permit?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('approve_work_permit_modal').close()}>No</button>
                        <button
                            className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
                            onClick={handleApproveWorkPermit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : "Yes, Approve"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/** Modal to request new work permit (Only for tenant) */}
            <dialog id="request_work_permit_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4 ">Request New Work Permit</h3>
                    <form onSubmit={handleRequestWorkPermit}>
                        <FloatingLabelInput name="name" type="text" id="name" label="Name of Person" value={newWorkPermit.name} onChange={handleInputChange} required />
                        <FloatingLabelInput name="department" type="text" id="department" label="Department" value={newWorkPermit.department} onChange={handleInputChange} required />
                        <FloatingLabelInput name="description" type="textarea" id="description" label="Description" value={newWorkPermit.description} onChange={handleInputChange} required />
                        <FloatingLabelInput name="startDate" type="datetime-local" id="startDate" label="Start Date" value={newWorkPermit.startDate} onChange={handleDateChange} required />
                        <p className="mb-4"> <span className="font-bold text-primary mb-3">End date: </span>{newWorkPermit.endDate.toString()}</p>
                        <FloatingLabelInput name="detailedInfo" type="textarea" id="detailedInfo" label="Detailed information, along with use of tools" value={newWorkPermit.detailedInfo} onChange={handleInputChange} />
                        <FloatingLabelInput name="ppe" type="text" id="ppe" label="Personal Protective Equipment (Comma Separated)" value={newWorkPermit.ppe} onChange={handleInputChange} />
                        <div className="modal-action">
                            <button className="btn" type="button" onClick={(e) => {
                                e.stopPropagation();
                                resetWorkPermit()
                                document.getElementById('request_work_permit_modal').close();

                            }}>Cancel</button>
                            <button
                                className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
                                type='submit'
                            >
                                {modalLoading && <span className="loading loading-spinner"></span>}
                                {modalLoading ? "Please wait..." : "Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <dialog id="cancel_work_permit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl ">
                    <div className="flex items-center mb-4 gap-3">
                        <HandThumbDownIcon className="size-8 text-error" />
                        <h3 className="font-bold text-lg "> {role == "admin" ? "Reject" : "Cancel"} Work Permit</h3>

                    </div>
                    {
                        role == "admin" ?
                            <p className="mb-5">Please provide an explanation for the tenant about rejecting their work permit.</p>
                            :
                            <p className="mb-5">Are you sure you want to cancel this work permit?</p>
                    }
                    {role == "admin" && <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Reason for cancellation"
                        rows={10}
                        value={reasonForRejection}
                        onChange={(e) => setReasonForRejection(e.target.value)}
                    ></textarea>}
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('cancel_work_permit_modal').close()}>No</button>
                        <button
                            className={`btn btn-error text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={() => handleCancelWorkPermit(selectedWorkPermitId)}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : role == "admin" ? "Reject Permit" : "Cancel Permit"}
                        </button>
                    </div>
                </div>
            </dialog>

            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}>
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Work Permits</h1>
                    {role === "tenant" && (
                        <button className="btn text-base-100 btn-primary" onClick={() => document.getElementById('request_work_permit_modal').showModal()}>
                            <PlusCircleIcon className="size-6 mr-2" />
                            Request New Work Permit
                        </button>
                    )}
                </div>
                <hr className="my-5 text-gray-200" />

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                    <div className="relative w-full lg:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="input input-bordered w-full pl-10"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    </div>
                    <div className="w-full lg:max-w-xs flex items-center">
                        <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                        <select
                            value={filter}
                            onChange={handleFilterChange}
                            className="select select-bordered w-full lg:max-w-xs"
                        >
                            <option value="All">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="w-full overflow-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className='bg-base-200 cursor-pointer'>
                                <th onClick={() => handleSortChange("date")}>Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("tenant")}>Tenant {sortField === "tenant" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("name")}>Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("department")}>Department {sortField === "department" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("status")}>Status {sortField === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500">No data to show for now.</td>
                                </tr>
                            ) : (
                                currentItems.map((permit) => (
                                    <tr key={permit.id}>
                                        <td>{permit.date}</td>
                                        {
                                            role !== "tenant" ? 
                                            <td>{permit.tenant}</td>
                                            : null
                                        }
                                        <td>{permit.name}</td>
                                        <td>{permit.department}</td>
                                        <td className={`badge ${permit.status === "approved" ? "badge-primary" : permit.status === "rejected" ? "badge-error" : "badge-secondary"} text-sm mt-2 flex gap-2`}>
                                            {permit.status == "approved" ? <CheckIcon className="size-4" /> : permit.status == "rejected" ? <XMarkIcon className="size-4" /> : <ClockIcon className="size-4" />}
                                            {permit.status.charAt(0).toUpperCase() + permit.status.slice(1)}
                                        </td>
                                        <td>
                                            <div className='flex gap-3'>
                                                <button
                                                    className="btn btn-primary btn-outline btn-sm"
                                                    onClick={() => {
                                                        setSelectedWorkPermitId(permit.id);
                                                        document.getElementById('work_permit_details_modal').showModal();
                                                    }}
                                                >
                                                    Show Details
                                                </button>
                                                {
                                                    role === "admin" ?
                                                        permit.status == "approved" ?
                                                            null //the permit is already approved and the user is admin
                                                            :
                                                            permit.status == "pending" ?
                                                                <>
                                                                    <button
                                                                        className="btn btn-outline btn-success btn-sm"
                                                                        onClick={() => {
                                                                            setSelectedWorkPermitId(permit.id);
                                                                            document.getElementById('approve_work_permit_modal').showModal();
                                                                        }}>
                                                                        Approve
                                                                    </button>
                                                                </>
                                                                :
                                                                null // the permit is rejected and the user is admin
                                                        : null // the user is not admin
                                                }
                                                { permit.status == "pending" &&
                                                <button
                                                className="btn btn-outline btn-error btn-sm"
                                                onClick={() => {
                                                    setSelectedWorkPermitId(permit.id);
                                                    document.getElementById('cancel_work_permit_modal').showModal();
                                                }}>
                                                { role == "tenant" ? "Cancel" : 
                                                    "Reject"
                                                }
                                            </button>

                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-secondary"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default WorkPermit;