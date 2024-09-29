import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { CheckIcon, ClockIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, PrinterIcon } from '@heroicons/react/24/outline';
import AdminService from '../../services/AdminService';
import { TowerContext } from '../../context/TowerContext';


const EMPTY_FORM_DATA = {
    registration: {
        category: "",
        organizationName: "",
        presentAddress: "",
        website: "",
        companyEmail: "",
    },
    contactInfo: {
        applicantName: "",
        applicantPhone: "",
        applicantEmail: "",
        applicantLandline: "",
    },
    stakeholders: [
        {
            name: "",
            designation: "",
            email: "",
            presentAddress: "",
            nationality: "",
            dualNationality: "",
            profile: "",
            isNustAlumni: false,
            isNustEmployee: false,
        },
    ],
    companyProfile: {
        companyHeadquarters: "",
        yearsInBusiness: "",
        numberOfEmployees: 0,
        registrationNumber: 0,
    },
    industrySector: {
        category: "",
        rentalSpaceSqFt: 0,
        timeFrame: "",
    },
    companyResourceComposition: {
        management: 0,
        engineering: 0,
        marketingAndSales: 0,
        remainingPredominantArea: "",
        areasOfResearch: "",
        nustSchoolToCollab: "",
    },
};

const initialData = [
    {
        id: 1,
        requestedOn: '2023-10-01',
        companyName: 'Hexler Tech',
        companyType: 'Tech',
        companyIndustry: 'Software',
        status: 'Pending',
        details: EMPTY_FORM_DATA,
    },
    // Add more initial data as needed
];

