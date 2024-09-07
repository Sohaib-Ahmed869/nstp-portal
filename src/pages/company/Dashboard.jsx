import React, { useState, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import Sidebar from '../../components/Sidebar';
import { getChartOptions, getPieChartOptions } from '../util/charts';
import { EyeIcon, SunIcon, MoonIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import ThemeControl from '../../components/ThemeControl';
import { ArrowTrendingUpIcon, BellAlertIcon, CheckBadgeIcon, InformationCircleIcon, QuestionMarkCircleIcon, TableCellsIcon, TicketIcon, UserGroupIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ComparativeChart from '../../components/ComparativeChart';
import NSTPLoader from '../../components/NSTPLoader';
import ReactApexChart from 'react-apexcharts';
import NewsFeed from '../../components/NewsFeed';

//Categories of types of complaints
const CATEGORIES = ['Direct', 'Sponsor', 'Affiliate', 'Email marketing'];
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
    { id: 1, name: 'Hart Hagerty', eTags: 'Desktop Support Technician', gateEntries: 'Purple', workPermit: 'Purple' },
    { id: 2, name: 'Brice Swyre', eTags: 'Tax Accountant', gateEntries: 'Red', workPermit: 'Purple' },
    { id: 3, name: 'Cherish Duffield', eTags: 'VP Accounting', gateEntries: 'Yellow', workPermit: 'Yellow' },
    { id: 4, name: 'Lorrie Gummow', eTags: 'Accountant', gateEntries: 'Green', workPermit: 'Green' },
    { id: 5, name: 'Lorrie Gummow', eTags: 'VP Quality Control', gateEntries: 'Green', workPermit: 'Green' },
    { id: 6, name: 'Eminen Shady', eTags: 'VP Quality', gateEntries: 'Green', workPermit: 'Green' },
    { id: 7, name: 'Lorrie Gummow', eTags: 'VP Quality Control', gateEntries: 'Green', workPermit: 'Green' },
    { id: 8, name: 'Eminen Shady', eTags: 'VP Quality', gateEntries: 'Green', workPermit: 'Green' },

  ]);
  const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([
    { roomNo: 'MT-234', status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
    { roomNo: 'MS-234', status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
    { roomNo: 'MT-214', status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
    { roomNo: 'MS-334', status: 'Unapproved', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
  ]);

  const [eTags, setETags] = useState({ issued: 10, pending: 20 }); //total = pending + approved
  const [gatePasses, setGatePasses] = useState({ issued: 28, pending: 3 }); //total = pending + approved

  const [employeeStats, setEmployeeStats] = useState({ total: 100, active: 80, issued: 10, unissued: 70 });
  const [internStats, setInternStats] = useState({ total: 12, nustian: 3, nonNustian: 9 });

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

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>

        {/* Header (Title, toggles etc) */}
        <div className="flex items-center justify-between">
          <h1 className='text-2xl font-semibold mb-5'>Main Dashboard</h1>
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

            {/* Complaint types legend */}
            <div className="bg-base-100 md:col-span-3 h-content rounded-md shadow-md border-t flex flex-col justify-center border-t-gray-200 p-5">
              <span className="font-bold">Complaint Types</span>
              <div className="flex flex-row gap-5">
                {
                  ["bg-primary", "bg-secondary", "bg-accent", "bg-info"].map((color, index) => (
                    <div className="flex flex-row gap-2 items-center">
                      <div className={`rounded-full ${color} size-4`}></div>
                      <span>{CATEGORIES[index]}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Charts */}
            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-3 flex flex-col items-center justify-center">
              <p className="font-semibold font-lg mb-3  text-center">Complaints Received</p>
              <div id="received-chart"></div>
            </div>
            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
              <p className="font-semibold font-lg mb-3 text-center">Complaints Resolved</p>
              <div id="resolved-chart"></div>
            </div>
            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
              <p className="font-semibold font-lg mb-3 text-center">Complaints Unresolved</p>
              <div id="unresolved-chart"></div>
            </div>

          </div>

          {/* Table of employees info */}
          <div className="md:col-span-4 ">
            <div className=" bg-base-100 min-h-full rounded-md p-5 shadow-md  border-t border-t-gray-200 ">
              <div className="w-full flex justify-between mb-3">
                <p className="mb-3 font-bold"> Employees</p>
                <Link to="/company/employees">
                  <button className="btn btn-primary text-white btn-md">
                    <TableCellsIcon className="h-5 w-5" />
                    View All
                  </button>
                </Link>
              </div>

              {employeeTableData.length == 0 ? <p className="text-gray-500">No data to show for now.</p> :
                <div className="h-full max-h-80 overflow-y-auto">
                  <table className="table  ">
                    <tbody>
                      {/* row 1 (header row) */}
                      <tr className="bg-base-200">
                        <th></th>
                        <td>Name</td>
                        <td>E-tags</td>
                        <td>Gate Entries</td>
                        <td>Work Permit</td>
                      </tr>
                      {/* Render table rows dynamically */}
                      {employeeTableData.map((row, index) => (
                        <tr key={row.id} className="relative group">
                          <th>{index + 1}</th>
                          <td>{row.name}</td>
                          <td>{row.eTags}</td>
                          <td>{row.gateEntries}</td>
                          <td>{row.workPermit}</td>
                          <div className="absolute inset-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/company/employees/${row.id}`} className="btn btn-ghost w-full backdrop-blur-sm ">
                              <EyeIcon className="h-5 w-5" />
                              <span>{"View " + row.name + "'s profile"}</span>
                            </Link>
                          </div>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Second row */}
        <div className="mt-2 lg:mt-5 grid grid-cols-1 gap-6 lg:grid-cols-7">

          {/* Meeting room schedule table */}
          <div className="col-span-4 my-3">
            <div className=" bg-base-100 min-h-full   p-5 rounded-md shadow-md border-t border-t-gray-200 ">
              <p className="mb-3 font-bold"> Meeting Room Schedule</p>

              <div className="max-h-80 overflow-y-auto bg-base-100">
                {meetingRoomSchedule.length == 0 ? <p className="text-gray-500">No data to show for now.</p> :
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
                            <div className={` rounded-md text-center p-1 ${row.status == "Approved" ? "bg-lime-200 text-lime-900" : row.status == "Unapproved" ? "bg-red-300 text-red-800" : "bg-yellow-100 text-yellow-700"} `}>{row.status}</div>
                          </td>
                          <td>{row.date}</td>
                          <td>{row.time}</td>
                          <td>
                            {row.status == "Pending" ?
                              <button className="btn btn-sm btn-outline btn-error">
                                <XCircleIcon className="h-5 w-5" />
                                Cancel
                              </button>
                              :
                              row.status == "Unapproved" ?
                                <button className="btn btn-sm btn-outline btn-neutral">
                                  <InformationCircleIcon className="h-5 w-5" />
                                  Reason
                                </button>
                                :
                                <></>}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>}
              </div>
            </div>
          </div>

          {/* Charts of e-tags and gate passes */}
          <div className="col-span-3 my-3 flex flex-col gap-4">
            <div className="bg-base-100 rounded-md shadow-md border-t  border-t-gray-200 p-5">
              <ComparativeChart title="Parking E-tags" comparisonData={eTags} />
            </div>

            <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5">
              <ComparativeChart title="Gate Passes" comparisonData={gatePasses} />
            </div>
          </div>
        </div>

        {/* Third row */}
        <div className="mt-2 lg:mt-5 grid grid-cols-1 gap-6 lg:grid-cols-7">

          {/* Stats section */}
          <div className="flex flex-col gap-4 col-span-1 lg:col-span-3 min-h-full">
            {/* Employee stats */}
            <div className=" bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5 flex flex-col ">
              <div className="flex flex-row justify-between">
                <div>
                  <span className="font-bold text-4xl flex flex-row items-center gap-2">
                    <UserGroupIcon className="size-7" /> {employeeStats.total}
                  </span>
                  <p className="mb-3 mt-1 font-bold"> Total Employees </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-bold text-4xl flex flex-row items-center gap-2">
                    {employeeStats.active}
                    <ArrowTrendingUpIcon className="size-7" />
                  </span>
                  <p className="mb-3 mt-1 font-bold"> Active Employees </p>
                </div>
              </div>

              <div className="flex rounded-2xl overflow-clip" >
                <div className="bg-red-100 p-5 flex flex-row justify-between w-1/2 text-red-900">
                  <div className="flex flex-col items-start">
                    <p className="font-bold text-2xl">{employeeStats.issued}</p>
                    <p className="text-sm">Cards not issued</p>
                  </div>
                  <TicketIcon className="h-10 w-10 text-red-900" />
                </div>
                <div className="bg-lime-100 p-5 flex flex-row justify-between w-1/2 text-green-900">
                  <CheckBadgeIcon className="h-10 w-10 text-green-900" />
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-2xl">{employeeStats.issued}</p>
                    <p className="text-sm"> Cards Issued</p>
                  </div>

                </div>
              </div>

            </div>

            {/* Intern stats */}
            <div className="mt-2 bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5 flex flex-row justify-between items-start">
              <div>
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  <UserGroupIcon className="size-7" /> {internStats.total}
                </span>
                <p className="mb-3 mt-1 font-bold"> Internees </p>

                <div className="mb-2 p-2 rounded-md bg-accent text-white">{internStats.nustian + " NUSTians"}</div>
                <div className="p-2 rounded-md bg-primary text-white">{internStats.nonNustian + " Non NUSTians"}</div>
              </div>
              <div id="pie-chart">
                <ReactApexChart options={getPieChartOptions(internStats)} series={getPieChartOptions(internStats).series} type="pie" height={220} />
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