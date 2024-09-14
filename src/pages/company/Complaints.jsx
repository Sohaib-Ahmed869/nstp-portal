import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import NSTPLoader from '../../components/NSTPLoader'
import ComplaintModal from '../../components/ComplaintModal'
import ComplaintsTable from '../../components/ComplaintsTable'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PencilSquareIcon, CogIcon, WrenchScrewdriverIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'


const Complaints = () => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [generalSortField, setGeneralSortField] = useState("date");
    const [generalSortOrder, setGeneralSortOrder] = useState("asc");
    const [servicesSortField, setServicesSortField] = useState("date");
    const [servicesSortOrder, setServicesSortOrder] = useState("asc");
    const [complaintIdToDelete, setComplaintIdToDelete] = useState(null);
    const [complaintTypeToDelete, setComplaintTypeToDelete] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [generalComplaintData, setGeneralComplaintData] = useState([
        { id: "12345", date: "12-13-2024 21:32", type: "general", subject: "Too much noise", description: "Too much noise being caused please fix this issue", isResolved: false },
        { id: "12346", date: "12-13-2024 12:32", type: "general", subject: "AC not working", description: "I like it to be working properly and not dirty", isResolved: true },
        { id: "12347", date: "12-13-2024 15:30", type: "general", subject: "Noisy Neighbours", description: "Please tell them to be quiet", isResolved: false },
    ]);

    const [servicesComplaintData, setServicesComplaintData] = useState([
        { id: "12348", date: "12-13-2024 11:32", type: "services", serviceType: "Cleaning", description: "Too dirty please clean", urgency: 2, isResolved: true },
        { id: "12349", date: "12-13-2024 11:32", type: "services", serviceType: "Electrician", description: "AC and switches not working!", urgency: 3, isResolved: true },
        { id: "12339", date: "12-13-2024 11:32", type: "services", serviceType: "Hotel", description: " - ", urgency: 1, isResolved: false },
    ]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const handleSortChange = (field, type) => {
        if (type === "general") {
            const order = generalSortField === field && generalSortOrder === "asc" ? "desc" : "asc";
            setGeneralSortField(field);
            setGeneralSortOrder(order);
        } else {
            const order = servicesSortField === field && servicesSortOrder === "asc" ? "desc" : "asc";
            setServicesSortField(field);
            setServicesSortOrder(order);
        }
    };

    const handleCancel = (id, type) => {
        //api call here to cancel complaint
        setCancelLoading(true);
        setTimeout(() => {
            setCancelLoading(false);
            document.getElementById("cancel_complaint_modal").close();
        }, 2000);

        // below code will update the table on frontend by removing it from the data to display
        // if (type === "general") {
        //     setGeneralComplaintData(generalComplaintData.filter(complaint => complaint.id !== id));
        // } else {
        //     setServicesComplaintData(servicesComplaintData.filter(complaint => complaint.id !== id));
        // }
    };

    const sortData = (data, sortField, sortOrder) => {
        return data.sort((a, b) => {
            if (sortField === "date") {
                return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            } else if (sortField === "subject" || sortField === "serviceType") {
                return sortOrder === "asc" ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
            } else if (sortField === "urgency" || sortField === "isResolved") {
                return sortOrder === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
            }
            return 0;
        });
    };

    const filteredGeneralComplaints = sortData(
        generalComplaintData.filter(complaint =>
            (statusFilter === "All" || (statusFilter === "Resolved" && complaint.isResolved) || (statusFilter === "Unresolved" && !complaint.isResolved)) &&
            (complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                complaint.date.includes(searchQuery))
        ),
        generalSortField,
        generalSortOrder
    );

    const filteredServicesComplaints = sortData(
        servicesComplaintData.filter(complaint =>
            (statusFilter === "All" || (statusFilter === "Resolved" && complaint.isResolved) || (statusFilter === "Unresolved" && !complaint.isResolved)) &&
            (complaint.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                complaint.date.includes(searchQuery))
        ),
        servicesSortField,
        servicesSortOrder
    );

    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            <ComplaintModal />

            {/* Modal to confirm cancellation of complaint */}
            <dialog id="cancel_complaint_modal" className="modal">
                <div className="modal-box">
                    <h2 className="text-xl font-bold">Cancel Complaint</h2>
                    <p className="text-gray-500 mt-2">Are you sure you want to cancel this complaint?</p>
                    <div className="modal-action">
                        <button className={`btn btn-danger mr-2 ${cancelLoading && "btn-disabled"}`} onClick={() => document.getElementById("cancel_complaint_modal").close()}>No</button>
                        <button className={`btn  btn-primary ${cancelLoading && "btn-disabled"}`} onClick={() => { handleCancel(complaintIdToDelete, complaintTypeToDelete) }}> {cancelLoading && <span className="loading loading-spinner"></span>} { cancelLoading ? "Cancelling..." : "Yes"  }</button>
                    </div>
                </div>
            </dialog>


            {/* Main Page Content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`} >
                {/* Header + add new emp btn */}
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Complaints</h1>
                    <button
                        className="btn btn-primary text-white"
                        onClick={() => document.getElementById('complaint_modal').showModal()} >
                        <PencilSquareIcon className="size-6" />
                        Register new complaint
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col  lg:flex-row items-start lg:justify-between mt-4">
                    <div className="relative w-full lg:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    </div>
                    <div className="w-full mt-3 lg:mt-0 lg:w-4/12 flex flex-col lg:items-end  gap-3 lg:justify-end max-md:mt-2">
                        <div className="flex w-full items-center lg:justify-end">
                            <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                            <p className="font-semibold mr-2">Status </p>
                            <select
                                className="select select-bordered w-full sm:max-w-xs"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Unresolved">Unresolved</option>
                            </select>
                        </div>
                        <div className="flex w-full items-center lg:justify-end">
                            <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                            <p className="font-semibold mr-2">Type </p>
                            <select
                                className="select select-bordered w-full sm:max-w-xs"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="General">General</option>
                                <option value="Services">Services</option>
                            </select>
                        </div>
                    </div>
                </div>

               {/* General Complaints Table */}
               {(typeFilter === "All" || typeFilter === "General") && (
                    <ComplaintsTable
                        title="General Complaints"
                        icon={CogIcon}
                        complaintType={"general"}
                        complaints={filteredGeneralComplaints}
                        sortField={generalSortField}
                        sortOrder={generalSortOrder}
                        handleSortChange={(field) => handleSortChange(field, "general")}
                        setComplaintIdToDelete={setComplaintIdToDelete}
                        setComplaintTypeToDelete={setComplaintTypeToDelete}
                    />
                )}

                {typeFilter === "All" && <hr className="mb-6"></hr>}

                {/* Services Complaints Table */}
                {(typeFilter === "All" || typeFilter === "Services") && (
                    <ComplaintsTable
                        title="Services Complaints"
                        icon={WrenchScrewdriverIcon}
                        complaintType={"services"}
                        complaints={filteredServicesComplaints}
                        sortField={servicesSortField}
                        sortOrder={servicesSortOrder}
                        
                        handleSortChange={(field) => handleSortChange(field, "services")}
                       setComplaintIdToDelete={setComplaintIdToDelete}
                        setComplaintTypeToDelete={setComplaintTypeToDelete}

                    />
                )}
            </div>
        </Sidebar>
    );
};

export default Complaints;