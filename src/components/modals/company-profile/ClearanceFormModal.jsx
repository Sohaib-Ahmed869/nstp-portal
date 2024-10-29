import React, { useState } from 'react'
import FloatingLabelInput from '../../FloatingLabelInput';
import { TenantService } from '../../../services';
import showToast from '../../../util/toast';

const ClearanceFormModal = () => {
    const [modalLoading, setModalLoading] = useState(false);
    const [formData, setFormData] = useState({
        applicantName: '',
        applicantDesignation: '',
        applicantCnic: '',
        officeNumber: '',
        vacatingDate: '',
        reasonForLeaving: ''
    });

    const submitClearanceForm = async () => {
        setModalLoading(true);

        try {
            const response = await TenantService.initiateClearanceForm(formData);
            console.log("Response:", response);
            if (response.error) {
                console.error("Error submitting clearance form:", response.error);
                showToast(false, response.error);
                return;
            }
            console.log("Clearance form submitted successfully:", response.data.clearance);
            showToast(true, response.message);
        } catch (error) {
            console.error("Error submitting clearance form:", error);
            showToast(false, "An error occurred while submitting clearance form.");
        } finally {
            setModalLoading(false);
            document.getElementById('tenure-end-modal').close();
        }
    };

    //handle change for clearnace form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <dialog id="tenure-end-modal" className="modal">
            <div className="modal-box min-w-3xl max-w-3xl">
                <h3 className="font-bold text-lg mb-3">Clearance Form</h3>
                <form className='grid grid-cols-2 gap-3'>
                    <FloatingLabelInput
                        name="applicantName"
                        type="text"
                        id="applicantName"
                        label="Applicant Name"
                        value={formData.applicantName}
                        onChange={handleInputChange}
                    />
                    <FloatingLabelInput
                        name="applicantDesignation"
                        type="text"
                        id="applicantDesignation"
                        label="Applicant Designation"
                        value={formData.applicantDesignation}
                        onChange={handleInputChange}
                    />
                    <FloatingLabelInput
                        name="applicantCnic"
                        type="text"
                        id="applicantCnic"
                        label="Applicant CNIC"
                        value={formData.applicantCnic}
                        onChange={handleInputChange}
                    />
                    <FloatingLabelInput
                        name="officeNumber"
                        type="text"
                        id="officeNumber"
                        label="Office Number"
                        value={formData.officeNumber}
                        onChange={handleInputChange}
                    />
                    <FloatingLabelInput
                        name="vacatingDate"
                        type="date"
                        id="vacatingDate"
                        label="Date for Vacating Office"
                        value={formData.vacatingDate}
                        onChange={handleInputChange}
                    />
                    <div className="col-span-2">
                        <FloatingLabelInput
                            name="reasonForLeaving"
                            type="textarea"
                            id="reasonForLeaving"
                            label="Reason for Leaving"
                            value={formData.reasonForLeaving}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div role="alert" className="col-span-2 alert bg-yellow-300 bg-opacity-40 text-yellow-900">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Warning: This is a serious action. Proceed with caution!</span>
                    </div>
                </form>
                <div className="modal-action">
                    <button className="btn" onClick={() => document.getElementById('tenure-end-modal').close()}>Cancel</button>
                    <button
                        className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                        onClick={(e) => {
                            e.preventDefault();
                            submitClearanceForm();
                        }}
                    >
                        {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default ClearanceFormModal
