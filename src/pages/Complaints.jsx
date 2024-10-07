import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import NSTPLoader from '../components/NSTPLoader'
import ComplaintsTable from '../components/ComplaintsTable'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CogIcon, WrenchScrewdriverIcon, } from '@heroicons/react/24/outline'
import { setRole, getRole } from '../util/store'
import { ReceptionistService, AdminService } from '../services'
import { TowerContext } from '../context/TowerContext'
import { formatDate } from '../util/date'
/**
|--------------------------------------------------
| generic page for both admins and receptionists
| displays complaints based on role (general for admin, services for receptionist)
| for tenant complaints page go to src/pages/company/Complaints.jsx
|--------------------------------------------------
*/

export const Complaints = ({ role }) => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    // const [typeFilter, setTypeFilter] = useState("All"); //Might be needed later for filtering by type
    const [generalSortField, setGeneralSortField] = useState("date");
    const [generalSortOrder, setGeneralSortOrder] = useState("asc");
    const [servicesSortField, setServicesSortField] = useState("date");
    const [servicesSortOrder, setServicesSortOrder] = useState("asc");
    const {tower} = useContext(TowerContext);

    //BELOW IS THE SYNTAX FOR GENERAL COMPLAINT DATA VS SERVICES COMPLAINT DATA. 
    //GENERAL FOR ADMIN
    const [generalComplaintData, setGeneralComplaintData] = useState([
        { id: "12345", date: "12-13-2024 21:32", tenantName: "HexlarTech", type: "general", subject: "Too much noise", description: "Too much noise being caused please fix this issue", isResolved: false },
        { id: "12346", date: "12-13-2024 12:32", tenantName: "InnoSolutionz", type: "general", subject: "AC not working", description: "I like it to be working properly and not dirty", isResolved: true },
        { id: "12347", date: "12-13-2024 15:30", tenantName: "Zanbeel", type: "general", subject: "Noisy Neighbours", description: "Please tell them to be quiet", isResolved: false },
    ]);

    //SERVICES FOR RECEPTIONIST
    const [servicesComplaintData, setServicesComplaintData] = useState([
        { id: "12348", date: "12-13-2024 11:32", tenantName: "Cocoa Pallette", type: "services", serviceType: "Cleaning", description: "Please clean the floor", urgency: 2, isResolved: false },
        { id: "22348", date: "12-13-2024 11:32", tenantName: "Cocoa Tech", type: "services", serviceType: "Cleaning", description: "Please clean the fan", urgency: 3, isResolved: false },
        { id: "32348", date: "12-13-2024 11:32", tenantName: "Inno Palette", type: "services", serviceType: "Cleaning", description: "Too dirty", urgency: 1, isResolved: false },
        { id: "42348", date: "12-13-2024 11:32", tenantName: "Cocoa Pallette", type: "services", serviceType: "Cleaning", description: "I need cleaning", urgency: 2, isResolved: true },
    ]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (role === "admin") {
                    const response = await AdminService.getComplaints(tower.id);
                    if (response.error) {
                        console.log(response.error);
                        return;
                    }
                    
                    console.log(response.data.complaints);
                    const complaints = response.data.complaints;
    
                    const generalComplaints = complaints.map(complaint => ({
                        id: complaint._id,
                        date: formatDate(complaint.date_initiated),
                        tenantName: complaint.tenant_id, // Assuming tenantName is tenant_id for now
                        type: "general",
                        urgency: complaint.urgency || "Undetermined",
                        subject: complaint.subject,
                        description: complaint.description,
                        isResolved: complaint.is_resolved,
                        dateResolved: complaint.is_resolved ? (complaint.date_resolved ? formatDate(complaint.date_resolved) : "-") : "-",
                    }));
    
                    setGeneralComplaintData(generalComplaints);
                } else if (role === "receptionist") {
                    const response = await ReceptionistService.getComplaints(tower.id);
                    if (response.error) {
                        console.log(response.error);
                        return;
                    }
    
                    console.log(response.data.complaints);
                    const complaints = response.data.complaints;
    
                    const servicesComplaints = complaints.map(complaint => ({
                        id: complaint._id,
                        date: formatDate(complaint.date_initiated),
                        tenantName: complaint.tenant_id, // Assuming tenantName is tenant_id for now
                        type: "services",
                        serviceType: complaint.service_id, // Assuming serviceType is service_id for now
                        urgency: complaint.urgency || "Undetermined",
                        description: complaint.description,
                        isResolved: complaint.is_resolved,
                        dateResolved: complaint.is_resolved ? (complaint.date_resolved ? formatDate(complaint.date_resolved) : "-") : "-",
                    }));
    
                    setServicesComplaintData(servicesComplaints);
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    
        fetchData();
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

    const sortData = (data, sortField, sortOrder) => {
        return data.sort((a, b) => {
            if (sortField === "date") {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            } else if (sortField === "subject" || sortField === "serviceType" || sortField === "tenantName") {
                const fieldA = a[sortField].toLowerCase();
                const fieldB = b[sortField].toLowerCase();
                return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
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
                complaint.date.includes(searchQuery) ||
                complaint.tenantName.toLowerCase().includes(searchQuery.toLowerCase())) // this line is only for receptionist
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

            {/* Main Page Content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`} >
                {/* Header + add new emp btn */}
                <div className="flex flex-row items-center">
                    <h1 className="text-2xl font-bold">Complaints</h1>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col  lg:flex-row items-start lg:justify-between my-4">
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

                        {/* 
                        {/* This dropdown was for selecting the type of complaint, general or services
                        but for now there is no role that views them both together so its commented out
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
                        </div> */}
                    </div>
                </div>

                {/* General Complaints Table */}
                {(role == "admin") && (
                    <ComplaintsTable
                        title="General Complaints"
                        icon={CogIcon}
                        complaintType={"general"}
                        complaints={filteredGeneralComplaints}
                        sortField={generalSortField}
                        sortOrder={generalSortOrder}
                        handleSortChange={(field) => handleSortChange(field, "general")}
                        setComplaints={setGeneralComplaintData} // this prop is only passed for receptionist to update the data on frontend
                    />
                )}

                {/* {typeFilter === "All" && <hr className="mb-6"></hr>} */}

                {/* Services Complaints Table */}
                {(role == "receptionist") && (
                    <ComplaintsTable
                        title="Services Complaints"
                        icon={WrenchScrewdriverIcon}
                        complaintType={"services"}
                        complaints={filteredServicesComplaints}
                        sortField={servicesSortField}
                        sortOrder={servicesSortOrder}
                        handleSortChange={(field) => handleSortChange(field, "services")}
                        setComplaints={setServicesComplaintData} //this prop is only passed for receptionist to update the data on frontend

                    />
                )}
            </div>
        </Sidebar>
    );
};

export default Complaints;