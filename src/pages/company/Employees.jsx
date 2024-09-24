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
} from "@heroicons/react/24/outline";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import TenantService from "../../services/TenantService";
import EditEmployeeProfileModal from "../../components/EditEmployeeProfileModal";

const Employees = () => {
  const dropdownRefs = useRef({});
  const buttonRefs = useRef({});

  // *** States ***
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [employeeTableData, setEmployeeTableData] = useState([
    {
      "_id": "66df197161c2c1ed67fe5c27",
      "tenant_id": "66d97748124403bf36e695e8",
      "tenant_name": "Hexlertech",
      "email": "musa@gmail.com",
      "name": "Musa Haroon Satti",
      "photo": "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      "designation": "Full Stack Developer",
      "cnic": "6110166894529",
      "dob": "2024-09-06",
      "address": "F/10-1 Street 11 House 29",
      "date_joining": "2024-10-11",
      "employee_type": "Intern",
      "contract_duration": "",
      "status_employment": true,
      "is_nustian": true,
      "__v": 0,
      "etags": 1,
      "card_num": 0,
      "card": {
        "_id": "66df197161c2c1ed67fe5c28",
        "tenant_id": "66d97748124403bf36e695e8",
        "employee_id": "66df197161c2c1ed67fe5c27",
        "is_issued": true,
        "is_requested": false,
        "is_returned": false,
        "__v": 0,
        "card_number": 0,
        "date_issued": "2024-09-09T16:48:50.533Z"
      }
    },
    {
      "_id": "66df2a84c84208453e73701a",
      "tenant_id": "66d97748124403bf36e695e8",
      "tenant_name": "Hexlertech",
      "email": "musaharoon.2003@gmail.com",
      "name": "Musa Haroon Satti",
      "photo": "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      "designation": "Full Stack Developer",
      "cnic": "6110166894528",
      "dob": "2024-09-05",
      "address": "F/10-1 Street 11 House 29",
      "date_joining": "2024-10-04",
      "employee_type": "Contract",
      "contract_duration": "6 Months",
      "status_employment": true,
      "is_nustian": false,
      "__v": 0,
      "etags": 1,
      "card": {
        "_id": "66df2a84c84208453e73701b",
        "tenant_id": "66d97748124403bf36e695e8",
        "employee_id": "66df2a84c84208453e73701a",
        "is_issued": false,
        "is_requested": true,
        "is_returned": false,
        "__v": 0,
        "date_requested": "2024-09-09T17:06:10.755Z"
      }
    }
  ]);
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
  const [carLicenseNumber, setCarLicenseNumber] = useState('');


  // *** Effects ***
  useEffect(() => {
    // async function fetchData() {
    //   try {
    //     const employeeResponse = await TenantService.getEmployees();
    //     console.log("🚀 ~ Employees response:", employeeResponse);
    //     if (employeeResponse.error) {
    //       console.error("Error fetching employees:", employeeResponse.error);
    //       return;
    //     }
    //     setEmployees(employeeResponse.data);

    //     const cardResponse = await TenantService.getCardAllocations();
    //     console.log("🚀 ~ Cards response:", cardResponse);
    //     if (cardResponse.error) {
    //       console.error("Error fetching card allocations:", cardResponse.error);
    //       return;
    //     }
    //     setCardAllocations(cardResponse.data);

    //     const etagResponse = await TenantService.getEtagAllocations();
    //     console.log("🚀 ~ Etags response:", etagResponse);
    //     if (etagResponse.error) {
    //       console.error("Error fetching etag allocations:", etagResponse.error);
    //       return;
    //     }
    //     setEtagAllocations(etagResponse.data);

    //     console.log("🚀 ~ Employees:", employeeResponse);
    //     console.log("🚀 ~ Card Allocations:", cardResponse);
    //     console.log("🚀 ~ Etag Allocations:", etagResponse);

    //     const combinedData = employeeResponse.data.map((emp) => {
    //       const card = cardResponse.data.find(
    //         (card) => card.employee_id === emp._id
    //       );
    //       const etags = etagResponse.data.filter(
    //         (etag) => etag.employee_id === emp._id
    //       );
    //       // length of e_tags
    //       const count = etags.length;
    //       console.log("🚀 ~ count:", count);
    //       return {
    //         ...emp,
    //         etags: count,
    //         card_num: card ? card.card_number : null,
    //         card,
    //       };
    //     });

    //     console.log("🚀 ~ combinedData:", combinedData);
    //     setEmployeeTableData(combinedData);
    //   } catch (error) {
    //     console.error("Error fetching employees:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // fetchData();
  }, []);

  useEffect(() => {
    // close dropdown when clicking outside. however, its not working perfectly so commented for now
    // const handleClickOutside = (event) => {
    //   Object.keys(dropdownRefs.current).forEach((id) => {
    //     if (
    //       dropdownRefs.current[id] &&
    //       !dropdownRefs.current[id].contains(event.target) &&
    //       buttonRefs.current[id] &&
    //       !buttonRefs.current[id].contains(event.target)
    //     ) {
    //       setTimeout(() => {
    //         setDropdownOpen((prevState) => ({
    //           ...prevState,
    //           [id]: false,
    //         }));
    //       }, 10);
    //     }
    //   });
    // };
    // document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
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
    console.log(formData);

    TenantService.addEmployee(formData).then((response) => {
      console.log("🚀 ~ Employee response:", response);
      if (response.error) {
        console.error("Error adding employee:", response.error);
        return;
      }
      // setEmployeeTableData((prevData) => [...prevData, response.data]);
    });

    // clearForm();
  };
  const requestCard = (employee_id) => {
    console.log("Requesting card for employee:", employee_id);
    setModalLoading(true);
    //API call

    setTimeout(() => {
      setModalLoading(false);
      document.getElementById('card_request_modal').close();
    }, 2000);
  }

  const requestEtag = (employeeId, carLicenseNumber) => {
    console.log(`Employee ID: ${employeeId}, Car License Number: ${carLicenseNumber}`);
    setModalLoading(true);

    setTimeout(() => {
      setModalLoading(false);
      document.getElementById('etag_request_modal').close();
      setCarLicenseNumber('');
    }, 2000);
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
    { name: "email", type: "email", label: "Email" },
    { name: "cnic", type: "text", label: "CNIC" },
    { name: "address", type: "text", label: "Address" },
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
            <button className="btn btn-primary text-base-100">Layoff</button>
          </div>
        </div>
      </dialog>

      {/* Add new employee popup form */}
      <dialog id="employee_form" className="modal ">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Add new employee</h3>
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
            <button className={`btn mr-1 ${modalLoading && "btn-disabled"} `} onClick={() => { document.getElementById('card_request_modal').close() }}>Cancel</button>
            <button className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"} `} onClick={() => { requestCard(employeeProfileSelected._id) }}> {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Request"}</button>
          </div>
        </div>
      </dialog>

      {/* E tag request modal containing a single field to enter car license number */}
      <dialog id="etag_request_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Request E-Tag</h3>
          <p className="text-sm text-gray-500">
            Please enter the car license number to request an E-Tag for this employee.
          </p>
          <div className="modal-action">
            <input
              type="text"
              placeholder="Enter car license number"
              className="input input-bordered w-full"
              value={carLicenseNumber}
              onChange={(e) => setCarLicenseNumber(e.target.value)}
            />
            <button className="btn mr-1" onClick={() => document.getElementById('etag_request_modal').close()}>Cancel</button>
            <button
              className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
              onClick={() => requestEtag(employeeProfileSelected._id, carLicenseNumber)}
            >
              {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Request"}
            </button>
          </div>
        </div>
      </dialog>

      {/* Employee Profile modal */}
      <EmployeeProfileModal employeeProfileSelected={employeeProfileSelected} />

      {/* Edit Employee Profile modal */}
      <EditEmployeeProfileModal employeeProfileSelected={employeeProfileSelected} setEmployeeTableData={setEmployeeTableData} />

      {/* Main Page Content */}
      <div
        className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"
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
                      <div className="avatar">
                        <div className="w-16 rounded-full">
                          <img src={row.photo} />
                        </div>
                      </div>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.designation}</td>
                    <td>{row.cnic}</td>
                    <td>{row.employee_type}</td>
                    <td>{row.status_employment ? "Active" : "Inactive"}</td>
                    <td
                      className={`${row.card.is_requested
                          ? "bg-yellow-100 text-yellow-900"
                          : ""
                        }`}
                    >
                      {row.card_num !== undefined
                        ? row.card_num
                        : row.card.is_requested
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
                              <button className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  document.getElementById('etag_request_modal').showModal();
                                  setEmployeeProfileSelected(row);
                                  toggleDropdown(row._id);
                                }}
                              >
                                <TagIcon className="h-5 w-5 mr-2" />
                                Request E-Tag
                              </button>
                            </li>
                            <li>
                              <button
                                className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => {
                                  setEmployeeProfileSelected(row);
                                  document
                                    .getElementById("edit_employee_profile_modal")
                                    .showModal();
                                    toggleDropdown(row._id);
                                }}
                              >
                                <PencilSquareIcon className="h-5 w-5 mr-2" />
                                Edit Profile
                              </button>
                            </li>
                            {row.card_num == undefined && (
                              <li>
                                <button className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    document.getElementById("card_request_modal").showModal();
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
