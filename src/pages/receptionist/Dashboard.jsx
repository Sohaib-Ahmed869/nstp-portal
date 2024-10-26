import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import ComparativeChart from "../../components/ComparativeChart";
import NSTPLoader from "../../components/NSTPLoader";
import ThemeControl from "../../components/ThemeControl";
import {
  BellAlertIcon,
  CalendarDaysIcon,
  TableCellsIcon,
  QuestionMarkCircleIcon,
  TicketIcon,
  CheckBadgeIcon,
  DocumentCheckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  InboxArrowDownIcon,
  DocumentChartBarIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { getChartOptions } from "../../util/charts";
import MeetingRoomBookingTable from "../../components/MeetingRoomBookingTable";
import { ReceptionistService } from "../../services";
import { formatDate } from "../../util/date";

//Categories of types of complaints
const CATEGORIES = ["General", "Service"];
const chartIds = ["resolved-chart", "unresolved-chart", "received-chart"];
const chartKeys = ["resolved", "unresolved", "received"];

export const Dashboard = () => {
  // **** data to be populated from backend ****
  const [chartData, setChartData] = useState({
    resolved: CATEGORIES.map((category) => ({
      name: category,
      value: Math.floor(Math.random() * 50) + 1,
    })),
    unresolved: CATEGORIES.map((category) => ({
      name: category,
      value: Math.floor(Math.random() * 50) + 1,
    })),
    received: CATEGORIES.map((category) => ({
      name: category,
      value: Math.floor(Math.random() * 50) + 1,
    })),
  });

  const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([
    {
      bookingId: "abc",
      roomNo: "MT-234",
      company: "HexlerTech",
      status: "Approved",
      date: "12/12/2021",
      time: "12:00 PM - 1:00 PM",
    },
  ]);

  const [loading, setLoading] = useState(true);

  const [gateEntryStats, setGateEntryStats] = useState({
    completed: 53,
    pending: 15,
  });

  const [meetingRoomBookingStats, setMeetingRoomBookingStats] = useState({
    completed: 53,
    pending: 15,
  });
  const [complaintStats, setComplaintStats] = useState()

  useEffect(() => {
    //Api call here to fetch data and populate the above states
    async function fetchData() {
      try {
        const response = await ReceptionistService.getDashboard();
        if (response.error) {
          console.error(response.error);
          return;
        }

        console.log("🚀 ~ fetchData ~ response in receptionist dashboard ", response.data.dashboard);
        const dashboardData = response.data.dashboard;
        setGateEntryStats({
          completed: dashboardData.gatePasses.completed,
          pending: dashboardData.gatePasses.pending,
        });
        setMeetingRoomBookingStats({
          completed: dashboardData.bookings.completed,
          pending: dashboardData.bookings.pending,
        });
        setMeetingRoomSchedule(
          dashboardData.allBookings.map((booking) => ({
            bookingId: booking._id,
            roomNo: booking.room_name || "Room",
            company: booking.tenant_name || "Tenant",
            dateBooked: formatDate(booking.date_initiated).split(',')[0] + formatDate(booking.date_initiated).split(',')[1],
            dateBooking: formatDate(booking.time_start).split(',')[0] + formatDate(booking.time_start).split(',')[1],
            time: `${new Date(booking.time_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.time_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            status: booking.status_booking.charAt(0).toUpperCase() + booking.status_booking.slice(1),
          })))
        setComplaintStats(dashboardData.complaints)
      } catch (error) {
        console.error(error);
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
      if (
        document.getElementById(chartId) &&
        typeof ApexCharts !== "undefined"
      ) {
        const chart = new ApexCharts(
          document.getElementById(chartId),
          getChartOptions(chartData[key])
        );
        chart.render();
        charts.push(chart);
      }
    });

    // Cleanup function to destroy the charts
    return () => {
      charts.forEach((chart) => chart.destroy());
    };
  }, [chartData]);

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div
        className={`bg-base-100 mt-5  ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"
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
        <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-7">
          {/** gate entries + ccomplaints (left side) */}
          <div className=" lg:col-span-3 flex flex-col h-full gap-4">
            {/** gate entries */}
            <div className="card p-5">
              <ComparativeChart
                title={"Gate Entry"}
                comparisonData={gateEntryStats}
                link={"gate-passes"}
              />
            </div>

            {/* Complaints section charts */}
            <div className="flex-1 md:col-span-3 grid grid-cols-1 gap-4 ">
              <div className="card p-5">
                <div className="flex justify-between mb-2">
                  <p className="my-2 font-bold">Complaints Statistics</p>
                  <button className="btn btn-md text-base-100 btn-primary">
                    <TableCellsIcon className="h-5 w-5" />
                    View All
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="stat ring-1 rounded-2xl ring-base-200 ">
                    <div className="stat-figure text-secondary">
                      <ClipboardDocumentCheckIcon className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-value">{complaintStats?.resolved}</div>
                    <div className="stat-desc">Complaints Resolved </div>
                  </div>

                  <div className="stat ring-1 rounded-2xl ring-base-200 ">
                    <div className="stat-figure text-secondary">
                      <ClockIcon className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-value">{complaintStats?.unresolved}</div>
                    <div className="stat-desc">Complaints Unresolved </div>
                  </div>

                  <div className="stat ring-1 rounded-2xl ring-base-200 ">
                    <div className="stat-figure text-secondary">
                      <InboxArrowDownIcon className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-value">{complaintStats?.recieved}</div>
                    <div className="stat-desc">Complaints Recieved </div>
                  </div>

                  <div className="stat ring-1 rounded-2xl ring-base-200 ">
                    <div className="stat-figure text-secondary">
                      <DocumentChartBarIcon className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-value">{complaintStats?.mttr || "129"}</div>
                    <div className="stat-desc">Mean time to Repair </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/** Meeting room bookings */}
          <div className=" lg:col-span-4 ">
            <div className="card p-5 overflow-x-auto">
              <MeetingRoomBookingTable
                meetingRoomSchedule={meetingRoomSchedule
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)}
                role={"receptionist"}
                dashboardComponent={true}
              />
            </div>

            <div className="card p-5 mt-5">
              <ComparativeChart
                title={"Meeting Room Booking"}
                comparisonData={meetingRoomBookingStats}
                link={"bookings"}
              />
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Dashboard;


{/**
|--------------------------------------------------
| 

<div className="card p-5 md:col-span-3 h-contenet flex  flex-col lg:flex-row  lg:items-center justify-start lg:justify-between">
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
<div className="flex gap-2 mt-3 lg:mt-0">
  <Link to="complaints">
    <button className="btn btn-primary text-white btn-md">
      <TableCellsIcon className="h-5 w-5" />
      View All
    </button>
  </Link>
</div>
</div>

<div className="card flex-1 h-full p-3 flex flex-col items-center justify-center">
<p className="font-semibold font-lg mb-3  text-center">
  Complaints Sent
</p>
<div id="received-chart"></div>
</div>
<div className="card p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
<p className="font-semibold font-lg mb-3 text-center">
  Complaints Resolved
</p>
<div id="resolved-chart"></div>
</div>
<div className="card p-3 flex flex-col items-center justify-center mb-4 md:mb-0">
<p className="font-semibold font-lg mb-3 text-center">
  Complaints Unresolved
</p>
<div id="unresolved-chart"></div>
</div>
|--------------------------------------------------
*/}