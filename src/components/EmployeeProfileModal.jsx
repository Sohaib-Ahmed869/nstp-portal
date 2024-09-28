import React from 'react'

/**
|--------------------------------------------------
| How to Open this modal on btn click
<button
    className="btn btn-primary"
    document.getElementById('employee_profile').showModal();
    }}
>
    View Profile
</button>

|--------------------------------------------------
*/

const EmployeeProfileModal = ({ employeeProfileSelected }) => {
  return (
    <dialog id="employee_profile" className="modal">
      <div className="modal-box w-10/12 max-w-5xl">
        <div className="grid ring-1 rounded-md p-10 ring-primary  grid-cols-3 gap-3">
          <div className="border-r-2 border-primary">
            <div className="avatar">
              <div className="lg:w-44 max-md:w-20  rounded-full">
                <img src={employeeProfileSelected?.photo} />
              </div>
            </div>
            <h4 className="text-2xl font-bold">
              {employeeProfileSelected?.name}
            </h4>
            <p className="text-md text-gray-500">
              {employeeProfileSelected?.designation}
            </p>
          </div>
          <div className="col-span-2 pl-4 grid grid-cols-2 max-md:grid-cols-1 gap-2 ">
            <p className="text-md mb-2">
              <strong>CNIC:</strong> {employeeProfileSelected?.cnic}
            </p>
            <p className="text-md mb-2">
              <strong>Date of Birth:</strong> {employeeProfileSelected?.dob}
            </p>
            <p className="text-md mb-2">
              <strong>Date of Joining:</strong>{" "}
              {employeeProfileSelected?.date_joining}
            </p>
            <p className="text-md mb-2">
              <strong>Contract Type:</strong>{" "}
              {employeeProfileSelected?.employee_type}
            </p>
            <p className="text-md mb-2">
              <strong>Status Employment:</strong>{" "}
              {employeeProfileSelected?.status_employment
                ? "Active"
                : "Inactive"}
            </p>
            <p className="text-md mb-2">
              <strong>Card Number:</strong>{" "}
              {employeeProfileSelected?.card_num !== undefined
                ? employeeProfileSelected?.card_num
                : employeeProfileSelected?.card.is_requested
                  ? "Awaiting Approval"
                  : "Not Assigned"}
            </p>
            <p className="text-md mb-2">
              <strong>Etags</strong> {employeeProfileSelected?.etags}
            </p>
          </div>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary text-base-100"
            onClick={() =>
              document.getElementById("employee_profile").close()
            }
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default EmployeeProfileModal