const ApproveOffice = () => {
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState(initialData);
    const itemsPerPage = 10;
    const { tower } = useContext(TowerContext);

    //for assigning new office modal
    const [wing, setWing] = useState('');
    const [floor, setFloor] = useState('');
    const [officeNumber, setOfficeNumber] = useState('');
    const [assignModalLoading, setAssignModalLoading] = useState(false);

    // Simulate API call to fetch data
    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                const response = await AdminService.getOfficeRequests(tower.id);
                console.log('🚀 ~ fetchData ~ response', response);
                if (response.error) {
                    console.error('Error fetching data:', response.error);
                    return;
                }
                // Assuming response.data.tenants is the array of objects you provided
                setData(response.data.tenants);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
    
        fetchData();
    }, []);

    useEffect(() => {
        console.log('Data:', data);
    }, [data]);

    const handleApproveUnapprove = (request, action) => {
        setModalLoading(true);

        async function handleRequest() {
            try {
                const response = await AdminService.assignOffice();
                console.log('🚀 ~ handleRequest ~ response', response)
                if (response.error) {
                    console.error('Error approving request:', response.error);
                    return;
                }
                // remove from data
                setData((prevData) => prevData.filter((item) => item.id !== request.id));
                
            } catch (error) {
                console.error('Error approving request:', error);
            } finally { 
                setModalLoading(false);
                // if (action === 'approve') {
                //     setData((prevData) => prevData.filter((item) => item.id !== request.id));
                // }
                document.getElementById('confirmation_modal').close();
            }
        }

        // setTimeout(() => {
            // setModalLoading(false);
            // if (action === 'approve') {
            //     setData((prevData) => prevData.filter((item) => item.id !== request.id));
            // }
            // document.getElementById('confirmation_modal').close();
        // }, 1000);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const filteredData = data
        .filter((item) => {
            if (filter !== 'All' && item.status !== filter) return false;
            if (searchQuery && !item.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (!sortField) return 0;
            const fieldA = a[sortField];
            const fieldB = b[sortField];
            if (sortOrder === 'asc') return fieldA > fieldB ? 1 : -1;
            return fieldA < fieldB ? 1 : -1;
        });

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const showDetails = (request) => {
        console.log('Showing details for request:', request);
        setCurrentRequest(request);
        document.getElementById('details_modal').showModal();
    };

    const handleAssignOffice = async (e, requestId) => {
        e.preventDefault();
        setAssignModalLoading(true);
        console.log(`Assigning office to request ID: ${requestId}`);
        try {
            const response = await AdminService.assignOffice(tower.id, requestId, { floor, wing, officeNumber });
            console.log('🚀 ~ handleAssignOffice ~ response', response)

            if (response.error) {
                console.error('Error assigning office:', response.error);
                return;
            }

        } catch (error) {
            console.error('Error assigning office:', error);
        } finally {
            setAssignModalLoading(false);
            document.getElementById('assign_office_modal').close();
        }
    };

    return (
        <Sidebar>
            {/* Confirmation Modal */}
            <dialog id="confirmation_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{currentRequest?.action === 'approve' ? 'Approve Request' : 'Unapprove Request'}</h3>
                    <p className="text-sm text-gray-500">
                        Are you sure you want to {currentRequest?.action} this request?
                    </p>
                    <div className="modal-action">
                        <button className="btn mr-1" onClick={() => document.getElementById('confirmation_modal').close()}>Cancel</button>
                        <button
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={() => handleApproveUnapprove(currentRequest.request, currentRequest.action)}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "OK"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Assign Office Modal */}
            <dialog id="assign_office_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Assign Office to Employee</h3>
                    <form onSubmit={(e) => handleAssignOffice(e, currentRequest.request._id)}>
                        <FloatingLabelInput
                            name="floor"
                            type="text"
                            id="floor"
                            label="Floor"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                        />
                        <FloatingLabelInput
                            name="wing"
                            type="text"
                            id="wing"
                            label="Wing"
                            value={wing}
                            onChange={(e) => setWing(e.target.value)}
                        />
                        <FloatingLabelInput
                            name="officeNumber"
                            type="text"
                            id="officeNumber"
                            label="Office Number"
                            value={officeNumber}
                            onChange={(e) => setOfficeNumber(e.target.value)}
                        />
                        <div className="modal-action">
                            <button type="button" className="btn mr-1" onClick={() => document.getElementById('assign_office_modal').close()}>Cancel</button>
                            <button type="submit" className={`btn btn-primary text-base-100 ${assignModalLoading && "btn-disabled"}`}>
                                {assignModalLoading && <span className="loading loading-spinner"></span>} {assignModalLoading ? "Please wait..." : "Assign"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Details Modal */}
            <dialog id="details_modal" className="modal">
                <div className="modal-box w-10/12 max-w-5xl">
                    <h3 className="font-bold text-lg">Request Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Registration Section */}
                        <div className="border border-primary rounded-2xl p-7">
                            <h4 className="font-bold text-md mb-2 text-primary">Registration</h4>
                            <p><strong>Category:</strong> {currentRequest?.registration?.category}</p>
                            <p><strong>Organization Name:</strong> {currentRequest?.registration?.organizationName}</p>
                            <p><strong>Present Address:</strong> {currentRequest?.registration?.presentAddress}</p>
                            <p><strong>Website:</strong> {currentRequest?.registration?.website}</p>
                            <p><strong>Company Email:</strong> {currentRequest?.registration?.companyEmail}</p>
                        </div>

                        {/* Contact Info Section */}
                        <div className="border border-primary rounded-2xl p-7">
                            <h4 className="font-bold text-md mb-2 text-primary">Contact Info</h4>
                            <p><strong>Applicant Name:</strong> {currentRequest?.contactInfo?.applicantName}</p>
                            <p><strong>Applicant Phone:</strong> {currentRequest?.contactInfo?.applicantPhone}</p>
                            <p><strong>Applicant Email:</strong> {currentRequest?.contactInfo?.applicantEmail}</p>
                            <p><strong>Applicant Landline:</strong> {currentRequest?.contactInfo?.applicantLandline}</p>
                        </div>

                        {/* Stakeholders Section */}
                        <div className="border border-primary rounded-2xl p-7">
                            <h4 className="font-bold text-md mb-2 text-primary">Stakeholders</h4>
                            {currentRequest?.stakeholders?.map((stakeholder, index) => (
                                <div key={index} className="mb-4">
                                    <p><strong>Name:</strong> {stakeholder.name}</p>
                                    <p><strong>Designation:</strong> {stakeholder.designation}</p>
                                    <p><strong>Email:</strong> {stakeholder.email}</p>
                                    <p><strong>Present Address:</strong> {stakeholder.presentAddress}</p>
                                    <p><strong>Nationality:</strong> {stakeholder.nationality}</p>
                                    <p><strong>Dual Nationality:</strong> {stakeholder.dualNationality}</p>
                                    <p><strong>Profile:</strong> {stakeholder.profile}</p>
                                    <p><strong>Is NUST Alumni:</strong> {stakeholder.isNustAlumni ? 'Yes' : 'No'}</p>
                                    <p><strong>Is NUST Employee:</strong> {stakeholder.isNustEmployee ? 'Yes' : 'No'}</p>
                                </div>
                            ))}
                        </div>

                        {/* Company Profile Section */}
                        <div className="border border-primary rounded-2xl p-7">
                            <h4 className="font-bold text-md mb-2 text-primary">Company Profile</h4>
                            <p><strong>Company Headquarters:</strong> {currentRequest?.companyProfile?.companyHeadquarters}</p>
                            <p><strong>Years in Business:</strong> {currentRequest?.companyProfile?.yearsInBusiness}</p>
                            <p><strong>Number of Employees:</strong> {currentRequest?.companyProfile?.numberOfEmployees}</p>
                            <p><strong>Registration Number:</strong> {currentRequest?.companyProfile?.registrationNumber}</p>
                        </div>

                        {/* Industry Sector Section */}
                        <div className="border border-primary rounded-2xl p-7">
                            <h4 className="font-bold text-md mb-2 text-primary">Industry Sector</h4>
                            <p><strong>Category:</strong> {currentRequest?.industrySector?.category}</p>
                            <p><strong>Rental Space (Sq Ft):</strong> {currentRequest?.industrySector?.rentalSpaceSqFt}</p>
                            <p><strong>Time Frame:</strong> {currentRequest?.industrySector?.timeFrame}</p>
                        </div>

                        {/* Company Resource Composition Section */}
                        <div className="border border-primary rounded-2xl p-7">
                            <h4 className="font-bold text-md mb-2 text-primary">Company Resource Composition</h4>
                            <p><strong>Management:</strong> {currentRequest?.companyResourceComposition?.management}</p>
                            <p><strong>Engineering:</strong> {currentRequest?.companyResourceComposition?.engineering}</p>
                            <p><strong>Marketing and Sales:</strong> {currentRequest?.companyResourceComposition?.marketingAndSales}</p>
                            <p><strong>Remaining Predominant Area:</strong> {currentRequest?.companyResourceComposition?.remainingPredominantArea}</p>
                            <p><strong>Areas of Research:</strong> {currentRequest?.companyResourceComposition?.areasOfResearch}</p>
                            <p><strong>NUST School to Collaborate:</strong> {currentRequest?.companyResourceComposition?.nustSchoolToCollab}</p>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('details_modal').close()}>Close</button>
                    </div>
                </div>
            </dialog>

            {/* Loading spinner */}
            {loading && <NSTPLoader />}

            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Office Requests</h1>
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
                    {/* <div className="w-full md:w-4/12 flex items-center justify-end">
                        <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                        <select value={filter} onChange={handleFilterChange} className="select select-bordered w-full md:max-w-xs max-sm:mt-2">
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Issued">Issued</option>
                        </select>
                    </div> */}
                </div>

                {filteredData.length === 0 ? (
                    <p className="text-gray-500 mt-10">No data to show for now.</p>
                ) : (
                    <div className="h-full min-h-content overflow-y-auto">
                        <p className="my-2 text-gray-500 text-sm">Click on any column header to sort data</p>
                        <table className="table mt-5 min-h-full rounded-lg mb-9">
                            <thead>
                                <tr className="bg-base-200 cursor-pointer">
                                    {['requestedOn', 'companyName', 'companyType', 'companyIndustry', 'status'].map((field) => (
                                        <th key={field} onClick={() => handleSortChange(field)}>
                                            {sortField === field ? (sortOrder === 'asc' ? '▲' : '▼') : ''} {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </th>
                                    ))}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((request) => (
                                    <tr id={`request-row-${request._id}`} key={request._id} className="relative group">
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td>{request.registration?.organizationName || 'N/A'}</td>
                                        <td>{request.registration?.category || 'N/A'}</td>
                                        <td>{request.industrySector?.category || 'N/A'}</td>
                                        <td>
                                            <div className={`badge p-3 ${request.statusTenancy ? "badge-success text-lime-100" : "badge-accent text-white"} text-sm mt-2`}>
                                                {request.statusTenancy ? <CheckIcon className="size-4 mr-2" /> : <ClockIcon className="size-4 mr-2" />} {request.statusTenancy ? 'Issued' : 'Pending'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {!request.statusTenancy && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-outline btn-success"
                                                            onClick={() => {
                                                                setCurrentRequest({ request, action: 'approve' });
                                                                document.getElementById('assign_office_modal').showModal();
                                                            }}
                                                        >
                                                            Approve
                                                        </button>
                                                    </>
                                                )}
                                                <button className="btn btn-sm btn-outline btn-primary" onClick={() => showDetails(request)}>
                                                    Show Details
                                                </button>
                                            </div>
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

export default ApproveOffice;