import React, { useEffect, useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput";
import TenantService from "../../services/TenantService";

const EditEmployeeProfileModal = ({
  employeeProfileSelected,
  setEmployeeTableData,
}) => {
  const [modalLoading, setModalLoading] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [showContractDuration, setShowContractDuration] = useState(false);
  const [showInternType, setShowInternType] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  useEffect(() => {
    if (employeeProfileSelected) {
      setEditedProfile({ ...employeeProfileSelected });
      setShowContractDuration(
        employeeProfileSelected.employee_type === "Contract"
      );
      setShowInternType(employeeProfileSelected.employee_type === "Intern");
    }
  }, [employeeProfileSelected]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeTypeChange = (e) => {
    const value = e.target.value;
    setEditedProfile((prev) => ({
      ...prev,
      employee_type: value,
    }));
    setShowContractDuration(value === "Contract");
    setShowInternType(value === "Intern");
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      setFileSelected(true);
    } else {
      setFileSelected(false);
    }
  };

  const handleSubmit = () => {
    setModalLoading(true);

    console.log(editedProfile);
    TenantService.updateEmployee(editedProfile._id, editedProfile)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          //   updateEmployeeTableData();
        }
        // setEmployeeTableData((prevData) =>
        //   prevData.map((employee) =>
        //     employee._id === editedProfile._id ? editedProfile : employee
        //   )
        // );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setModalLoading(false);
        document.getElementById("edit_employee_profile_modal").close();
      });
  };

  const formFields = [
    { name: "name", type: "text", label: "Name" },
    { name: "email", type: "email", label: "Email" },
    { name: "phone", type: "text", label: "Phone" },
    { name: "designation", type: "text", label: "Designation" },
    { name: "address", type: "text", label: "Address" },
  ];

  return (
    <dialog id="edit_employee_profile_modal" className="modal">
      <div className="modal-box w-10/12 max-w-5xl">
        <div className="grid ring-1 rounded-md p-10 ring-primary grid-cols-3 gap-3">
          <div className="border-r-2 border-primary">
            <div className="avatar">
              <div className="lg:w-44 max-md:w-20 rounded-full">
                <img
                  src={editedProfile.photo || "https://via.placeholder.com/150"}
                  alt="Employee Photo"
                />
              </div>
            </div>
            <button
              className="btn btn-secondary mt-4"
              onClick={() =>
                document
                  .getElementById("photo_upload_options")
                  .classList.toggle("hidden")
              }
            >
              Change Photo
            </button>
            <div id="photo_upload_options" className="hidden mt-4 mr-4">
              <input
                type="file"
                className="file-input file-input-bordered w-full mb-2"
                onChange={handleFileUpload}
              />
              <div className={`${fileSelected && "hidden"}`}>
                <p className="text-sm font-semibold mb-3">
                  Or enter photo URL:
                </p>
                <FloatingLabelInput
                  name="photo"
                  type="text"
                  id="photo"
                  label="Photo URL"
                  value={editedProfile.photo || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-span-2 pl-4 grid grid-cols-2 max-md:grid-cols-1 gap-2">
            {formFields.map((field) => (
              <FloatingLabelInput
                key={field.name}
                name={field.name}
                type={field.type}
                id={field.name}
                label={field.label}
                value={editedProfile[field.name] || ""}
                onChange={handleInputChange}
                required
                className="mb-1"
              />
            ))}
            <div className="form-control mb-1">
              <label className="label">
                <span className="label-text">Employee Type</span>
              </label>
              <select
                name="employee_type"
                value={editedProfile.employee_type || ""}
                onChange={handleEmployeeTypeChange}
                className="select select-bordered"
                required
              >
                <option value="Part Time">Part Time</option>
                <option value="Full Time">Full Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            {showContractDuration && (
              <FloatingLabelInput
                name="contract_duration"
                type="text"
                id="contract_duration"
                label="Contract Duration"
                value={editedProfile.contract_duration || ""}
                onChange={handleInputChange}
                required
                className="mb-1"
              />
            )}
            {showInternType && (
              <div className="form-control mb-1">
                <label className="label">
                  <span className="label-text">Intern Type</span>
                </label>
                <select
                  name="is_nustian"
                  value={editedProfile.is_nustian ? "Nustian" : "Non Nustian"}
                  onChange={(e) =>
                    setEditedProfile((prev) => ({
                      ...prev,
                      is_nustian: e.target.value === "Nustian",
                    }))
                  }
                  className="select select-bordered"
                  required
                >
                  <option value="Nustian">Nustian</option>
                  <option value="Non Nustian">Non Nustian</option>
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="modal-action">
          <button
            className={`btn mr-1 ${modalLoading && "btn-disabled"}`}
            onClick={() =>
              document.getElementById("edit_employee_profile_modal").close()
            }
          >
            Cancel
          </button>
          <button
            className={`btn btn-primary text-base-100 ${
              modalLoading && "btn-disabled"
            }`}
            onClick={handleSubmit}
          >
            {modalLoading && <span className="loading loading-spinner"></span>}
            {modalLoading ? "Please wait..." : "Save"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EditEmployeeProfileModal;
