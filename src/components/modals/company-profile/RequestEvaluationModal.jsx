import React, { useState } from 'react'
import showToast from '../../../util/toast';
import { AdminService } from '../../../services';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';

const RequestEvaluationModal = () => {
    const [deadline, setDeadline] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const today = new Date();
    today.setDate(today.getDate() + 1); // Minimum date is 1 day after the current date
    const minDate = today.toISOString().split('T')[0];

    const { companyId } = useParams();

    const sendFeedback = async () => {
        setModalLoading(true);
        // const deadline = new Date("2024-10-10T09:00:00.000Z");
        console.log("Deadline:", deadline);
        //deadline gona be in the format, 11:59 of the same date
        try {
            const response = await AdminService.requestEvaluation(companyId, deadline + "T23:59:00.000Z");
            if (response.error) {
                console.error("Error requesting evaluation:", response.error);
                showToast(false, response.error);
                return;
            }
            console.log("Evaluation requested successfully:", response.message);
            showToast(true, response.message);

        } catch (error) {
            console.error("Error sending feedback:", error);
            showToast(false, "An error occurred while sending feedback.");
        } finally {
            setModalLoading(false);
            document.getElementById('evaluation-feedback-modal').close();
        }
    }

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const selectedDateObj = new Date(selectedDate);
        const minDateObj = new Date(minDate);

        if (selectedDateObj < minDateObj) {
            setErrorMessage('The deadline must be at least 1 day after the current date.');
            setDeadline(null);
        } else {
            setErrorMessage('');
            setDeadline(selectedDate);
        }
    };


    return (
        <dialog id="evaluation-feedback-modal" className="modal">
            <div className="modal-box">
                <div className="flex items-center gap-2 mb-3">
                    <ChatBubbleOvalLeftEllipsisIcon className="size-8 text-primary" />
                    <h3 className="font-bold text-xl">Request Evaluation/Feedback</h3>
                </div>
                <p className="pb-4">Please enter deadline date and press confirm. The deadline will be 23:59 of the entered date.</p>
                <div className="flex gap-2 my-3 items-center">
                    <p className="text-base font-bold">Deadline</p>
                    <input
                        type="date"
                        placeholder="Deadline"
                        className="input input-bordered w-full"
                        value={deadline || ''}
                        onChange={handleDateChange}
                        min={minDate}
                    />
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <div className="modal-action">
                    <button className="btn" onClick={() => document.getElementById('evaluation-feedback-modal').close()}>Cancel</button>
                    <button className={`btn btn-primary ${modalLoading || errorMessage ? "btn-disabled" : ""}`} onClick={sendFeedback} disabled={modalLoading || errorMessage}>
                        {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Confirm"}
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default RequestEvaluationModal
