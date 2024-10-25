import React, { useState, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import Sidebar from '../../components/Sidebar';
import { getChartOptions, getPieChartOptions } from '../../util/charts';
import { EyeIcon, SunIcon, MoonIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import ThemeControl from '../../components/ThemeControl';
import { BellAlertIcon, PaperAirplaneIcon, QuestionMarkCircleIcon, TableCellsIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import ComparativeChart from '../../components/ComparativeChart';
import MeetingRoomBookingTable from '../../components/MeetingRoomBookingTable';
import NSTPLoader from '../../components/NSTPLoader';
import ReactApexChart from 'react-apexcharts';
import NewsFeed from '../../components/NewsFeed';
import EmployeeStats from '../../components/EmployeeStats';
import ComplaintModal from '../../components/ComplaintModal';
import EmployeeProfileModal from '../../components/EmployeeProfileModal';
import { TenantService } from '../../services';
import { formatDate } from '../../util/date';

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
  const [employeeTableData, setEmployeeTableData] = useState([]);
  const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([]);
  const [eTags, setETags] = useState({ issued: 10, pending: 20 }); //total = pending + approved
  const [gatePasses, setGatePasses] = useState({ issued: 28, pending: 3 }); //total = pending + approved
  const [employeeStats, setEmployeeStats] = useState({ total: 100, active: 80, issued: 10, unissued: 70 });
  const [internStats, setInternStats] = useState({ total: 12, nustian: 3, nonNustian: 9 });
  const [employeeProfileSelected, setEmployeeProfileSelected] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([
    {
      id: 1,
      date: "October 7, 2024, 12:30 PM",
      //dateresolved will be null for pending complaints
      serviceType: "Plumbing",
      urgency: 2,
      isResolved: false, //will be false for pending
      daysPending: 3, //extra field to calculate, can be calculated on frotnend (dats since date )
    }
  ]);
  // **** end of data to be populated from backend ****

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await TenantService.getDashboard();
        if (response.error) {
          console.log("Error fetching data: ", response.error);
          return;
        }
        console.log("Dashboard data: ", response.data.dashboard);
        //map employeetabledata to all the same fields but just call the formatDate on the date_joinin
        const mappedEmpTableData = response.data.dashboard.employees.map(employee => ({
          ...employee,
          date_joining: formatDate(employee.date_joining),
        }));
        setEmployeeTableData(mappedEmpTableData);
        setEmployeeStats({
          total: response.data.dashboard.employeeData.total,
          active: response.data.dashboard.employeeData.active,
          issued: response.data.dashboard.cards.issued,
          unissued: response.data.dashboard.cards.notIssued,
        })
        setGatePasses({ issued: response.data.dashboard.gatePasses.issued, pending: response.data.dashboard.gatePasses.pending });
        setInternStats(response.data.dashboard.interns);
        console.log("!! setting intern stats to, ", response.data.dashboard.interns);
        setETags({ issued: response.data.dashboard.etags.issued, pending: response.data.dashboard.etags.pending });
        //POPULATE RECENT COMPLAINTS HERE, THE FORMAT IS SHOWN ABOVE WITH THE STATE
        //meeting room schedule format :    { bookingId: "abc", roomNo: 'MT-234', status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
        const mappedSchedule = response.data.dashboard.bookings.map(booking => {
          const startTime = new Date(booking.time_start);
          const endTime = new Date(booking.time_end);
          const formatTime = (date) => {
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          };
          const formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
          const dateBooking = startTime.toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format
          return {
            bookingId: booking._id,
            roomNo: booking.room_name || "Room",  //musa return this
            company: booking.tenant_id || "Tennant", //musa return this
            roomId: booking.room_id,
            time_start: booking.time_start,
            time_end: booking.time_end,
            status: booking.status_booking.charAt(0).toUpperCase() + booking.status_booking.slice(1),
            dateBooked: formatDate(booking.date_initiated),
            time: formattedTime,
            dateBooking: dateBooking,
          };
        });
        setMeetingRoomSchedule(mappedSchedule);

        // setChartData(response.data.complaints);
      } catch (error) {
        console.log("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <ComplaintModal />
      <EmployeeProfileModal employeeProfileSelected={employeeProfileSelected} />

      {/* Main page content */}
      <div
        className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"
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
          {/* Employee and intern stats cards  */}
          <div className="md:col-span-3 flex flex-col gap-4">
            {/* Employee stats */}
            <EmployeeStats
              total={employeeStats.total}
              active={employeeStats.active}
              cardsNotIssued={employeeStats.unissued}
              cardsIssued={employeeStats.issued}
            />

            {/* Intern stats */}
            <div className="mt-2 card p-5 flex flex-row justify-between items-start">
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

          {/* Table of employees info */}
          <div className="md:col-span-4 ">
            <div className=" card p-5 min-h-full ">
              <div className="w-full flex justify-between mb-3">
                <p className="mb-3 font-bold"> Employees</p>
                <Link to="/tenant/employees">
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
                              onClick={() => { setEmployeeProfileSelected(row); document.getElementById('employee_profile').showModal() }}
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
          <div className="col-span-4 card p-5 my-3">
            <MeetingRoomBookingTable
              meetingRoomSchedule={meetingRoomSchedule.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)}
              dashboardComponent={true}
            />
          </div>

          {/* Charts of e-tags and gate passes */}
          <div className="col-span-3 my-3 flex flex-col gap-4">
            <div className="card p-5">
              <ComparativeChart title="Parking E-tags" comparisonData={eTags} />
            </div>

            <div className="card p-5">
              <ComparativeChart
                title="Gate Passes"
                comparisonData={gatePasses}
                link={"gate-passes"}
              />
            </div>
          </div>
        </div>

        {/* Third row */}
        <div className="mt-2 lg:mt-5 grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/* Complaints section */}
          <div className="flex flex-col gap-4 col-span-1 lg:col-span-3 min-h-full">
            <div className="card p-5 h-full">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Recent Complaints</h1>
                <Link to="complaints" className=' btn btn-primary text-white btn-md'>
                  <TableCellsIcon className="h-5 w-5" />
                  View All
                </Link>

              </div>
              <table className="table w-full my-3">
                <tbody>
                  <tr className="bg-base-200">
                    <th>Date</th>
                    <th>Service Type</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Days Pending</th>
                  </tr>

                  {recentComplaints.map((complaint, index) => (
                    <tr key={complaint.id} className="group">
                      <td className="">{complaint.date}</td>
                      <td className="">{complaint.serviceType}</td>
                      <td className="flex items-center">
                        <div className={`badge text-base-100 ${complaint.urgency === 1 ? "badge-primary" : complaint.urgency === 2 ? "badge-secondary" : "badge-error"} flex items-center py-3`} >
                          {complaint.urgency === 1 ? "Low" : complaint.urgency === 2 ? "Med" : "High"}
                        </div>
                      </td>
                      <td className="">{complaint.isResolved ? "Resolved" : "Pending"}</td>
                      <td className="">{complaint.daysPending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/** News feed */}
          <div className="col-span-1 lg:col-span-4">
            <NewsFeed />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;



// {/* Complaint types legend & button*/}
// <div className="card p-5 md:col-span-3 h-content flex  flex-col lg:flex-row  lg:items-center justify-start lg:justify-between">
//   <div className="flex flex-col justify-center">
//     <span className="font-bold">Complaint Types</span>
//     <div className="flex flex-row gap-5">
//       {["bg-primary", "bg-secondary"].map((color, index) => (
//         <div className="flex flex-row gap-2 items-center">
//           <div className={`rounded-full ${color} size-4`}></div>
//           <span>{CATEGORIES[index]}</span>
//         </div>
//       ))}
//     </div>
//   </div>
//   <div className="flex gap-2 mt-3 lg:mt-0">
//     <button className=' btn btn-primary btn-outline hover:text-white text-white btn-md' onClick={() => document.getElementById('complaint_modal').showModal()}>
//       <PaperAirplaneIcon className="h-5 w-5" />
//       Send Complaint
//     </button>
//     <Link to="/tenant/complaints">
//       <button className='btn btn-primary text-white btn-md' >
//         <TableCellsIcon className="h-5 w-5" />
//         View All
//       </button>
//     </Link>
//   </div>
// </div>

// {/* Charts */}
// <div className="card p-3 flex flex-col items-center justify-center">
//   <p className="font-semibold font-lg mb-3  text-center">
//     Complaints Sent
//   </p>
//   <div id="received-chart"></div>
// </div>
// <div className="card p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
//   <p className="font-semibold font-lg mb-3 text-center">
//     Complaints Resolved
//   </p>
//   <div id="resolved-chart"></div>
// </div>
// <div className="card p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
//   <p className="font-semibold font-lg mb-3 text-center">
//     Complaints Unresolved
//   </p>
//   <div id="unresolved-chart"></div>
// </div>