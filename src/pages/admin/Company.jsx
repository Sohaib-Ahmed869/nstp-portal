import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';
import { UserGroupIcon, BriefcaseIcon, ChevronDownIcon, ChevronUpIcon, TruckIcon, ChartBarIcon, ClockIcon, ShieldExclamationIcon, CalendarIcon, DocumentCheckIcon, BanknotesIcon, BuildingOfficeIcon, CalendarDateRangeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import sampleCompanyLogo from '../../assets/samplecompanylogo.png'
import ReactApexChart from 'react-apexcharts';
import { getPieChartOptions } from '../../util/charts';
import EmployeeStats from '../../components/EmployeeStats';
import NSTPLoader from '../../components/NSTPLoader';
import EmployeeProfileModal from '../../components/EmployeeProfileModal';

const Company = () => {
  const { companyId } = useParams();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const terminateEmployee = (employeeId) => {
    // API CALL to terminate
    console.log(`Terminating employee with ID: ${employeeId}`);
  };
  const [companyData, setCompanyData] = useState({
    name: "Tech Innovators",
    type: "Startup",
    joiningDate: "2022-01-15",
    contractStartDate: "2022-01-15",
    contractEndDate: "2022-04-15",
    description: "A leading tech company specializing in innovative solutions, we ensure that our employees are always at the forefront of technology and innovation, and we are always looking for new talent to join our team. We specialize in your needs, leading tech company specializing in innovative solutions, we ensure that our employees are always at the forefront of technology and innovation.",
    totalEmployees: 102,
    activeEmployees: 90,
    cardsNotIssued: 12,
    cardsIssued: 90,
    interns: {
      nustian: 30,
      nonNustian: 20,
      total: 50
    },
    gatePasses: 50,
    workPermits: 40,
    eTags: 60,
    vehiclesRegistered: 25,
    gateEntries: 200,
    foreignGateEntries: 15,
    jobsInternships: 10,
    meetingRoomUsage: 120,
    violations: 5,
    contractDuration: 75,
    employees: [
      {
        "_id": "66df197161c2c1ed67fe5c27",
        "tenant_id": "66d97748124403bf36e695e8",
        "tenant_name": "Hexlertech",
        "email": "musa@gmail.com",
        "name": "Musa Haroon Satti",
        "photo": "https://randomuser.me/api/portraits/men/21.jpg",
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
        "photo": "https://randomuser.me/api/portraits/men/10.jpg",
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
      },
      {
        "_id": "123f2a84c84208453e73701a",
        "tenant_id": "66d91238124403bf36e695e8",
        "tenant_name": "Hexlertech",
        "email": "haadiya@gmail.com",
        "name": "Haadiya Sajid",
        "photo": "https://randomuser.me/api/portraits/women/2.jpg",
        "designation": "Full Stack Developer",
        "cnic": "6110112394528",
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
    ]
  });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  const actions = [
    {
      text: 'End Tenure',
      icon: XCircleIcon,
      onClick: () => {
        document.getElementById('tenure-end-modal').showModal();
      },
    },
  ];
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    // API call here, Fetch company data using the companyId
    //simulate loading
    console.log(companyData)

    setTimeout(() => {
      setLoading(false);
    }, 2000);

  }, [companyId]);

  const handleEndTenure = () => {
    setModalLoading(true);
    setTimeout(() => {
      console.log(`Company ID: ${companyId}`);
      setModalLoading(false);
      document.getElementById('tenure-end-modal').close();
    }, 2000);
  }

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div className={`bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10 ${loading && "hidden"}`}>

        {/* Terminate Confirmation Modal */}
        <dialog id="terminate-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Termination</h3>
            <p className="py-4">Are you sure you want to terminate {selectedEmployee?.name}?</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => {
                  terminateEmployee(selectedEmployee._id);
                  document.getElementById('terminate-modal').close();
                }}
              >
                Yes
              </button>
              <button className="btn" onClick={() => document.getElementById('terminate-modal').close()}>No</button>
            </div>
          </div>
        </dialog>

        {/*end tenure confirmation modal */}
        <dialog id="tenure-end-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p>Do you really want to end the tenure?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => document.getElementById('tenure-end-modal').close()}>No</button>
              <button
                className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                onClick={() => {
                  handleEndTenure();
                }}
              >
                {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Yes"}
              </button>
            </div>
          </div>
        </dialog>

        {/* View Profile Modal */}
        <EmployeeProfileModal employeeProfileSelected={selectedEmployee} />

        <div className='w-full flex justify-end'>
          <div className="relative">
            <button
              className="btn text-base-100 btn-primary"
              onClick={() => toggleDropdown('actions')}
            >
              Actions
              {dropdownOpen['actions'] ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            {dropdownOpen['actions'] && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul className="py-1">
                  {actions.map((action, index) => (
                    <li key={index}>
                      <button
                        className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          action.onClick();
                          toggleDropdown('actions');
                        }}
                      >
                        <action.icon className="h-5 w-5 mr-2" />
                        {action.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>


        {/* Header with company info, description, logo and join date */}
        <div className="flex max-sm:flex-col justify-start items-start gap-5">
          <img src={sampleCompanyLogo} alt="Company Logo" className="size-48 rounded-lg ring-1 ring-gray-200" />

          <div className="">
            <h1 className="text-4xl font-semibold text-primary">{companyData.name}</h1>
            <p className="text-base text-secondary mt-2">{companyData.description}</p>
            <div className='badge badge-secondary mt-2 mb-1'>{companyData.type}</div>
            <div className="flex flex-row gap-7 mt-3">
              <div className="flex">
                <CalendarIcon className="h-6 w-6 text-secondary" />
                <span className="text-secondary ml-2 font-semibold">{"Joined on " + companyData.joiningDate}</span>
              </div>
              <div className="">Contract start: {companyData.contractStartDate}</div>
              <div className="">Contract end: {companyData.contractEndDate}</div>
            </div>
          </div>
        </div>

        <hr className="my-5 text-gray-200"></hr>

        <div className="grid md:grid-cols-2 gap-5 mt-5 ">
          {/* Employee Stats */}
          <EmployeeStats
            total={companyData.totalEmployees}
            active={companyData.activeEmployees}
            cardsNotIssued={companyData.cardsNotIssued}
            cardsIssued={companyData.cardsIssued}
          />

          {/* Company Stats grid */}
          <div className="card p-5 grid divide-y divide-x divide-gray-200 grid-cols-1 md:grid-cols-1 lg:grid-cols-3">

            <div className="stat">
              <div className="stat-figure text-secondary">
                <DocumentCheckIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">E-tags</div>
              <div className="stat-value">{companyData.eTags}</div>
              <div className="stat-desc">Issued</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <TruckIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Vehicles</div>
              <div className="stat-value">{companyData.vehiclesRegistered}</div>
              <div className="stat-desc">Registered</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <BuildingOfficeIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Gate Passes</div>
              <div className="stat-value">{companyData.gatePasses}</div>
              <div className="stat-desc">Issued</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <BanknotesIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Gate Entries</div>
              <div className="stat-value">{companyData.gateEntries}</div>
            </div>


            <div className="stat">
              <div className="stat-figure text-secondary">
                <BriefcaseIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Work permits</div>
              <div className="stat-value">{companyData.workPermits}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <ShieldExclamationIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Violations</div>
              <div className="stat-value">{companyData.violations}</div>
            </div>

          </div>
        </div>

        {/* second row (4 col stats) */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mt-5 ">

          {/* internee stats and piechart */}
          <div className="mt-2 lg:col-span-1 md:col-span-2 sm:col-span-1 card p-5 flex flex-row justify-between items-start">
            <div>
              <span className="font-bold text-4xl flex flex-row items-center gap-2">
                <UserGroupIcon className="size-7" /> {companyData.interns.total}
              </span>
              <p className="mb-3 mt-1 font-bold"> Internees </p>

              <div className="mb-2 p-2 rounded-md bg-accent text-white">{companyData.interns.nustian + " NUSTians"}</div>
              <div className="p-2 rounded-md bg-primary text-white">{companyData.interns.nonNustian + " Non NUSTians"}</div>
            </div>
            <div id="pie-chart">
              <ReactApexChart options={getPieChartOptions(companyData.interns)} series={getPieChartOptions(companyData.interns).series} type="pie" height={220} />
            </div>

          </div>

          {/* Contract duration stats and radial progress */}
          <div className="mt-2 card p-5 flex flex-row justify-between items-center">
            <div>
              <span className="font-bold text-4xl flex flex-row items-center gap-2">
                <CalendarDateRangeIcon className="size-7" /> {companyData.contractDuration + "%"}
              </span>
              <p className="mb-3 mt-1 font-bold"> Contract complete </p>

              <span className="mt-2 block">Contract start: {companyData.contractStartDate}</span>
              <span className="">Contract end: {companyData.contractEndDate}</span>

            </div>
            <div>
              <div className="radial-progress bg-neutral text-primary" style={{ "--value": `${companyData.contractDuration}`, "--size": "7rem", "--thickness": "13px" }} role="progressbar">
                {companyData.contractDuration}%
              </div>
            </div>
          </div>


          {/* No of jobs/internships stat */}
          <div className=" mt-2 card p-5 ">
            <div className="stat border-b">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Jobs & Internships</div>
              <div className="stat-value text-secondary">{companyData.jobsInternships}</div>
              <div className="stat-desc">↗︎ Creating opportunities</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title">Meeting rooms</div>
              <div className="stat-value">{companyData.meetingRoomUsage}</div>
              <div className="stat-desc">↗︎ Hours utilized </div>
            </div>
          </div>

        </div>

        {/* Employees list */}
        <div>
          <h1 className="text-2xl font-semibold mt-5">Employees</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            {companyData.employees.map((employee) => (
              <div key={employee._id} className="relative card p-5 flex flex-col gap-5 items-start group">
                <div className="flex gap-2">
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={employee.photo} alt={employee.name} />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">{employee.name}</h2>
                    <p className="text-sm text-gray-500">{employee.designation}</p>
                    <p className="text-sm text-gray-500">{"Joined on " + employee.date_joining}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-base-100 rounded-md bg-opacity-50 backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary text-base-100"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        document.getElementById('employee_profile').showModal();
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-error text-base-100"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        document.getElementById('terminate-modal').showModal();
                      }}
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </Sidebar>
  );
};

export default Company;