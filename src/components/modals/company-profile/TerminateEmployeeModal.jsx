import React from 'react'
import showToast from '../../../util/toast';
import { AdminService } from '../../../services';

const TerminateEmployeeModal = ({ selectedEmployee }) => {

    const terminateEmployee = async (employeeId) => {
        // add loading state
        console.log(`Terminating employee with ID: ${employeeId}`);
        try {
            const response = await AdminService.terminateEmployee(employeeId);
            if (response.error) {
                console.error("Error terminating employee:", response);
                showToast(false, response.error.message);
                return;
            }
            showToast(true, "Employee terminated successfully.");
        } catch (error) {
            console.error("Error terminating employee:", error);
            showToast(false, "An error occurred while terminating employee.");
        } finally {
            // remove loading state
        }
    };

    return (
        <dialog id="terminate-modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Terminate Employee</h3>
                <p className="py-4">Are you sure you want to terminate the employee, {selectedEmployee?.name}?</p>
                <div className="modal-action">
                    <button className="btn" onClick={() => document.getElementById('terminate-modal').close()}>Cancel</button>
                    <button
                        className="btn btn-error text-base-100"
                        onClick={() => {
                            terminateEmployee(selectedEmployee._id);
                            document.getElementById('terminate-modal').close();
                        }}
                    >
                        Confirm Termination
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default TerminateEmployeeModal
