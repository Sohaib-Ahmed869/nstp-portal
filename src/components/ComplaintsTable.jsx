import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ComplaintsTable = ({ title, icon: Icon, complaintType, complaints, sortField, sortOrder, handleSortChange, setComplaintIdToDelete, setComplaintTypeToDelete }) => {
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
                            <th onClick={() => {complaintType == "general" && handleSortChange("subject")}}> {complaintType == "general" ? "Subject" : "Service Type"} {sortField === "subject" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th>Description</th>
                            <th onClick={() => handleSortChange("isResolved")}>Resolved {sortField === "isResolved" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500">No data to show for now.</td>
                            </tr>
                        ) : (
                            complaints.map((complaint) => (
                                <tr key={complaint.id}> 
                                    <td>{complaint.date}</td>
                                    <td>{complaint.subject || complaint.serviceType}</td>
                                    <td>{complaint.description || " - "}</td>
                                    <td className={`badge ${complaint.isResolved ? "badge-success text-lime-100" : "badge-error text-red-100"} flex items-center mt-3`}>
                                        {complaint.isResolved ? <CheckCircleIcon className="size-6" /> : <XCircleIcon className="size-6" />}
                                        {complaint.isResolved ? "Yes" : "No"}
                                    </td>
                                    <td>
                                        {!complaint.isResolved && (
                                            <button className="btn btn-sm btn-outline btn-error" onClick={() => {setComplaintIdToDelete(complaint.id); setComplaintTypeToDelete(complaintType); document.getElementById('cancel_complaint_modal').showModal()}}>Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ComplaintsTable;