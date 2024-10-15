import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import NSTPLoader from "../../components/NSTPLoader";
import EmployeeProfileModal from "../../components/EmployeeProfileModal";
import {
  UserPlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XCircleIcon,
  UserIcon,
  IdentificationIcon,
  PencilSquareIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import TenantService from "../../services/TenantService";
import EditEmployeeProfileModal from "../../components/EditEmployeeProfileModal";
import showToast from "../../util/toast";

const Employees = () => {
  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});

  // *** States ***
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [employeeTableData, setEmployeeTableData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    email: "",
    cnic: "",
    phone: "",
    dob: "",
    doj: "",
    designation: "",
    empType: "",
    contractDuration: "",
    internType: "",
    address: "",
  });
  const [employeeProfileSelected, setEmployeeProfileSelected] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [carLicenseNumber, setCarLicenseNumber] = useState("");

  const [cardAllocations, setCardAllocations] = useState([]);
  const [etagAllocations, setEtagAllocations] = useState([]);


  // *** Effects ***
  useEffect(() => {
    async function fetchData() {
      try {
        const employeeResponse = await TenantService.getEmployees();
        console.log("🚀 ~ Employees response:", employeeResponse);
        if (employeeResponse.error) {
          console.error("Error fetching employees:", employeeResponse.error);
          return;
        }
        setEmployees(employeeResponse.data.employees);

        const cardResponse = await TenantService.getCardAllocations();
        console.log("🚀 ~ Cards response:", cardResponse);
        if (cardResponse.error) {
          console.error("Error fetching card allocations:", cardResponse.error);
          return;
        }
        setCardAllocations(cardResponse.data.cardAllocations);

        const etagResponse = await TenantService.getEtagAllocations();
        console.log("🚀 ~ Etags response:", etagResponse);
        if (etagResponse.error) {
          console.error("Error fetching etag allocations:", etagResponse.error);
          return;
        }
        setEtagAllocations(etagResponse.data.etagAllocations);

        console.log("🚀 ~ Employees:", employeeResponse);
        console.log("🚀 ~ Card Allocations:", cardResponse);
        console.log("🚀 ~ Etag Allocations:", etagResponse);

        const combinedData = employeeResponse.data.employees.map((emp) => {
          let cards = cardResponse.data.cardAllocations.filter(
            (card) => card.employee_id === emp._id
          );
          let card = cards?.filter((card) => card.is_requested || card.is_issued)[0];
          let etags = etagResponse.data.etagAllocations.filter(
            (etag) => etag.employee_id === emp._id
          );
          etags = etags?.filter((etag) => etag.is_requested || etag.is_issued);

          // length of issued etags
          const count = etags.filter((etag) => etag.is_issued).length;

          console.log("🚀 ~ count:", count);
          return {
            ...emp,
            etags: count,
            card_num: card ? card.card_number : null,
            card,
          };
        });

        console.log("🚀 ~ combinedData:", combinedData);
        setEmployeeTableData(combinedData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    //By defualt, sort by status_employment in descending order (Active first)
    setSortField("status_employment");
    setSortOrder("desc");
  }, []);

  // *** Functions ***
  const toggleDropdown = (_id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [_id]: !prevState[_id],
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  //handle change in form data for adding new employee
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //clear form data
  const clearForm = () => {
    setFormData({
      name: "",
      photo: "",
      email: "",
      cnic: "",
      phone: "",
      dob: "",
      doj: "",
      designation: "",
      empType: "",
      contractDuration: "",
      internType: "",
      address: "",
    });
  };

  //handle form submission for adding new employee
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    //API call here
    console.log("Submittign the form data:  ", formData);

    TenantService.addEmployee(formData).then((response) => {
      console.log("🚀 ~ Employee response:", response);
      if (response.error) {
        console.error("Error adding employee:", response.error);
        showToast(false);
        return;
      }
      showToast(true);
      // Add new employee to the table
      setEmployeeTableData((prevData) => {
        return [
          ...prevData,
          {
            ...formData,
            _id: response.data.employee._id,
            card_num: null,
            status_employment: true,
            etags: 0,
            employee_type: formData.empType,

            card: { is_requested: false },
          },
        ];
      });

      
      document.getElementById("employee_form").close();
      clearForm();
    });
  };

  const handleLayoff = async (employee_id) => {
    // add loading state

    try {
      const response = await TenantService.layOffEmployee(employee_id);
      console.log("🚀 ~ response:", response)
      if(response.error){
        console.error("Error laying off employee:", response.error);
        showToast(false);
        return;
      }
      showToast(true);
      console.log("🚀 ~ response", response)

    } catch (error) {
      console.error("Error laying off employee:", error);
      showToast(false);
    } finally {
      // remove loading state
      document.getElementById("layoff_modal").close();
    }
  };

  const requestCard = async (employee_id) => {
    console.log("Requesting card for employee:", employee_id);
    setModalLoading(true);
    //API call
    try{
      const response = await TenantService.requestCard(employee_id);
      console.log("🚀 ~ response:", response)
      if(response.error){
        console.error("Error requesting card:", response.error);
        showToast(false, response.error);
        return;
      }
      showToast(true);
      setEmployeeTableData((prevData) => {
        return prevData.map((emp) => {
          if (emp._id === employee_id) {
            return { ...emp, card: { is_requested: true } };
          }
          return emp;
        });
      });
    }
    catch(error){
      console.error("Error requesting card:", error);
      showToast(false);
    }
    finally {
      setModalLoading(false);
      document.getElementById("card_request_modal").close();
    }  
  };

  const requestEtag = async (employeeId, carLicenseNumber) => {
    console.log(
      `Employee ID: ${employeeId}, Car License Number: ${carLicenseNumber}`
    );
    setModalLoading(true);

    //API call
    try{
      const response = await TenantService.requestEtag(employeeId, carLicenseNumber);
      console.log("🚀 ~ response:", response)
      if(response.error){
        console.error("Error requesting etag:", response.error);
        showToast(false, response.error);
        return;
      }
      showToast(true, response.message);            
    } catch (error) {
      console.error("Error requesting etag:", error);
      showToast(false);
    } finally {
      setModalLoading(false);
      document.getElementById("etag_request_modal").close();
      setCarLicenseNumber("");
    }
  };

  // *** Constants ***
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "designation", label: "Designation" },
    { key: "cnic", label: "CNIC" },
    { key: "employee_type", label: "Employee Type" },
    { key: "status_employment", label: "Status Employment" },
    { key: "card_num", label: "Card Num" },
    { key: "actions", label: "Actions", sortable: false },
  ];

  const employeeFields = [
    { name: "name", type: "text", label: "Name" },
    { name: "fatherName", type: "text", label: "fatherName" },
    { name: "email", type: "email", label: "Email" },
    { name: "cnic", type: "text", label: "CNIC" },
    { name: "phone", type: "text", label: "Phone" },
    { name: "permAddress", type: "text", label: "Permanent address" },
    { name: "tempAddress", type: "text", label: "Temporary address" },
    { name: "designation", type: "text", label: "Designation" },
    { name: "dob", type: "date", label: "DOB" },
    { name: "doj", type: "date", label: "DOJ" },
    {
      name: "empType",
      type: "select",
      label: "Emp Type",
      options: ["Contract", "Part-time", "Full-time", "Intern"],
    },
    {
      name: "contractDuration",
      type: "text",
      label: "Contract Duration",
      conditional: { field: "empType", value: "Contract" },
    },
    {
      name: "internType",
      type: "select",
      label: "Intern Type",
      options: ["Nustian", "Non-Nustian"],
      conditional: { field: "empType", value: "Intern" },
    },
    { name: "photo", type: "text", label: "Photo URL" },
  ];
  const filteredData = employeeTableData
    .filter((row) => {
      if (filter === "All") return true;
      return row.status_employment === (filter === "Active");
    })
    .filter((row) => {
      return (
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.designation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Sidebar>
      {loading && <NSTPLoader />}

      {/* Layoff employee confirmation modal */}
      <dialog id="layoff_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to layoff this employee?
          </h3>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="modal-action">
            <button
              className="btn mr-1"
              onClick={() => document.getElementById("layoff_modal").close()}
            >
              Cancel
            </button>
            <button className="btn btn-primary text-base-100" onClick={() => handleLayoff(employeeProfileSelected._id)}>Layoff</button>
          </div>
        </div>
      </dialog>

      {/* Add new employee popup form */}
      <dialog id="employee_form" className="modal ">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="flex gap-2 mb-3 items-center">
            <UserPlusIcon className="size-6 text-primary" />
            <h3 className="font-bold text-lg">Add new employee</h3>
          </div>
          <form onSubmit={handleSubmit} className="py-4">
            <div className="w-full grid grid-cols-2 gap-3">
              {employeeFields.map((field) => {
                if (
                  field.conditional &&
                  formData[field.conditional.field] !== field.conditional.value
                ) {
                  return null;
                }
                if (field.type === "select") {
                  return (
                    <div
                      key={field.name}
                      className="relative z-0 w-full mb-5 group"
                    >
                      <select
                        name={field.name}
                        id={field.name}
                        className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select {field.label}
                        </option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <label
                        htmlFor={field.name}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        {field.label}
                      </label>
                    </div>
                  );
                }

                if (field.name == "photo") return;

                return (
                  <FloatingLabelInput
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    id={field.name}
                    label={field.label}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                );
              })}
            </div>

            {/* photo */}
            <>
              <p className="text-sm mb-2">Upload employee's photo</p>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </>

            {/* Checkbox to verify that the above information is true to the best of my information */}
            <div className="flex items-center mt-5">
              <input
                type="checkbox"
                id="verify"
                name="verify"
                className="form-checkbox"
                required
              />
              <label htmlFor="verify" className="ml-2 text-sm text-gray-700">
                I verify that the above information is true to the best of my
                information
              </label>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn mr-1"
                onClick={() => {
                  document.getElementById("employee_form").close();
                  clearForm();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary text-base-100">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Card request modal */}
      <dialog id="card_request_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Request card</h3>
          <p className="text-sm text-gray-500">
            Please confirm to request a card for this employee.
          </p>
          <div className="modal-action">
            <button
              className={`btn mr-1 ${modalLoading && "btn-disabled"} `}
              onClick={() => {
                document.getElementById("card_request_modal").close();
              }}
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary text-base-100 ${
                modalLoading && "btn-disabled"
              } `}
              onClick={() => {
                requestCard(employeeProfileSelected._id);
              }}
            >
              {" "}
              {modalLoading && (
                <span className="loading loading-spinner"></span>
              )}{" "}
              {modalLoading ? "Please wait..." : "Request"}
            </button>
          </div>
        </div>
      </dialog>

      {/* E tag request modal containing a single field to enter car license number */}
      <dialog id="etag_request_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Request E-Tag</h3>
          <p className="text-sm text-gray-500">
            Please enter the car license number to request an E-Tag for this
            employee.
          </p>
          <div className="modal-action">
            <input
              type="text"
              placeholder="Enter car license number"
              className="input input-bordered w-full"
              value={carLicenseNumber}
              onChange={(e) => setCarLicenseNumber(e.target.value)}
            />
            <button
              className="btn mr-1"
              onClick={() =>
                document.getElementById("etag_request_modal").close()
              }
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary text-base-100 ${
                modalLoading && "btn-disabled"
              }`}
              onClick={() =>
                requestEtag(employeeProfileSelected._id, carLicenseNumber)
              }
            >
              {modalLoading && (
                <span className="loading loading-spinner"></span>
              )}{" "}
              {modalLoading ? "Please wait..." : "Request"}
            </button>
          </div>
        </div>
      </dialog>

      {/* Employee Profile modal */}
      <EmployeeProfileModal employeeProfileSelected={employeeProfileSelected} />

      {/* Edit Employee Profile modal */}
      <EditEmployeeProfileModal
        employeeProfileSelected={employeeProfileSelected}
        setEmployeeTableData={setEmployeeTableData}
      />

      {/* Main Page Content */}
      <div
        className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${
          loading && "hidden"
        }`}
      >
        {/* Header + add new emp btn */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Employees</h1>
          <button
            className="btn btn-primary text-white"
            onClick={() => document.getElementById("employee_form").showModal()}
          >
            <UserPlusIcon className="size-6" />
            Add New Employee
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex max-md:flex-col lg:flex-row  lg:items-center lg:justify-between mt-4">
          <div className="relative w-full lg:max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered w-full pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <div className="w-full lg:w-4/12 flex items-center lg:justify-end max-md:mt-2">
            <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {employeeTableData.length === 0 ? (
          <p className="text-gray-500">No data to show for now.</p>
        ) : (
          <div className="h-full min-h-screen overflow-y-auto">
            <p className="my-2 text-gray-500 text-sm">
              Click on any column header to sort data
            </p>
            <table className="table mt-5 rounded-lg  mb-10">
              <thead>
                <tr className="bg-base-200 cursor-pointer">
                  <th></th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() =>
                        column.sortable !== false &&
                        handleSortChange(column.key)
                      }
                    >
                      {sortField === column.key
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="mb-9">
                {filteredData.map((row, index) => (
                  <tr key={row._id} className="relative group">
                    <td>
                      {row.photo ? <div className="avatar">
                        <div className="w-16 rounded-full">
                          <img src={row.photo} />
                        </div>
                      </div> : 
                      <div className="size-10 rounded-full bg-gray-300">
                      <UserCircleIcon className="size-10 text-gray-400" />
                   </div>
                      }
                    </td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.designation}</td>
                    <td>{row.cnic}</td>
                    <td>{row.employee_type}</td>
                    <td>{row.status_employment ? "Active" : "Inactive"}</td>
                    <td
                      className={`${
                        row.card?.is_requested
                          ? "bg-yellow-100 text-yellow-900"
                          : ""
                      }`}
                    >
                      {row.card_num != null
                        ? row.card_num
                        : row.card?.is_requested
                        ? "Awaiting Approval"
                        : "Not Assigned"}
                    </td>
                    <td className="relative">
                      <button
                        ref={(el) => (buttonRefs.current[row._id] = el)}
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => toggleDropdown(row._id)}
                      >
                        {dropdownOpen[row._id] ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                      {dropdownOpen[row._id] && (
                        <div
                          ref={(el) => (dropdownRefs.current[row._id] = el)}
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          <ul className="py-1">
                            <li>
                              <button
                                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setEmployeeProfileSelected(row);
                                  document
                                    .getElementById("employee_profile")
                                    .showModal();
                                  toggleDropdown(row._id);
                                }}
                              >
                                <UserIcon className="h-5 w-5 mr-2" />
                                View Profile
                              </button>
                            </li>
                            <li>
                              <button
                                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  document
                                    .getElementById("etag_request_modal")
                                    .showModal();
                                  setEmployeeProfileSelected(row);
                                  toggleDropdown(row._id);
                                }}
                              >
                                <TagIcon className="h-5 w-5 mr-2" />
                                Request E-Tag
                              </button>
                            </li>
                            {/* <li>
                              <button
                                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setEmployeeProfileSelected(row);
                                  document
                                    .getElementById(
                                      "edit_employee_profile_modal"
                                    )
                                    .showModal();
                                  toggleDropdown(row._id);
                                }}
                              >
                                <PencilSquareIcon className="h-5 w-5 mr-2" />
                                Edit Profile
                              </button>
                            </li> */}
                            {row.card_num == undefined && (
                              <li>
                                <button
                                  className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    document
                                      .getElementById("card_request_modal")
                                      .showModal();
                                    setEmployeeProfileSelected(row);
                                    toggleDropdown(row._id);
                                  }}
                                >
                                  <IdentificationIcon className="h-5 w-5 mr-2" />
                                  Request card
                                </button>
                              </li>
                            )}
                            {row.status_employment && (
                              <li>
                                <button
                                  className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document
                                      .getElementById("layoff_modal")
                                      .showModal();
                                    setEmployeeProfileSelected(row);
                                    toggleDropdown(row._id);
                                  }}
                                >
                                  <XCircleIcon className="h-5 w-5 mr-2" />
                                  Layoff
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Employees;
