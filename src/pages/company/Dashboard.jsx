import React, { useState, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import Sidebar from '../../components/Sidebar';
import { getChartOptions, getPieChartOptions } from '../util/charts';
import { EyeIcon, SunIcon, MoonIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import ThemeControl from '../../components/ThemeControl';
import { ArrowTrendingUpIcon, BellAlertIcon, CheckBadgeIcon, InformationCircleIcon, PaperAirplaneIcon, QuestionMarkCircleIcon, TableCellsIcon, TicketIcon, UserGroupIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ComparativeChart from '../../components/ComparativeChart';
import NSTPLoader from '../../components/NSTPLoader';
import ReactApexChart from 'react-apexcharts';
import NewsFeed from '../../components/NewsFeed';
import EmployeeStats from '../../components/EmployeeStats';
import ComplaintModal from '../../components/ComplaintModal';
import EmployeeProfileModal from '../../components/EmployeeProfileModal';
//Categories of types of complaints
const CATEGORIES = ['General', 'Service'];
const chartIds = ["resolved-chart", "unresolved-chart", "received-chart"];
const chartKeys = ["resolved", "unresolved", "received"];


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  // **** data to be populated from backend ****
  const [chartData, setChartData] = useState({
    resolved: CATEGORIES.map(category => ({ name: category, value: Math.floor(Math.random() * 50) + 1 })),
    unresolved: CATEGORIES.map(category => ({ name: category, value: Math.floor(Math.random() * 50) + 1 })),
    received: CATEGORIES.map(category => ({ name: category, value: Math.floor(Math.random() * 50) + 1 }))
  });
  const [employeeTableData, setEmployeeTableData] = useState([
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
      "photo": "https://randomuser.me/api/portraits/men/25.jpg",
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
    "photo": "https://randomuser.me/api/portraits/women/25.jpg",
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

  ]);
  const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([
    { bookingId: "abc", roomNo: 'MT-234', status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
    { bookingId: "awc", roomNo: 'MS-234', status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
    { bookingId: "ahc", roomNo: 'MT-214', status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
    { bookingId: "abh", roomNo: 'MS-334', status: 'Unapproved', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
  ]);

  const [meetingToCancel, setMeetingToCancel] = useState();

  const [eTags, setETags] = useState({ issued: 10, pending: 20 }); //total = pending + approved
  const [gatePasses, setGatePasses] = useState({ issued: 28, pending: 3 }); //total = pending + approved
  const [employeeStats, setEmployeeStats] = useState({ total: 100, active: 80, issued: 10, unissued: 70 });
  const [internStats, setInternStats] = useState({ total: 12, nustian: 3, nonNustian: 9 });
  const [modalLoading, setModalLoading] = useState(false);
  const [employeeProfileSelected, setEmployeeProfileSelected] = useState(null);
  const [meetingCancellationReason, setMeetingCancellationReason] = useState("The meeting was not approved because the room was already booked for the same time slot.");
  // **** end of data to be populated from backend ****

  useEffect(() => {
    setLoading(true);
    //Add api call here to fetch data from backend and populate the states.
    //Simulate api call with timer to show loader.
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    // setLoading(false);
  }, []);

  useEffect(() => {
    // Render the charts
    const charts = [];

    chartKeys.forEach((key, index) => {
      const chartId = chartIds[index];
      if (document.getElementById(chartId) && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(document.getElementById(chartId), getChartOptions(chartData[key]));
        chart.render();
        charts.push(chart);
      }
    });

    // Cleanup function to destroy the charts
    return () => {
      charts.forEach(chart => chart.destroy());
    };
  }, [chartData]);

  const cancelMeeting = (meetingId) => {
    setModalLoading(true);
    // Simulate API call with timer
    setTimeout(() => {
      console.log(`Cancelling meeting with ID: ${meetingId}`);
      setModalLoading(false);
      document.getElementById('meeting_cancellation').close();
    }, 2000);
  };

  const fetchReasonForCancellation = (bookingId) => {
    setMeetingCancellationReason("Fetching reason for meeting cancellation...");
    document.getElementById('meeting_unapproved_reason').showModal();
    // Simulate API call with timer
    setTimeout(() => {
      document.getElementById('meeting_unapproved_reason').close();
      console.log("Fetching reason for meeting cancellation for booking ID: ", bookingId);
      setMeetingCancellationReason("The meeting was not approved because the room was already booked for the same time slot.");
      document.getElementById('meeting_unapproved_reason').showModal();
    }, 1000);
  };





  return (
    <Sidebar>
      {loading && <NSTPLoader />}

      <ComplaintModal />
      <EmployeeProfileModal employeeProfileSelected={employeeProfileSelected} />

      {/* modal with confirmation for meeting room cancellation */}
      <dialog
        id="meeting_cancellation"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to cancel this booking?
          </h3>
          <p className="py-4">Please click "Yes" if you wish to cancel it.</p>
          <div className="modal-action">
            <button
              className={`btn mr-2 ${modalLoading && "btn-disabled"}`}
              onClick={() => {
                setMeetingToCancel(null);
                document.getElementById("meeting_cancellation").close();
              }}
            >
              Close
            </button>
            <button
              className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
              onClick={() => cancelMeeting(meetingToCancel)}
            >
              {modalLoading && (
                <span className="loading loading-spinner"></span>
              )}
              {modalLoading ? "Please wait..." : "Confirm"}
            </button>
          </div>
        </div>
      </dialog>

      {/* modal with reason for unapproved meeting */}
      <dialog
        id="meeting_unapproved_reason"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">This meeting was not approved.</h3>
          <p className="py-4">{meetingCancellationReason}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Main page content */}
      <div
        className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${
          loading && "hidden"
        }`}
      >
        {/* Header (Title, toggles etc) */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold mb-5">Main Dashboard</h1>
          <div className="flex gap-3">
            <ThemeControl />
            <button className="btn btn-primary hover:text-white btn-outline rounded-full">
              <BellAlertIcon className="size-6" />
            </button>
            <button className="btn btn-primary hover:text-white btn-outline rounded-full">
              <QuestionMarkCircleIcon className="size-6" />
            </button>
          </div>
        </div>
        <hr className="my-5 text-gray-200"></hr>

        {/* First row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/* Complaints section charts */}
          <div className="md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Complaint types legend & button*/}
            <div className="bg-base-100 md:col-span-3 h-content rounded-md shadow-md border-t flex  flex-col lg:flex-row  lg:items-center justify-start lg:justify-between border-t-gray-200 dark:shadow-2xl dark:border-none p-5">
              <div className="flex flex-col justify-center">
                <span className="font-bold">Complaint Types</span>
                <div className="flex flex-row gap-5">
                  {["bg-primary", "bg-secondary"].map((color, index) => (
                    <div className="flex flex-row gap-2 items-center">
                      <div className={`rounded-full ${color} size-4`}></div>
                      <span>{CATEGORIES[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className='max-md:mt-3 btn btn-primary text-white btn-md' onClick={() => document.getElementById('complaint_modal').showModal()}> 
                <PaperAirplaneIcon className="h-5 w-5" />
                Submit Complaint
              </button>
            </div>

            {/* Charts */}
            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 dark:shadow-2xl dark:border-none  p-3 flex flex-col items-center justify-center">
              <p className="font-semibold font-lg mb-3  text-center">
                Complaints Sent
              </p>
              <div id="received-chart"></div>
            </div>
            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 dark:shadow-2xl dark:border-none  p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
              <p className="font-semibold font-lg mb-3 text-center">
                Complaints Resolved
              </p>
              <div id="resolved-chart"></div>
            </div>
            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 dark:shadow-2xl dark:border-none  p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
              <p className="font-semibold font-lg mb-3 text-center">
                Complaints Unresolved
              </p>
              <div id="unresolved-chart"></div>
            </div>
          </div>

          {/* Table of employees info */}
          <div className="md:col-span-4 ">
            <div className=" bg-base-100 min-h-full rounded-md p-5 shadow-md  border-t border-t-gray-200 dark:shadow-2xl dark:border-none  ">
              <div className="w-full flex justify-between mb-3">
                <p className="mb-3 font-bold"> Employees</p>
                <Link to="/company/employees">
                  <button className="btn btn-primary text-white btn-md">
                    <TableCellsIcon className="h-5 w-5" />
                    View All
                  </button>
                </Link>
              </div>

              {employeeTableData.length == 0 ? (
                <p className="text-gray-500">No data to show for now.</p>
              ) : (
                <div className="h-full max-h-80 overflow-y-auto">
                  <table className="table  ">
                    <tbody>
                      {/* row 1 (header row) */}
                      <tr className="bg-base-200">
                        <th></th>
                        <td>Name</td>
                        <td>E-mail</td>
                        <td>Designation</td>
                        <td>Date of Joining</td>
                      </tr>
                      {/* Render table rows dynamically */}
                      {employeeTableData.map((row, index) => (
                        <tr key={row.id} className="relative group">
                          <th>{index + 1}</th>
                          <td>{row.name}</td>
                          <td>{row.email}</td>
                          <td>{row.designation}</td>
                          <td>{row.date_joining}</td>
                          <div className="absolute inset-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="btn btn-ghost w-full backdrop-blur-sm "
                              onClick={() =>  {setEmployeeProfileSelected(row); document.getElementById('employee_profile').showModal()}}
                            >
                              <EyeIcon className="h-5 w-5" />
                              <span>{"View " + row.name + "'s profile"}</span>
                            </button>
                          </div>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second row */}
        <div className="mt-2 lg:mt-5 grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/* Meeting room schedule table */}
          <div className="col-span-4 my-3">
            <div className=" bg-base-100 min-h-full   p-5 rounded-md shadow-md border-t border-t-gray-200 dark:shadow-2xl dark:border-none  ">
              <p className="mb-3 font-bold"> Meeting Room Schedule</p>

              <div className="max-h-80 overflow-y-auto bg-base-100">
                {meetingRoomSchedule.length == 0 ? (
                  <p className="text-gray-500">No data to show for now.</p>
                ) : (
                  <table className="table ">
                    <tbody>
                      {/* row 1 (header row) */}
                      <tr className="bg-base-200">
                        <th>Room</th>
                        <td>Status</td>
                        <td>Date</td>
                        <td>Time</td>
                        <td>Actions</td>
                      </tr>
                      {/* Render table rows dynamically */}
                      {meetingRoomSchedule.map((row, index) => (
                        <tr key={row.id} className="relative group">
                          <th>{row.roomNo}</th>
                          <td>
                            <div
                              className={` rounded-md text-center p-1 ${
                                row.status == "Approved"
                                  ? "bg-lime-200 text-lime-900"
                                  : row.status == "Unapproved"
                                  ? "bg-red-300 text-red-800"
                                  : "bg-yellow-100 text-yellow-700"
                              } `}
                            >
                              {row.status}
                            </div>
                          </td>
                          <td>{row.date}</td>
                          <td>{row.time}</td>
                          <td>
                            {row.status == "Pending" ? (
                              <button
                                className="btn btn-sm btn-outline btn-error"
                                onClick={() => {
                                  document
                                    .getElementById("meeting_cancellation")
                                    .showModal();
                                }}
                              >
                                <XCircleIcon className="h-5 w-5" />
                                Cancel
                              </button>
                            ) : row.status == "Unapproved" ? (
                              <button
                                className="btn btn-sm btn-outline btn-neutral"
                                onClick={() => {
                                  fetchReasonForCancellation(row.bookingId);
                                }}
                              >
                                <InformationCircleIcon className="h-5 w-5" />
                                Reason
                              </button>
                            ) : (
                              <></>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Charts of e-tags and gate passes */}
          <div className="col-span-3 my-3 flex flex-col gap-4">
            <div className="bg-base-100 rounded-md shadow-md border-t  border-t-gray-200 dark:shadow-2xl dark:border-none  p-5">
              <ComparativeChart title="Parking E-tags" comparisonData={eTags} />
            </div>

            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200  dark:shadow-2xl dark:border-none  p-5">
              <ComparativeChart
                title="Gate Passes"
                comparisonData={gatePasses}
              />
            </div>
          </div>
        </div>

        {/* Third row */}
        <div className="mt-2 lg:mt-5 grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/* Stats section */}
          <div className="flex flex-col gap-4 col-span-1 lg:col-span-3 min-h-full">
            {/* Employee stats */}
            <EmployeeStats
              total={employeeStats.total}
              active={employeeStats.active}
              cardsNotIssued={employeeStats.unissued}
              cardsIssued={employeeStats.issued}
            />

            {/* Intern stats */}
            <div className="mt-2 bg-base-100 rounded-md shadow-md border-t border-t-gray-200 dark:shadow-2xl dark:border-none  p-5 flex flex-row justify-between items-start">
              <div>
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  <UserGroupIcon className="size-7" /> {internStats.total}
                </span>
                <p className="mb-3 mt-1 font-bold"> Internees </p>

                <div className="mb-2 p-2 rounded-md bg-accent text-white">
                  {internStats.nustian + " NUSTians"}
                </div>
                <div className="p-2 rounded-md bg-primary text-white">
                  {internStats.nonNustian + " Non NUSTians"}
                </div>
              </div>
              <div id="pie-chart">
                <ReactApexChart
                  options={getPieChartOptions(internStats)}
                  series={getPieChartOptions(internStats).series}
                  type="pie"
                  height={220}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <NewsFeed />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};





export default Dashboard;