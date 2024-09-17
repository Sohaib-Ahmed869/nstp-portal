import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';

/**
|--------------------------------------------------
| ComplaintsTable Component
| This component displays a table of complaints for tenant and receptionist
| for tenant, the complaintIdToDelete props are not passed
| for receptionist, the mark as completed prop is not passed
| isReceptionist prop should be refactored to use role from context or redux instead
| this component should be refactored to  include the cancellation/deletion logic and modal as well (remove this comment after refactoring)
|--------------------------------------------------
*/
const ComplaintsTable = ({ title, icon: Icon, complaintType, complaints, sortField, sortOrder, handleSortChange, setComplaintIdToDelete, setComplaintTypeToDelete, isReceptionist }) => {
    const [loading, setLoading] = useState(false);
    const [loadingComplaintId, setLoadingComplaintId] = useState(null);
    const [rowsToDisplay, setRowsToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        setRowsToDisplay(complaints.slice(0, rowsPerPage));
    }, [complaints]);

    const markAsCompleted = (id) => {
        setLoading(true);
        setLoadingComplaintId(id);
        setTimeout(() => {
            // Update the complaints state to mark the complaint as resolved
            setRowsToDisplay((prevRows) =>
                prevRows.map((complaint) =>
                    complaint.id === id ? { ...complaint, isResolved: true } : complaint
                )
            );
            setLoading(false);
            setLoadingComplaintId(null);
        }, 2000);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setRowsToDisplay(complaints.slice(startIndex, endIndex));
    };

    const totalPages = Math.ceil(complaints.length / rowsPerPage);

    return (
        <>
            <div className="flex items-center bg-primary bg-opacity-15 p-5 rounded-md my-2">
                <Icon className="size-8 text-primary mr-3" />
                <p className="font-semibold text-xl mr-2">{title}</p>
            </div>
            <div className="h-full min-h-content overflow-y-auto mt-5">
                <p className="my-2 text-gray-500 text-sm">
                    Click on any column header to sort data
                </p>
                <table className="table mt-5 min-h-full rounded-lg mb-9">
                    <thead>
                        <tr className="bg-base-200 cursor-pointer">
                            <th onClick={() => handleSortChange("date")}>Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            {isReceptionist && <th onClick={() => handleSortChange("tenantName")}>Tenant Name {sortField === "tenantName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>}
                            {complaintType === "general" ? (
                                <th onClick={() => handleSortChange("subject")}>
                                    Subject {sortField === "subject" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                </th>
                            ) : (
                                <th onClick={() => handleSortChange("serviceType")}>
                                    Service Type {sortField === "serviceType" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                </th>
                            )}
                            <th>Description</th>
                            <th onClick={() => handleSortChange("isResolved")}>Resolved {sortField === "isResolved" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsToDisplay.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500">No data to show for now.</td>
                            </tr>
                        ) : (
                            rowsToDisplay.map((complaint) => (
                                <tr key={complaint.id}> 
                                    <td>{complaint.date}</td>
                                    {isReceptionist && <td>{complaint.tenantName}</td>}
                                    <td>{complaint.subject || complaint.serviceType}</td>
                                    <td>{complaint.description || " - "}</td>
                                    <td className={`badge ${complaint.isResolved ? "badge-success text-lime-100" : "badge-error text-red-100"} flex items-center mt-3`}>
                                        {complaint.isResolved ? <CheckCircleIcon className="size-6" /> : <XCircleIcon className="size-6" />}
                                        {complaint.isResolved ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        {!complaint.isResolved && (
                                            <>
                                                {isReceptionist ? (
                                                    <button
                                                        className={`btn btn-sm btn-outline btn-success mr-2 ${loading && loadingComplaintId === complaint.id ? "btn-disabled" : ""}`}
                                                        onClick={() => markAsCompleted(complaint.id)}
                                                        disabled={loading && loadingComplaintId === complaint.id}
                                                    >
                                                        {loading && loadingComplaintId === complaint.id ? (
                                                            <>
                                                                <span className="loading loading-spinner"></span>
                                                                Please wait...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckIcon className="size-4" />
                                                                Mark as Complete
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-sm btn-outline btn-error" onClick={() => { setComplaintIdToDelete(complaint.id); setComplaintTypeToDelete(complaintType); document.getElementById('cancel_complaint_modal').showModal() }}>Cancel</button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {complaints.length > rowsPerPage && (
                    <div className="flex justify-between mt-4">
                           
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                             
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ComplaintsTable;