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
    {
      bookingId: "awc",
      roomNo: "MS-224",
      company: "HexlerTech",
      status: "Pending",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
    },
    {
      bookingId: "a4c",
      roomNo: "MS-234",
      company: "HexlerTech",
      status: "Pending",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
    },
    {
      bookingId: "a1c",
      roomNo: "MS-444",
      company: "HexlerTech",
      status: "Pending",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
    },
    {
      bookingId: "a3c",
      roomNo: "MS-994",
      company: "HexlerTech",
      status: "Pending",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
    },
    {
      bookingId: "a9c",
      roomNo: "MS-214",
      company: "HexlerTech",
      status: "Pending",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
    },
    {
      bookingId: "ahc",
      roomNo: "MT-214",
      company: "HexlerTech",
      status: "Approved",
      date: "12/12/2021",
      time: "12:00 PM - 1:00 PM",
    },
    {
      bookingId: "abh",
      roomNo: "MS-334",
      company: "HexlerTech",
      status: "Unapproved",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
    },
    {
      bookingId: "abh",
      roomNo: "MS-334",
      company: "HexlerTech",
      status: "Unapproved",
      date: "12/13/2024",
      time: "11:00 PM - 1:00 AM",
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

  useEffect(() => {
    //Api call here to fetch data and populate the above states
    async function fetchData() {
      try {
        const response = await ReceptionistService.getDashboard();
        if (response.error) {
          console.error(response.error);
          return;
        }

        console.log("🚀 ~ fetchData ~ response", response.data.dashboard);
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
          company: booking.tenant_name || "Tennant",
          dateBooked: formatDate(booking.date_initiated).split(',')[0] +  formatDate(booking.date_initiated).split(',')[1],
          dateBooking: formatDate(booking.time_start).split(',')[0] + formatDate(booking.time_start).split(',')[1],
          time: `${new Date(booking.time_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.time_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          status: booking.status_booking.charAt(0).toUpperCase() + booking.status_booking.slice(1),
         })))

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
        className={`bg-base-100 mt-5  ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${
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
            <div className="flex-1 md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Complaint types legend & button*/}
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

              {/* Charts */}
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
