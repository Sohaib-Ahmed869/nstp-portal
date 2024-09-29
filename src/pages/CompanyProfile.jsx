import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import { UserGroupIcon, BriefcaseIcon, ChevronDownIcon, ChevronUpIcon, TruckIcon, ChartBarIcon, ClockIcon, ShieldExclamationIcon, CalendarIcon, DocumentCheckIcon, BanknotesIcon, BuildingOfficeIcon, CalendarDateRangeIcon, XCircleIcon, ChatBubbleLeftRightIcon, UserIcon, EnvelopeIcon, PhoneIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import sampleCompanyLogo from '../assets/samplecompanylogo.png'
import ReactApexChart from 'react-apexcharts';
import { getPieChartOptions } from '../util/charts';
import EmployeeStats from '../components/EmployeeStats';
import NSTPLoader from '../components/NSTPLoader';
import EmployeeProfileModal from '../components/EmployeeProfileModal';
import FloatingLabelInput from '../components/FloatingLabelInput';
import showToast from '../util/toast';
import AdminService from '../services/AdminService';
import { TowerContext } from '../context/TowerContext'


/**
|--------------------------------------------------
| Company profile - admin can view company details, actions: end tenure, terminate employees, give evaluation
| company can view their own profile, actions: terminate employees, request clearance, 
|--------------------------------------------------
*/

const Company = ({ role }) => {
  const { companyId } = useParams();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [feedback, setFeedback] = useState("");
  const { tower } = useContext(TowerContext);
  const terminateEmployee = (employeeId) => {
    // API CALL to terminate
    console.log(`Terminating employee with ID: ${employeeId}`);
  };
  const [companyData, setCompanyData] = useState({
    name: "Tech Innovators",
    type: "Startup",
    category: "EdTech",
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
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantDesignation: '',
    applicantCnic: '',
    officeNumber: '',
    vacatingDate: '',
    reasonForLeaving: ''
  });

  const actions = role == "admin" ? [
    {
      text: 'End Tenure',
      icon: XCircleIcon,
      onClick: () => {
        document.getElementById('tenure-end-modal').showModal();
      },
    },
    {
      text: 'Send Evaluation/Feedback',
      icon: ChatBubbleLeftRightIcon,
      onClick: () => {
        document.getElementById('evaluation-feedback-modal').showModal();
      },
    },
  ] : [
    {
      text: 'Request Clearance',
      icon: DocumentCheckIcon,
      onClick: () => {
        document.getElementById('tenure-end-modal').showModal();
      },
    },
  ]
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (companyId) {
          const response = await AdminService.getTenant(tower.id, companyId);
          if (!response.error) {
            const fetchedData = response.data.tenant;

            // Calculate contract end date (one month after joining date)
            const contractStartDate = new Date(fetchedData.dateJoining);
            const contractEndDate = new Date(contractStartDate);
            contractEndDate.setMonth(contractEndDate.getMonth() + 1); //PLACEHOLDER

            // Calculate contract duration and elapsed time
            const totalContractDuration = contractEndDate - contractStartDate;
            const elapsedTime = new Date() - contractStartDate;
            const contractDurationPercentage = Math.min(
              Math.floor((elapsedTime / totalContractDuration) * 100),
              100
            );

            // Format dates
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedJoiningDate = contractStartDate.toLocaleDateString('en-GB', options);
            const formattedContractStartDate = contractStartDate.toLocaleDateString('en-GB', options);
            const formattedContractEndDate = contractEndDate.toLocaleDateString('en-GB', options);

            // Map the fetched data to the existing state structure
            const consolidatedData = {
              name: fetchedData.registration.organizationName,
              type: fetchedData.registration.category,
              category: fetchedData.industrySector.category,
              rentalSpaceSqft: fetchedData.industrySector.rentalSpaceSqFt + " sq ft",
              companyHeadquarters: fetchedData.companyProfile.companyHeadquarters,
              contactPerson: fetchedData.contactInfo.applicantName,
              contactEmail: fetchedData.contactInfo.applicantEmail,
              contactPhone: fetchedData.contactInfo.applicantPhone,
              joiningDate: formattedJoiningDate,
              contractStartDate: formattedContractStartDate,
              offices: fetchedData.offices,
              companyResourceComposition: fetchedData.companyResourceComposition,
              contractEndDate: formattedContractEndDate,

              totalEmployees: fetchedData.employees,
              activeEmployees: fetchedData.activeEmployees,
              cardsNotIssued: fetchedData.cardsNotIssued,
              cardsIssued: fetchedData.cardsIssued,
              interns: {
                nustian: fetchedData.nustianInterns,
                nonNustian: fetchedData.nonNustianInterns,
                total: fetchedData.nustianInterns + fetchedData.nonNustianInterns,
              },
              gatePasses: fetchedData.gatepasses,
              workPermits: fetchedData.workpermits,
              eTags: fetchedData.etags,
              violations: fetchedData.violations,
              contractDuration: contractDurationPercentage,
              employees: fetchedData.employees
            };

            setCompanyData(consolidatedData);
          } else {
            showToast(false, response.error);
            console.log("Error fetching company data:", response.error);
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        showToast(false, "An error occurred while fetching company data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId, tower.id]);

  const handleEndTenure = () => {
    setModalLoading(true);
    // Simulate an API call
    setTimeout(() => {
      console.log('Form Data:', formData);
      setModalLoading(false);
      showToast(true);

      document.getElementById('tenure-end-modal').close();
    }, 2000);
  };

  //handle change for clearnace form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const sendFeedback = () => {
    setModalLoading(true);
    setTimeout(() => {
      //simulate api call here to send feedback
      console.log(`Feedback: ${feedback}`);
      console.log("company ID: ", companyId); //send feedback to this company
      setModalLoading(false);
      document.getElementById('evaluation-feedback-modal').close();
    }, 2000);
  }

  return (
    <Sidebar>
      {loading && <NSTPLoader />}

      {/** DIALOGS */}
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
        <div className="modal-box min-w-3xl max-w-3xl">
          <h3 className="font-bold text-lg mb-3">End Tenure Form</h3>

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
                handleEndTenure();
              }}
            >
              {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
            </button>
          </div>


        </div>
      </dialog>

      {/* Feedback modal (type in a text area and send/cancel buttons, with modalloading) */}
      <dialog id="evaluation-feedback-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-5">Send Evaluation/Feedback</h3>
          <textarea rows={10} className="w-full h-32 p-2 input input-bordered" placeholder="Type your feedback here..." value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('evaluation-feedback-modal').close()}>Cancel</button>
            <button className={`btn btn-primary ${modalLoading && "btn-disabled"}`} onClick={sendFeedback}>
              {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </dialog>

      {/* View Profile Modal */}
      <EmployeeProfileModal employeeProfileSelected={selectedEmployee} />

      {/** END DIALOGS */}

      {/** MAIN CONTENT */}
      <div className={`bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10 ${loading && "hidden"}`}>

        {/** ACTIONS dropdwon on right */}
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
          <img src={sampleCompanyLogo} alt="Company Logo" className="size-48  rounded-lg ring-1 ring-gray-200" />

          <div className="">
            <h1 className="text-4xl font-semibold text-primary">{companyData.name}</h1>
            <div className='badge badge-secondary mt-2 mb-1'>{companyData.type}</div>
            <div className='badge badge-secondary mt-2 mb-1 ml-2'>{companyData.category}</div>
            {/* <p className="text-base text-secondary mt-2">{companyData.description}</p> */}

            <div className="flex flex-col md:flex-row gap-0 my-2">
              <div className=" flex  items-center gap-1 bg-secondary p-1 rounded-lg rounded-tr-none rounded-br-none px-3 text-base-100"> <UserIcon className="size-4" /> {companyData.contactPerson} </div>
              <div className=" flex  items-center gap-1  p-1 border border-primary border-r-0 border-l-0 px-3 text-primary font-bold"> <EnvelopeIcon className="size-4" /> {companyData.contactEmail} </div>
              <div className=" flex  items-center gap-1  p-1 rounded-lg rounded-tl-none rounded-bl-none  px-3 text-primary font-bold border border-primary border-l-0 max-md:border-r-0 md:"> <PhoneIcon className="size-4" /> {companyData.contactPhone} </div>
            </div>
            <div className="flex gap-3">
              <p className="text-base text-secondary">Rental Space: {companyData.rentalSpaceSqft} </p>
              <p className="text-base text-secondary">Headquarters: {companyData.companyHeadquarters} </p>

            </div>
            <div className="flex flex-row gap-7 mt-2">
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
            total={companyData.employees.length}
            active={companyData.activeEmployees}
            cardsNotIssued={companyData.cardsNotIssued}
            cardsIssued={companyData.cardsIssued}
          />

          {/* Company Stats grid */}
          <div className="card p-5 grid divide-y divide-x divide-gray-200 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">

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
                <BuildingOfficeIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Gate Passes</div>
              <div className="stat-value">{companyData.gatePasses}</div>
              <div className="stat-desc">Issued</div>
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
          <div className="mt-2 card p-5 flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div>
              <span className="font-bold text-4xl flex flex-row items-center gap-2">
                <CalendarDateRangeIcon className="size-7" /> {companyData.contractDuration + "%"}
              </span>
              <p className="mb-3 mt-1 font-bold"> Contract complete </p>
              <span className="mt-2 block">Contract start: {companyData.contractStartDate}</span>
              <span className="">Contract end: {companyData.contractEndDate}</span>
            </div>
            <div>
              <div className="radial-progress bg-neutral mt-10 lg:mt-0 text-primary" style={{ "--value": `${companyData.contractDuration}`, "--size": "7rem", "--thickness": "13px" }} role="progressbar">
                {companyData.contractDuration}%
              </div>
            </div>
          </div>


          {/* Company Resource Composition */}
          <div className="mt-2 card p-5">
            <h2 className="text-xl font-bold mb-4">Company Resource Composition</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Management</h3>
                <p>{companyData.companyResourceComposition?.management}%</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Engineering</h3>
                <p>{companyData.companyResourceComposition?.engineering}%</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Marketing and Sales</h3>
                <p>{companyData.companyResourceComposition?.marketingAndSales}%</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Remaining Predominant Area</h3>
                <p>{companyData.companyResourceComposition?.remainingPredominantArea}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Areas of Research</h3>
                <ul className="list-disc list-inside">
                  {companyData.companyResourceComposition?.areasOfResearch.split(';').map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">NUST School to Collaborate</h3>
                <p>{companyData.companyResourceComposition?.nustSchoolToCollab}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees list */}
        <div>
          <h1 className="text-2xl font-semibold mt-5">Employees</h1>
          {companyData.employees.length === 0 ? <div className="text-secondary">No employees found</div>
            :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
           
            {companyData.employees.map((employee) => (
              <div key={employee._id} className="relative card p-5 flex flex-col gap-5 items-start group">
                <div className="flex gap-2">
                  <div className="avatar">
                    <div className="w-20 rounded-full bg-gray-300">
                      
                      { employee.photo ? <img src={employee.photo} alt={employee.name} /> :
                      <UserCircleIcon className="size-20 text-gray-400" />}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">{employee.name}</h2>
                    <p className="text-sm text-gray-500">{employee.designation}</p>
                    <p className="text-sm text-gray-500">{"Joined on " +  new Date(employee.date_joining).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
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
}
        </div>
      </div>
    </Sidebar>
  );
};

export default Company;