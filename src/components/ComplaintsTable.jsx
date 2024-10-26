import React, { useState, useEffect, useContext } from 'react';
import { ChatBubbleLeftEllipsisIcon, CheckCircleIcon, CheckIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AdminService, ReceptionistService, TenantService } from '../services';
import showToast from '../util/toast';
import { AuthContext } from '../context/AuthContext';
import { formatDate, isWithin72Hours } from '../util/date';
import { truncateText, getUrgencyLabel } from '../util/util';
import ConfirmationModal from './modals/ConfirmationModal';
import ChatPopup from './ChatPopup';

/**
|--------------------------------------------------
| ComplaintsTable Component
| This component displays a table of complaints for tenant and receptionist
| for tenant, the complaintIdToDelete props are not passed
| for receptionist, the mark as completed prop is not passed
| this component should be refactored to  include the cancellation/deletion logic and modal as well (remove this comment after refactoring)
|--------------------------------------------------
*/


const ComplaintsTable = ({ title, icon: Icon, complaintType, complaints, sortField, sortOrder, handleSortChange, setComplaintIdToDelete, setComplaintTypeToDelete, dialogId }) => {
    const [loading, setLoading] = useState(false);
    const [loadingComplaintId, setLoadingComplaintId] = useState(null);
    const [rowsToDisplay, setRowsToDisplay] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [complaintSelectedForChat, setComplaintSelectedForChat] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const { role } = useContext(AuthContext);
    const rowsPerPage = 5;

    useEffect(() => {
        setRowsToDisplay(complaints.slice(0, rowsPerPage));
        console.log("Complaints table data ", complaints)
    }, [complaints]);

    const markAsCompleted = async (id) => {
        setLoading(true);
        setLoadingComplaintId(id);

        if (role == "admin") { //means he is an admin, marking general complaint as complete.
            try {
                const response = await AdminService.handleComplaint(id, true);
                if (response.error) {
                    showToast(false, response.error);
                    return;
                }

                showToast(true, response.message);
                setRowsToDisplay((prevRows) =>
                    prevRows.map((complaint) =>
                        complaint.id === id ? { ...complaint, isResolved: true, dateResolved: formatDate(response.data.complaint.date_resolved) } : complaint
                    )
                );

            } catch (error) {
                console.error(error);
                showToast(false, "An error occurred. Please try again later.");
            } finally {
                setLoading(false);
                setLoadingComplaintId(null);
            }
        } else if (role == "receptionist") { //means he is a receptionist, marking service complaint as complete.
            try {
                const response = await ReceptionistService.handleComplaint(id, true);
                if (response.error) {
                    showToast(false, response.error);
                    return;
                }

                showToast(true, response.message);
                setRowsToDisplay((prevRows) =>
                    prevRows.map((complaint) =>
                        complaint.id === id ? { ...complaint, isResolved: true, dateResolved: formatDate(response.data.complaint.date_resolved) } : complaint
                    )
                );

            } catch (error) {
                console.error(error);
                showToast(false, "An error occurred. Please try again later.");
            } finally {
                setLoading(false);
                setLoadingComplaintId(null);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setRowsToDisplay(complaints.slice(startIndex, endIndex));
    };

    const totalPages = Math.ceil(complaints.length / rowsPerPage);

    const getTenantName = (id) => {
        const c = complaints.find(complaint => complaint.id === id);
        if (!c) return "";
        return c.tenantName?.registration?.organizationName || c.tenantName;
    };

    const handleReOpenComplaint = async () => {
        setModalLoading(true);
        try {
            const response = await TenantService.reOpenComplaint(complaintSelectedForChat.id);
            if (response.error) {
                showToast(false, response.error);
                return;
            }

            // Update the row status immediately
            setRowsToDisplay(
                rowsToDisplay.map((complaint) =>
                    complaint.id === complaintSelectedForChat?.id ? {
                        ...complaint,
                        isResolved: false,
                        dateResolved: " - ",
                        status: "pending",
                        chatHistory: complaintSelectedForChat.chatHistory?.length > 0 ? complaintSelectedForChat.chatHistory : []
                    } : complaint
                ).slice(0, rowsPerPage)
            );

            showToast(true, response.message);
            setShowChat(true);
        } catch (error) {
            console.error(error);
            showToast(false, "An error occurred. Please try again later.");
        } finally {
            setModalLoading(false);
            document.getElementById(`confirm-re-open-complaint-modal-${complaintType}`).close();
        }


        // document.getElementById(`confirm-re-open-complaint-modal-${complaintType}`).close();

        // // Update the row status immediately
        // setRowsToDisplay(
        //     rowsToDisplay.map((complaint) =>
        //         complaint.id === complaintSelectedForChat?.id ? {
        //             ...complaint,
        //             isResolved: false,
        //             dateResolved: " - "
        //         } : complaint
        //     ).slice(0, rowsPerPage)
        // );

        // // Show chat popup
        // setShowChat(true);
    };


    return (
        <>
            <ConfirmationModal
                id={`confirm-re-open-complaint-modal-${complaintType}`}
                title="Re-Open Complaint"
                message="Are you sure you want to re-open this complaint? This action will revert the complaint to the pending status, and the respective staff will be notified. You will have to initiate a chat."
                onConfirm={handleReOpenComplaint}
                modalLoading={modalLoading}
            />

            {/** Displaying complaint details modal */}
            <dialog id={dialogId} className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                        <ChatBubbleLeftEllipsisIcon className="size-6" /> Complaint Details
                    </h3>
                    <hr className="my-5 text-gray-200" />
                    {selectedComplaintId && (
                        <div>
                            <p className="mt-3 text-2xl"><strong className="text-primary">Subject:</strong> {complaints.find(complaint => complaint.id === selectedComplaintId).subject || complaints.find(complaint => complaint.id === selectedComplaintId).serviceType}</p>
                            {role !== "tenant" && <p className="mt-3"><strong className="text-primary">From: </strong> {getTenantName(selectedComplaintId)}</p>}
                            <p className="mt-3"><strong className="text-primary">Description:</strong> {complaints.find(complaint => complaint.id === selectedComplaintId).description || "N/A"}</p>
                            <p className="mt-3"><strong className="text-primary">Urgency:</strong> {getUrgencyLabel(complaints.find(complaint => complaint.id === selectedComplaintId).urgency)}</p>
                            <p className="mt-3"><strong className="text-primary">Status:</strong> {complaints.find(complaint => complaint.id === selectedComplaintId).isResolved ? "Resolved" : "Pending"}</p>
                            <p className="mt-3"><strong className="text-primary">Date Initiated:</strong> {complaints.find(complaint => complaint.id === selectedComplaintId).date}</p>
                            <p className="mt-3"><strong className="text-primary">Resolved Date:</strong> {complaints.find(complaint => complaint.id === selectedComplaintId).dateResolved || "N/A"}</p>
                        </div>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById(dialogId).close()}>Close</button>
                    </div>
                </div>
            </dialog>

            {/* Chat popup for viewing chat history of re-opened complaints */}
            {showChat && (
                <ChatPopup
                    onClose={() => setShowChat(false)}
                    complaintType={complaintType}
                    complaintSelectedForChat={complaintSelectedForChat}
                    setComplaintSelectedForChat={setComplaintSelectedForChat}
                    complaintId={complaintSelectedForChat.id}
                />
            )}

            {/* Main table title */}
            <div className="flex items-center bg-primary bg-opacity-15 p-5 rounded-md my-2">
                <Icon className="size-8 text-primary mr-3" />
                <p className="font-semibold text-xl mr-2">{title}</p>
            </div>

            {/* Table container */}
            <div className="h-full min-h-content overflow-y-auto mt-5">
                {/* Info */}
                <p className="my-2 text-gray-500 text-sm">
                    Click on any column header to sort data
                </p>

                {/* Table */}
                <table className="table mt-5 min-h-full rounded-lg mb-9">
                    <thead>
                        <tr className="bg-base-200 cursor-pointer">
                            <th onClick={() => handleSortChange("date")}>Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            <th onClick={() => handleSortChange("resolvedDate")}>Resolved Date {sortField === "resolvedDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            {complaintType == "services" &&
                                <th onClick={() => handleSortChange("urgency")}>Urgency {sortField === "urgency" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                            }
                            {role != "tenant" && <th onClick={() => handleSortChange("tenantName")}>Tenant Name {sortField === "tenantName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>}
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
                                <td colSpan="6" className=" text-gray-500 py-7">No data to show for now.</td>
                            </tr>
                        ) : (
                            rowsToDisplay.map((complaint) => (
                                <tr key={complaint.id}>
                                    <td>{complaint.date}</td>
                                    <td>{complaint.dateResolved}</td>
                                    {
                                        complaintType == "services" && (
                                            <td className="">
                                                <div className={`badge text-base-100 ${complaint.urgency === 1 ? "badge-primary" : complaint.urgency === 2 ? "badge-secondary" : "badge-error"} flex items-center py-3`} >
                                                    {complaint.urgency === 1 ? "Low" : complaint.urgency === 2 ? "Med" : "High"}
                                                </div>
                                            </td>
                                        )
                                    }
                                    {role == "admin" ? <td>{complaint?.tenantName?.registration?.organizationName}</td> : role == "receptionist" ? <td>{complaint?.tenantName}</td> : null}
                                    <td>{complaint.subject ? truncateText(complaint.subject, 25) : complaint.serviceType}</td>
                                    <td>{truncateText(complaint.description || " - ", 60)}</td>
                                    <td >
                                        <div className={`badge ${complaint.isResolved ? "badge-success text-lime-100" : "badge-accent text-red-100"} flex items-center p-3 gap-2`}>
                                            {complaint.isResolved ? <CheckCircleIcon className="size-6" /> : <ClockIcon className="size-6" />}
                                            {complaint.isResolved ? "Resolved" : "Pending"}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex items-center gap-2">

                                            <button className="btn btn-sm btn-outline btn-secondary" onClick={() => { setSelectedComplaintId(complaint.id); document.getElementById(dialogId).showModal(); }}>
                                                View Detail
                                            </button>


                                            {!complaint.isResolved && (
                                                <>
                                                    {role != "tenant" ? ( //receptionist and admin can mark their respective complaints as complete
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
                                                                    Mark Resolved
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline btn-error" onClick={() => { setComplaintIdToDelete(complaint.id); setComplaintTypeToDelete(complaintType); document.getElementById('cancel_complaint_modal').showModal() }}>Cancel</button>
                                                    )}
                                                </>
                                            )}

                                            {(complaint.isResolved && role == "tenant" && isWithin72Hours(complaint.dateResolved)) && (
                                                <button
                                                    className="btn btn-sm btn-outline btn-primary"
                                                    onClick={() => {
                                                        console.log("complaint selected for chat", complaint);
                                                        setComplaintSelectedForChat({ ...complaint, isResolved: false, dateResolved: null });
                                                        document.getElementById(`confirm-re-open-complaint-modal-${complaintType}`).showModal();
                                                    }}
                                                >
                                                    Re-Open
                                                </button>
                                            )}

                                            {(complaint.chatHistory) && (
                                                <button
                                                    className="btn btn-sm btn-outline btn-primary"
                                                    onClick={() => {
                                                        setComplaintSelectedForChat(complaint);
                                                        setShowChat(true);
                                                    }}
                                                >
                                                    View Chat
                                                </button>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {complaints.length > rowsPerPage && (
                    <div className="flex justify-between items-center my-4">
                        <button
                            className="btn btn-outline"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <div className="flex flex-col items-center justify-center">
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                        </div>
                        <button
                            className="btn btn-outline"
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