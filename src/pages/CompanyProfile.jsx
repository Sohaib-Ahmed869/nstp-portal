import React, { useEffect, useState, useContext, } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserGroupIcon, MagnifyingGlassIcon, BriefcaseIcon, ShieldExclamationIcon, CalendarIcon, CalendarDateRangeIcon, UserIcon, EnvelopeIcon, PhoneIcon, UserCircleIcon, PresentationChartLineIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import ReactApexChart from 'react-apexcharts';

/* Components */
import EmployeeStats from '../components/EmployeeStats';
import Sidebar from '../components/Sidebar';
import ComparativeChart from '../components/ComparativeChart';
import NSTPLoader from '../components/NSTPLoader';
import ActionsDropdown from '../components/ActionsDropdown';
import SideDrawer from '../components/SideDrawer';

/*Modals */
import AddStickyNoteModal from '../components/modals/company-profile/AddStickyNoteModal';
import ChangePasswordModal from '../components/modals/company-profile/ChangePasswordModal';
import ClearanceFormModal from '../components/modals/company-profile/ClearanceFormModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import EmployeeProfileModal from '../components/modals/EmployeeProfileModal';
import RequestEvaluationModal from '../components/modals/company-profile/RequestEvaluationModal';
import TerminateEmployeeModal from '../components/modals/company-profile/TerminateEmployeeModal';
import UploadLogoModal from '../components/modals/company-profile/UploadLogoModal';

/* Services and context */
import { AdminService, TenantService } from '../services';
import { TowerContext } from '../context/TowerContext'

/* Utils */
import { formatDate, calculateDuration } from '../util/date';
import showToast from '../util/toast';
import { getPieChartOptions } from '../util/charts';

/* Constants */
const CONTRACT_DURATION_THRESHOLD = 90; // after 90% of contract duration, the radial progress will become red

/**
|--------------------------------------------------
| Company profile component - admin can view company details, actions: end tenure, terminate employees, give evaluation
| company can view their own profile, actions: terminate employees, request clearance,  etc.
|--------------------------------------------------
*/

