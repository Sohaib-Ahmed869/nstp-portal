import React, { useState } from 'react'
import showToast from '../../../util/toast';
import { TenantService } from '../../../services';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ChangePasswordModal = () => {
    const [modalLoading, setModalLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordVisibility, setPasswordVisibility] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field]
        }));
    };

    //password handling
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const changePassword = async (e) => {
        e.preventDefault();
        console.log(passwordData);
        // check empty fields and if new password matches confirm password
        if (passwordData.currentPassword.trim() === '' || passwordData.newPassword.trim() === '' || passwordData.confirmPassword.trim() === '') {
            showToast(false, "All fields are required.");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast(false, "New password and confirm password do not match.");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            showToast(false, "Password must be at least 8 characters long.");
            return;
        }
        if (passwordData.newPassword === passwordData.currentPassword) {
            showToast(false, "New password must be different from current password.");
            return;
        }
        //api call here to change 
        setModalLoading(true);

        try {
            const response = await TenantService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
            if (response.error) {
                console.error("Error changing password:", response.error);
                showToast(false, response.error);
                return;
            }

            console.log("Password changed successfully:", response.message);
            showToast(true, response.message);
        } catch (error) {
            console.error("Error changing password:", error);
            showToast(false, "An error occurred while changing password.");
        } finally {
            // Clear the fields
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordVisibility({
                currentPassword: false,
                newPassword: false,
                confirmPassword: false
            });
            // Close the modal
            document.getElementById('change-password-modal').close();
            setModalLoading(false);
        }

        // // Clear the fields
        // setPasswordData({
        //   currentPassword: '',
        //   newPassword: '',
        //   confirmPassword: ''
        // });
        // // Close the modal
        // document.getElementById('change-password-modal').close();
        // showToast(true, "Password changed successfully.");
        // setModalLoading(false);
    };
    const handleCancelPassword = () => {
        // Clear the fields
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setPasswordVisibility({
            currentPassword: false,
            newPassword: false,
            confirmPassword: false
        })
        // Close the modal
        document.getElementById('change-password-modal').close();
    };

    return (
        <dialog id="change-password-modal" className="modal">
            <form method="dialog" className="modal-box" onSubmit={changePassword}>
                <div className="flex items-center">
                    <LockClosedIcon className="size-8 mr-2 text-primary" />
                    <h3 className="font-bold text-lg">Change Password</h3>
                </div>
                <p>When your account is first created, your initial password is <strong>nstptenant</strong> </p>
                <div className="py-4">
                    <div className="relative mb-4">
                        <input
                            type={passwordVisibility.currentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordInputChange}
                            className="input input-bordered w-full"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('currentPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                            {passwordVisibility.currentPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type={passwordVisibility.newPassword ? 'text' : 'password'}
                            name="newPassword"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInputChange}
                            className="input input-bordered w-full"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('newPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                            {passwordVisibility.newPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            className="input input-bordered w-full"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                            {passwordVisibility.confirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="modal-action">
                    <button type="button" className="btn" onClick={handleCancelPassword}>Cancel</button>
                    <button type="submit" className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}> {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}</button>
                </div>
            </form>
        </dialog>
    )
}

export default ChangePasswordModal
