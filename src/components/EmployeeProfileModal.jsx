import { UserCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

/**
|--------------------------------------------------
| How to Open this modal on btn click
<button
    className="btn btn-primary"
    onClick={() => document.getElementById('employee_profile').showModal()}
>
    View Profile
</button>

|--------------------------------------------------
*/

const EmployeeProfileModal = ({ employeeProfileSelected }) => {
  return (
    <dialog id="employee_profile" className="modal">
      <div className="modal-box w-10/12 max-w-5xl">
        <div className="grid ring-1 rounded-md p-10 ring-primary grid-cols-3 gap-3">
          <div className="border-r-2 border-primary">
            <div className="avatar">
              {employeeProfileSelected?.photo ? <div className="lg:w-44 max-md:w-20 rounded-full">
                <img src={employeeProfileSelected?.photo} alt="Employee" />
              </div> : <div className="w-24 rounded-full bg-gray-300"> 
                <UserCircleIcon className="h-24 w-24 text-gray-400" />
                </div>}
            </div>
            <h4 className="text-2xl font-bold">
              {employeeProfileSelected?.name}
            </h4>
            <p className="text-md text-gray-500">
              {employeeProfileSelected?.designation}
            </p>
          </div>
          <div className="col-span-2 pl-4 grid grid-cols-2 max-md:grid-cols-1 gap-2">
            <p className="text-md mb-2">
              <strong>CNIC:</strong> {employeeProfileSelected?.cnic}
            </p>
            <p className="text-md mb-2">
              <strong>Date of Birth:</strong> {new Date(employeeProfileSelected?.dob).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-md mb-2">
              <strong>Date of Joining:</strong> {new Date(employeeProfileSelected?.date_joining).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-md mb-2">
              <strong>Contract Type:</strong> {employeeProfileSelected?.employee_type}
            </p>
            <p className="text-md mb-2">
              <strong>Contract Duration:</strong> {employeeProfileSelected?.contract_duration || 'N/A'}
            </p>
            <p className="text-md mb-2">
              <strong>Status Employment:</strong> {employeeProfileSelected?.status_employment ? 'Active' : 'Inactive'}
            </p>
            <p className="text-md mb-2">
              <strong>Email:</strong> {employeeProfileSelected?.email}
            </p>
            <p className="text-md mb-2">
              <strong>Phone:</strong> {employeeProfileSelected?.phone}
            </p>
            <p className="text-md mb-2">
              <strong>Address:</strong> {employeeProfileSelected?.address}
            </p>
          </div>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary text-base-100"
            onClick={() => document.getElementById('employee_profile').close()}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EmployeeProfileModal;