const Company = ({ role }) => {
  const { companyId } = useParams();
  const { tower } = useContext(TowerContext);

  /* States */
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [companyData, setCompanyData] = useState({ //DONT remove this dummmy state, loading issues otherwise
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
    gatePasses: { "Received": 20, "Pending": 10 },
    workPermits: 40,
    eTags: { "Received": 20, "Pending": 10 },
    vehiclesRegistered: 25,
    gateEntries: 200,
    foreignGateEntries: 15,
    jobsInternships: 10,
    meetingRoomUsage: 120,
    violations: 5,
    contractDuration: 75,
    notes: [
      {
        id: "1",
        adminName: "Admin1",
        date: "2022-10-10",
        note: "This is a note from admin1",
      },
    ],
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
        "etags": 1,
        "card_num": 0,
        "card": {
          "_id": "66df197161c2c1ed67fe5c28",
          "tenant_id": "66d97748124403bf36e695e8",
          "employee_id": "66df197161c2c1ed67fe5c27",
          "is_issued": true,
          "is_requested": false,
          "is_returned": false,
          "card_number": 0,
          "date_issued": "2024-09-09T16:48:50.533Z"
        }
      },
    ]
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([]);

  /* Derived states */
  const filteredEmployees = companyData.employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );


  /* Functions */
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const confirmDeleteCompanyLogo = async () => {
    //api call to delete logo
    setModalLoading(true);
    console.log("Deleting company logo...");
    try {

      const response = await AdminService.deleteTenantLogo(companyId);
      if (response.error) {
        console.error("Error deleting company logo:", response.error);
        showToast(false, response.error);
        return;
      }

      console.log("Company logo deleted successfully:", response.message);

      setCompanyData((prevData) => ({
        ...prevData,
        logo: null
      }));

      showToast(true, response.message);
      // setTimeout (() => 
      //   { console.log("meow")
      //     setModalLoading(false);
      //     setCompanyData((prevData) => ({
      //       ...prevData,
      //       logo: null
      //     }));

      //   //api call here
      //   showToast(true, "Company logo deleted successfully.");
      //   document.getElementById('delete-logo-modal').close()

      //   }, 2000); //remove this timout wrapper when api call done

    }
    catch (error) {
      console.error("Error deleting company logo:", error);
      showToast(false, "An error occurred while deleting company logo.");
    }
    finally {
      setModalLoading(false);
      document.getElementById('delete-logo-modal').close();
    }
  }

  const fetchAdminNotes = async () => {
    try {
      const response = await AdminService.getTenantNotes(tower.id, companyId);
      if (response.error) {
        console.error("Error fetching company notes:", response.error);
        showToast(false, response.error);
        return false;
      }
      //Syntax for note:
      //{
      //         id: new Date().getTime().toString(),
      //         adminName: "Admin7",
      //         date: new Date().toISOString().split('T')[0],
      //         note: noteContent,
      //       },
      console.log("Admin notes:", response.data.notes);
      setStickyNotes(response.data.notes.map((note) => ({
        id: note.id,
        adminName: note.adminName,
        date: formatDate(note.date),
        note: note.note,
        isEditable: note.isEditable,
      }))
      );

      return true;
    } catch (error) {
      console.error("Error fetching company notes:", error);
      showToast(false, "An error occurred while fetching company notes.");
      return false;
    }
  };

  /* Effects */
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (companyId) {
          const response = await AdminService.getTenant(tower.id, companyId);
          if (!response.error) {
            const fetchedData = response.data.tenant;
            console.log("FETC", fetchedData)
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
              logo: fetchedData.registration.companyLogo, // || nstpLogo,
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

              totalEmployees: fetchedData.totalEmployees,
              activeEmployees: fetchedData.activeEmployees,
              cardsNotIssued: fetchedData.cardsNotIssued,
              cardsIssued: fetchedData.cardsIssued,
              interns: {
                nustian: fetchedData.nustianInterns,
                nonNustian: fetchedData.nonNustianInterns,
                total: fetchedData.nustianInterns + fetchedData.nonNustianInterns,
              },
              workPermits: fetchedData.workpermits,
              violations: fetchedData.violations,
              contractDuration: contractDurationPercentage,
              employees: fetchedData.employees,
              meetingMinutes: fetchedData.meetingMinutes,
              meetingMinutesMoney: fetchedData.meetingMinutesMoney,
              eTags: fetchedData.etags,
              gatePasses: fetchedData.gatepasses,
              notes: [ //fetching for admin means notes returned
                {
                  id: "1",
                  adminName: "Admin1",
                  date: "2022-10-10",
                  note: "This is a note from admin1",
                },
                {
                  id: "2",
                  adminName: "Admin2",
                  date: "2022-10-11",
                  note: "This is a note from admin2",
                },
              ],
              username: fetchedData.username,
            };
            console.log("setting company data to: ", consolidatedData)
            setCompanyData(consolidatedData);
          } else {
            showToast(false, response.error);
            setError(true)
            console.log("Error fetching company data:", response.error);
          }
        } else {
          // fetch for tenant
          const response = await TenantService.getProfile();
          if (!response.error) {
            const fetchedData = response.data.tenant;
            console.log("FETC", fetchedData)

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
              logo: fetchedData.registration.companyLogo,
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
              totalEmployees: fetchedData.totalEmployees,
              activeEmployees: fetchedData.activeEmployees,
              cardsNotIssued: fetchedData.cardsNotIssued,
              cardsIssued: fetchedData.cardsIssued,
              interns: {
                nustian: fetchedData.nustianInterns,
                nonNustian: fetchedData.nonNustianInterns,
                total: fetchedData.nustianInterns + fetchedData.nonNustianInterns,
              },
              workPermits: fetchedData.workpermits,
              violations: fetchedData.violations,
              contractDuration: contractDurationPercentage,
              employees: fetchedData.employees,
              meetingMinutes: fetchedData.meetingMinutes,
              meetingMinutesMoney: fetchedData.meetingMinutesMoney,
              eTags: fetchedData.etags,
              gatePasses: fetchedData.gatepasses,
              notes: [
                {
                  id: "1",
                  adminName: "Admin1",
                  date: "2022-10-10",
                  note: "This is a note from admin1",
                },
                {
                  id: "2",
                  adminName: "Admin2",
                  date: "2022-10-11",
                  note: "This is a note from admin2",
                },
              ],
            };
            console.log("setting company data to: ", consolidatedData)
            setCompanyData(consolidatedData);
          } else {
            showToast(false, response.error);
            setError(true)
            console.log("Error fetching tenant data:", response.error);
          }
        }
      } catch (error) {
        setError(true)
        console.error("Error fetching company data:", error);
        showToast(false, "An error occurred while fetching company data.");
      } finally {
        setError(false)
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      {error && <div className="alert alert-error">An error occurred while fetching company data.</div>}

      {/** DIALOGS */}
      {/* Terminate Employee Confirmation Modal */}
      <TerminateEmployeeModal selectedEmployee={selectedEmployee} />

      {/*tenure end (clearance form) modal */}
      <ClearanceFormModal />

      {/** upload logo modal */}
      <UploadLogoModal setCompanyData={setCompanyData} />

      {/* add sticky note modal */}
      <AddStickyNoteModal />

      {/* Feedback modal with rejection date*/}
      <RequestEvaluationModal />

      {/** Change password modal */}
      <ChangePasswordModal role={role} companyData={companyData} />

      {/* View Profile Modal */}
      <EmployeeProfileModal employeeProfileSelected={selectedEmployee} />

      {/** Confirm delete logo modal */}
      <DeleteConfirmationModal
        id="delete-logo-modal"
        title="Delete Company Logo"
        message="Are you sure you want to delete the company logo? This cannot be undone."
        onConfirm={confirmDeleteCompanyLogo}
        modalLoading={modalLoading}
      />

      {/** END DIALOGS */}

      {/** Side drawer for sticky notes */}
      <SideDrawer drawerContent={stickyNotes} setDrawerContent={setStickyNotes}  >

        {/** MAIN CONTENT */}
        <div className={`bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10 ${loading && "hidden"}`}>

          {/** First row, company info and actions */}
          <div className="flex lg:flex-row flex-col ">
            {/* Header with company info, description, logo and join date */}
            <div className=" order-2 lg:order-1 flex max-sm:flex-col justify-start items-start gap-5">
              {companyData.logo ?
                <img src={companyData.logo} alt="Company Logo" className="size-48  rounded-lg ring-1 ring-gray-200" />
                :
                <div className="size-48 rounded-lg ring-1 ring-gray-200 bg-gray-200 flex items-center justify-center">
                  <p className="text-sm"> No Logo </p>
                </div>
              }
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

            {/** ACTIONS dropdwon on right */}
            <div className=' order-1 lg:order-2 flex-1 flex lg:flex-col gap-3 justify-end lg:justify-normal lg:mb-0 mb-5 lg:items-end'>
              {/** Button to fetch sticky notes for admins */}
              {role == "admin" &&
                (
                  <>
                    <button
                      className={`text-base-100 drawer-button btn-outline btn btn-primary ${notesLoading && "btn-disabled"} `}
                      onClick={async () => {
                        setNotesLoading(true);
                        await fetchAdminNotes();
                        setNotesLoading(false);
                        document.getElementById('sticky-notes-label').click();
                        toggleIfOpen('actions')
                      }} >
                      {notesLoading && <span className="loading loading-spinner"></span>}
                      {notesLoading ? "Fetching..." : "Admin Notes"}

                    </button>
                    <label id="sticky-notes-label" htmlFor='sticky-notes' className="hidden" ></label>
                  </>
                )
              }

              {/** Actions dropdown */}
              <ActionsDropdown />
            </div>
          </div>

          <hr className="my-5 text-gray-200"></hr>

          {/* First row (employee stats, numerical stats) */}
          <div className="grid md:grid-cols-2 gap-5 mt-5 ">
            <EmployeeStats
              total={companyData.totalEmployees}
              active={companyData.activeEmployees}
              cardsNotIssued={companyData.cardsNotIssued}
              cardsIssued={companyData.cardsIssued}
            />
            {/* Company Stats grid */}
            <div className="card p-5 grid divide-y divide-x divide-gray-200 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <PresentationChartLineIcon className="inline-block h-8 w-8" />
                </div>
                <div className="stat-title">Meetings</div>
                <div className="stat-value">{companyData.meetingMinutes || "0"}</div>
                <div className="stat-desc">Minutes </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <CurrencyDollarIcon className="inline-block h-8 w-8" />
                </div>
                <div className="stat-title">Meetings</div>
                <div className="stat-value">{companyData.meetingMinutesMoney || "0"}</div>
                <div className="stat-desc">PKR Outstanding</div>
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

          {/* second row (3 col stats) */}
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
              <div id="pie-chart" className="flex items-center justify-center">
                {companyData.interns.nustian === 0 && companyData.interns.nonNustian === 0 ? (
                  <div className="flex items-center justify-center m-5 w-[190px] h-[190px] bg-gray-200 rounded-full">
                    <span className="text-gray-500">No data to show</span>
                  </div>
                ) : (
                  <ReactApexChart
                    options={getPieChartOptions(companyData.interns)}
                    series={getPieChartOptions(companyData.interns).series}
                    type="pie"
                    height={220}
                  />
                )}
              </div>
            </div>

            {/* Contract duration stats and radial progress */}
            <div className="mt-2 card p-5 flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div>
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  <CalendarDateRangeIcon className="size-7" /> {companyData.contractDuration + "%"}
                </span>
                <p className="mb-3 mt-1 font-bold"> Contract complete </p>
                <div className=""> <strong>Company Joining Date:  </strong>{companyData.joiningDate}</div>
                <span className="mt-2 block"><strong> Contract start:  </strong>{companyData.contractStartDate}</span>
                <span className="mt-2 block"><strong> Contract end: </strong> {companyData.contractEndDate}</span>
                <span className="mt-2 block"><strong> Total Stay: </strong> {calculateDuration(new Date(companyData.joiningDate), new Date())}</span>
              </div>
              <div>
                <div className={`radial-progress bg-neutral mt-10 lg:mt-0 ${companyData.contractDuration >= CONTRACT_DURATION_THRESHOLD ? "text-error" : "text-primary"}`} style={{ "--value": `${companyData.contractDuration}`, "--size": "7rem", "--thickness": "13px" }} role="progressbar">
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
                {/* <div>
                  <h3 className="text-lg font-semibold">Remaining Predominant Area</h3>
                  <p>{companyData.companyResourceComposition?.remainingPredominantArea}</p>
                </div> */}
                <div>
                  <h3 className="text-lg font-semibold">Areas of Research</h3>
                  <ul className="list-disc list-inside">
                    {companyData.companyResourceComposition?.areasOfResearch.split(';').map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
                {/* <div>
                  <h3 className="text-lg font-semibold">NUST School to Collaborate</h3>
                  <p>{companyData.companyResourceComposition?.nustSchoolToCollab}</p>
                </div> */}
              </div>
            </div>
          </div>

          {/** 3rd row (comparativeCharts of gatepasses and etags) */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div className="card p-5">
              <ComparativeChart title="Gate Passes" comparisonData={companyData.gatePasses} />
            </div>
            <div className="card p-5">
              <ComparativeChart title="ETags" comparisonData={companyData.eTags} />
            </div>
          </div>
          <hr className="mt-12 mb-5 text-gray-200"></hr>
          {/* Employees list */}
          <div>
            <div className="flex justify-between items-center mt-5">
              <h1 className="text-2xl font-semibold ">Employees</h1>
              <div className="flex gap-3 items-center">

                <div className="relative w-full md:max-w-xs ">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="input input-bordered w-full pl-10"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
                {role == "tenant" && (
                  <Link to={"/tenant/employees"} className="btn btn-primary text-base-100">
                    <UserGroupIcon className="size-5" />
                    View All
                  </Link>
                )}
              </div>
            </div>

            {companyData.employees.length === 0 ? (
              <div className="text-secondary">No employees yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {filteredEmployees.map((employee) => (
                  <div key={employee._id} className="relative card p-5 flex flex-col gap-5 items-start group">
                    <div className="flex gap-2">
                      <div className="avatar">
                        <div className="w-20 rounded-full bg-primary bg-opacity-30">
                          {employee.photo ? (
                            <img src={employee.photo} alt={employee.name} />
                          ) : (
                            <UserCircleIcon className="size-20 text-secondary text-opacity-50" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{employee.name}</h2>
                        <p className="text-sm text-gray-500">{employee.designation}</p>
                        <p className="text-sm text-gray-500">
                          {"Joined on " +
                            new Date(employee.date_joining).toLocaleDateString('en-GB', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                        </p>
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
                        {role == "tenant" && (
                          <button
                            className="btn btn-error text-base-100"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              document.getElementById('terminate-modal').showModal();
                            }}
                          >
                            Terminate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SideDrawer>
    </Sidebar>
  );
};

export default Company;