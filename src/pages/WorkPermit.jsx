import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NSTPLoader from '../components/NSTPLoader';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { PlusCircleIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

const WorkPermit = ({ role }) => {
    const [workPermits, setWorkPermits] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedWorkPermitId, setSelectedWorkPermitId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newWorkPermit, setNewWorkPermit] = useState({
        name: "",
        department: "",
        description: "",
        ppe: "",
    });


    useEffect(() => {
        //api call here
        setTimeout(() => {
            if (role === "tenant") {
                setWorkPermits([
                    { id: "1", name: "Musa Plumber", department: "Maintenance", description: "Fixing pipes", ppe: "Helmet, Gloves", date: "2024-12-20", issued: false },
                    { id: "2", name: "Salman Builder", department: "Construction", description: "Building walls", ppe: "Helmet, Safety Shoes", date: "2024-12-21", issued: true },
                    { id: "3", name: "Musa Haroon", department: "Electrical", description: "Wiring", ppe: "Insulated Gloves", date: "2024-12-22", issued: false },
                    { id: "4", name: "Sohaib Ahmed", department: "HVAC", description: "Installing AC", ppe: "Mask, Gloves", date: "2024-12-23", issued: true },
                    { id: "5", name: "Ahmed Electrician", department: "Electrical", description: "Fixing lights", ppe: "Insulated Gloves", date: "2024-12-24", issued: false },
                ]);
            } else if (role === "receptionist" || role == "admin") {
                setWorkPermits([
                    { id: "1", tenantName: "HexlerTech", name: "Musa Plumber", department: "Maintenance", description: "Fixing pipes", ppe: "Helmet, Gloves", date: "2024-12-20", issued: false },
                    { id: "2", tenantName: "HexlerTech", name: "Salman Builder", department: "Construction", description: "Building walls", ppe: "Helmet, Safety Shoes", date: "2024-12-21", issued: true },
                    { id: "3", tenantName: "HexlerTech", name: "Musa Haroon", department: "Electrical", description: "Wiring", ppe: "Insulated Gloves", date: "2024-12-22", issued: false },
                    { id: "4", tenantName: "HexlerTech", name: "Sohaib Ahmed", department: "HVAC", description: "Installing AC", ppe: "Mask, Gloves", date: "2024-12-23", issued: true },
                    { id: "5", tenantName: "HexlerTech", name: "Ahmed Electrician", department: "Electrical", description: "Fixing lights", ppe: "Insulated Gloves", date: "2024-12-24", issued: false },
                ]);
            }
            setLoading(false);
        }, 2000);
    }, []);

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
            return filter === "Issued" ? permit.issued : !permit.issued;
        })
        .filter((permit) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                permit.name.toLowerCase().includes(searchLower) ||
                permit.department.toLowerCase().includes(searchLower) ||
                permit.description.toLowerCase().includes(searchLower) ||
                permit.ppe.toLowerCase().includes(searchLower) ||
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

    const handleApproveWorkPermit = () => {
        //api call here
        setModalLoading(true);
        setTimeout(() => {
            const updatedWorkPermits = workPermits.map((permit) =>
                permit.id === selectedWorkPermitId ? { ...permit, issued: true } : permit
            );
            setWorkPermits(updatedWorkPermits);
            console.log(updatedWorkPermits.find((permit) => permit.id === selectedWorkPermitId));
            setModalLoading(false);
            document.getElementById('approve_work_permit_modal').close();
        }, 2000);
    };

    const handleCancelWorkPermit = () => {
        setModalLoading(true);
        //change api call here depending on the selectedworkpermit (issued or not) and the role
        // eg tenant - cancel pending vs cancel issued
        // admin  - cancel pending vs cancel issued
        setTimeout(() => {
            const updatedWorkPermits = workPermits.filter((permit) => permit.id !== selectedWorkPermitId);
            setWorkPermits(updatedWorkPermits);
            console.log(`Cancelled work permit with ID: ${selectedWorkPermitId}`);
            setModalLoading(false);
            document.getElementById('cancel_work_permit_modal').close();
        }, 2000);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWorkPermit((prev) => ({ ...prev, [name]: value }));
    };

    const handleRequestWorkPermit = () => {
        //api call here
        setModalLoading(true);
        setTimeout(() => {
            const newPermit = {
                ...newWorkPermit,
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0],
                issued: false,
            };
            setWorkPermits((prev) => [...prev, newPermit]);
            setModalLoading(false);
            document.getElementById('request_work_permit_modal').close();
        }, 2000);
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            <dialog id="approve_work_permit_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Approve Work Permit</h3>
                    <p>Are you sure you want to approve this work permit?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('approve_work_permit_modal').close()}>No</button>
                        <button
                            className={`btn btn-success ${modalLoading && "btn-disabled"}`}
                            onClick={handleApproveWorkPermit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : "Yes, Approve"}
                        </button>
                    </div>
                </div>
            </dialog>

            <dialog id="request_work_permit_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Request New Work Permit</h3>
                    <form>
                        <FloatingLabelInput
                            name="name"
                            type="text"
                            id="name"
                            label="Name of Person"
                            value={newWorkPermit.name}
                            onChange={handleInputChange}
                        />
                        <FloatingLabelInput
                            name="department"
                            type="text"
                            id="department"
                            label="Department"
                            value={newWorkPermit.department}
                            onChange={handleInputChange}
                        />
                        <FloatingLabelInput
                            name="description"
                            type="textarea"
                            id="description"
                            label="Detailed information, along with use of tools"
                            value={newWorkPermit.description}
                            onChange={handleInputChange}
                        />
                        <FloatingLabelInput
                            name="ppe"
                            type="text"
                            id="ppe"
                            label="Personal Protective Equipment"
                            value={newWorkPermit.ppe}
                            onChange={handleInputChange}
                        />
                    </form>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('request_work_permit_modal').close()}>Cancel</button>
                        <button
                            className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
                            onClick={handleRequestWorkPermit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : "Request"}
                        </button>
                    </div>
                </div>
            </dialog>

            <dialog id="cancel_work_permit_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Cancel Work Permit</h3>
                    <p>Are you sure you want to cancel this work permit?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('cancel_work_permit_modal').close()}>No</button>
                        <button
                            className={`btn btn-error ${modalLoading && "btn-disabled"}`}
                            onClick={handleCancelWorkPermit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : "Yes, Cancel"}
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
                            <option value="Issued">Issued</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="w-full overflow-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className='bg-base-200 cursor-pointer'>
                                <th onClick={() => handleSortChange("date")}>Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                {role !== "tenant" && <th onClick={() => handleSortChange("tenantName")}>Tenant {sortField === "tenantName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>}
                                <th onClick={() => handleSortChange("name")}>Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("department")}>Department {sortField === "department" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("description")}>Description {sortField === "description" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("ppe")}>PPE {sortField === "ppe" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("issued")}>Status {sortField === "issued" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                {role !== "receptionist" && <th>Actions</th>} {/* recep can only view, no actions */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500">No data to show for now.</td>
                                </tr>
                            ) : (
                                filteredData.map((permit) => (
                                    <tr key={permit.id}>
                                        <td>{permit.date}</td>
                                        {role != "tenant" && <td>{permit.tenantName}</td>}
                                        <td>{permit.name}</td>
                                        <td>{permit.department}</td>
                                        <td>{permit.description}</td>
                                        <td>{permit.ppe}</td>
                                        <td className={`badge ${permit.issued ? "badge-success text-lime-100" : "badge-accent text-white"} text-sm mt-2`}>
                                            {permit.issued ? <CheckIcon className="size-4 mr-2" /> : <ClockIcon className="size-4 mr-2" />}
                                            {permit.issued ? "Issued" : "Pending"}
                                        </td>
                                        {role !== "receptionist" && 
                                        <td>
                                            <div className="flex gap-3">
                                                {role === "admin" && !permit.issued && (
                                                    <button
                                                        className="btn btn-success btn-outline btn-sm"
                                                        onClick={() => {
                                                            setSelectedWorkPermitId(permit.id);
                                                            document.getElementById('approve_work_permit_modal').showModal();
                                                        }}
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-error btn-outline btn-sm"
                                                    onClick={() => {
                                                        setSelectedWorkPermitId(permit.id);
                                                        document.getElementById('cancel_work_permit_modal').showModal();
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Sidebar>
    );
};

export default WorkPermit;