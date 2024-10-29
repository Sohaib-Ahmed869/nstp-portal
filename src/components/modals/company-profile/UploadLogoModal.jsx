import React, { useState, useRef } from 'react'
import { ArrowUpTrayIcon, CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import showToast from '../../../util/toast';

import { AdminService } from '../../../services';
import { useParams } from 'react-router-dom';

const UploadLogoModal = ({ setCompanyData }) => {
    const { companyId } = useParams();
    const [modalLoading, setModalLoading] = useState(false);
    //states for uploading logo
    const [logoToUpload, setLogoToUpload] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const maxSizeInMB = 2; // 2 MB
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file && file.size > maxSizeInBytes) {
            setErrorMessage(`File size is above ${maxSizeInMB} MB. Please select a smaller file.`);
            setLogoToUpload(null);
        } else {
            setErrorMessage('');
            setLogoToUpload(file);
        }
    };

    const uploadCompanyLogo = async () => {
        if (!logoToUpload) {
            showToast(false, "Please select a file to upload.");
            return;
        }

        setModalLoading(true);
        const formData = new FormData();
        formData.append('logo', logoToUpload);
        formData.append('tenantId', companyId);

        try {
            const response = await AdminService.uploadTenantLogo(formData);
            if (response.error) {
                console.log(response.error)
                showToast(false, response.error);
                return;
            }

            console.log("Logo uploaded successfully:", response.message);
            console.log(response.data.imageUrl)

            setCompanyData((prevData) => ({
                ...prevData,
                logo: response.data.imageUrl
            }));

            document.getElementById('upload-logo-modal').close();
            showToast(true, response.message);

        } catch (error) {
            console.error("Error uploading logo:", error);
            showToast(false, "An error occurred while uploading logo.");
        } finally {
            setModalLoading(false);
        }
    };



    return (
        <dialog id="upload-logo-modal" className="modal">
            <div className="modal-box">
                <div className="flex flex-col gap-5">
                    <h3 className="font-bold text-lg flex items-center">
                        <ArrowUpTrayIcon className="size-8 text-primary mr-2" />
                        Upload Company Logo
                    </h3>
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered"
                        id="logo-upload"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    {errorMessage && <p className="text-red-900 bg-red-300 p-3 rounded-xl flex gap-2 items-center"> <ExclamationTriangleIcon className="size-5" /> {errorMessage}</p>}
                    {logoToUpload && !errorMessage && (<p className="text-lime-900 bg-lime-200 p-3 rounded-xl flex gap-2 items-center"> <CheckBadgeIcon className="size-5" /> File selected is under 2MB.</p>)}
                </div>
                <div className="modal-action">
                    <button
                        className="btn"
                        onClick={() => {
                            setLogoToUpload(null);
                            setErrorMessage('');
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ''; // Reset the file input value
                            }
                            document.getElementById('upload-logo-modal').close();
                        }}
                    >
                        Cancel
                    </button>

                    <button className={`btn btn-primary ${(errorMessage || modalLoading) && "btn-disabled"}`} onClick={uploadCompanyLogo}>
                        {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Upload"}
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default UploadLogoModal
