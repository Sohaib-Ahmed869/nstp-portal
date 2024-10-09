import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
const localizer = momentLocalizer(moment);
import Sidebar from "../../components/Sidebar";
import NSTPLoader from "../../components/NSTPLoader";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  CalendarDateRangeIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import MeetingRoomBookingTable from "../../components/MeetingRoomBookingTable";
import { TenantService } from "../../services";
import { formatDate } from '../../util/date';
import showToast from "../../util/toast";

export const MeetingRoomBooking = () => {
    const [events, setEvents] = useState([
    //    { title: 'Booked', start: new Date(2024, 8, 1, 10, 0), end: new Date(2024, 8, 1, 12, 0) },
    ]);
    const [loading, setLoading] = useState(true);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('1');
    const [roomOptions, setRoomOptions] = useState([
    //    { value: '1', label: 'Meeting Room 1' }  
    ]);

    const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([
     //   { bookingId: "1", roomNo: 'MT-234', status: 'Approved', date: '12/12/2024', time: '12:00 PM - 1:00 PM' },
      ]);

  const [modalLoading, setModalLoading] = useState(false);
  const [meetingToCancel, setMeetingToCancel] = useState(null);
  const [allBookings, setAllBookings] =
    useState([]);
  const [newBooking, setNewBooking] = useState({
    date: "",
    startTime: "",
    endTime: "",
    roomId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const roomsResponse = await TenantService.getRooms();
        if (roomsResponse.error) {
          console.log(roomsResponse.message);
          return;
        }
        console.log("Rooms: ", roomsResponse.data.rooms);

                const mappedRooms = roomsResponse.data.rooms.map(room => ({
                    value: room._id,
                    label: room.name,
                }));

                setRoomOptions(mappedRooms);
                setSelectedRoom(mappedRooms[0].value);
                console.log("set selected room to" , mappedRooms[0].value);

                const allBookings = await TenantService.getAllRoomBookings();
                if(allBookings.error) {
                    console.log(allBookings.message);
                    return;
                }
                console.log("All bookings: ", allBookings.data.bookings);
                

                // mapping all bookings to the right format
                const mappedBookings = allBookings.data.bookings.map(booking => {
                    const startTime = new Date(booking.time_start);
                    const endTime = new Date(booking.time_end);

                    console.log("booking time start: ", startTime);
                    console.log("booking time end: ", endTime);

                    const formatTime = (date) => {
                        const hours = date.getHours().toString().padStart(2, '0'); // Use getHours for local time
                        const minutes = date.getMinutes().toString().padStart(2, '0'); // Use getMinutes for local time
                        return `${hours}:${minutes}`;
                    };

                    const formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
                    const dateBooking = startTime.toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format

                    console.log("formatted time: ", formattedTime);
                    console.log("date booking: ", dateBooking);
                
                    return {
                        bookingId: booking._id,
                        roomNo: booking.room_name || "Room",  //musa return this
                        company: booking.tenant_name || "Booked", //musa return this
                        companyId: booking.tenant_id,
                        roomId: booking.room_id,
                        time_start: booking.time_start,
                        time_end: booking.time_end,
                        status: booking.status_booking.charAt(0).toUpperCase() + booking.status_booking.slice(1),
                        dateBooked: formatDate(booking.date_initiated),
                        time: formattedTime,
                        dateBooking: dateBooking,
                    };
                });
                console.log("mapped bookings, ", mappedBookings);
                setAllBookings(mappedBookings); 
                
                const tenantBookingsResponse = await TenantService.getRoomBookings();
                if(tenantBookingsResponse.error) {
                    console.log(tenantBookingsResponse.message);
                    return;
                }
                console.log("!!! Bookings: ", tenantBookingsResponse.data.bookings);
                     //   { bookingId: "1", roomNo: 'MT-234', status: 'Approved', date: '12/12/2024', time: '12:00 PM - 1:00 PM' },
                const mappedTenantBookings = tenantBookingsResponse.data.bookings.map(booking => {
                    const startTime = new Date(booking.time_start);
                    const endTime = new Date(booking.time_end);

                    console.log("booking time start: ", startTime);
                    console.log("booking time end: ", endTime);

                    const formatTime = (date) => {
                        const hours = date.getHours().toString().padStart(2, '0'); // Use getHours for local time
                        const minutes = date.getMinutes().toString().padStart(2, '0'); // Use getMinutes for local time
                        return `${hours}:${minutes}`;
                    };

                    const formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
                    const dateBooking = startTime.toISOString().split('T')[0]; // Extract date in YYYY-MM-DD format

                    console.log("formatted time: ", formattedTime);
                    console.log("date booking: ", dateBooking);
                
                    return {
                        bookingId: booking._id,
                        roomNo: booking.room_name || "Room",  //musa return this
                        company: booking.tenant_name || "Self", //musa return this
                        companyId: booking.tenant_id,
                        roomId: booking.room_id,
                        time_start: booking.time_start,
                        time_end: booking.time_end,
                        reasonDecline: booking.reason_decline,
                        status: booking.status_booking.charAt(0).toUpperCase() + booking.status_booking.slice(1),
                        dateBooked: formatDate(booking.date_initiated),
                        time: formattedTime,
                        dateBooking: dateBooking,
                    };
                });
                console.log("!!! mapped tenant bookings", mappedTenantBookings);
                setMeetingRoomSchedule(mappedTenantBookings);
                // set tenant bookings

            } catch (error) {
                console.log("Error fetching rooms: ", error);
            } finally {
                setLoading(false);
            }
            
        }

    fetchData();
  }, []);

    useEffect(() => {
        console.log("Selected room: ", selectedRoom);
        setCalendarLoading(true);
        
                //out of the mapped bookings, get the ones for the current room (room_id matches the selected room)
                const roomBookings = allBookings.filter(booking => booking.roomId === selectedRoom);
                console.log("THIS Room;s bookings: ", roomBookings);

                //getting the approved bookings out of the above room bookings (to dipslay in caldenar)
                const approvedBookings =roomBookings.filter(booking => booking.status === 'Approved').map(booking => {
                    const startTime = new Date(booking.time_start);
                    const endTime = new Date(booking.time_end);
                
                    return {
                        title: booking.tenant_name || "Booked",
                        start: startTime,
                        end: endTime,
                    };
                });

                console.log("setting the events to this : ", approvedBookings);

                setEvents(approvedBookings);
                

        setTimeout(() => {
            setCalendarLoading(false);
        }, 900);
    }, [selectedRoom]);

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

    const cancelMeeting = async (meetingId) => {
        setModalLoading(true);
        try{
          const response = await TenantService.cancelRoomBooking(meetingId);
          console.log(response);
          if (response.error) {
            console.log(response.message);
            showToast(false, response.message);
          }

          console.log("Meeting cancelled: ", response.data.booking);
          setMeetingRoomSchedule(prevSchedule =>
            prevSchedule.filter(meeting => meeting.bookingId !== meetingId)
          );
          
          showToast(true, response.message);

        } catch (error) {
          console.log("Error cancelling meeting: ", error);
        } finally {
          setModalLoading(false);
          document.getElementById('meeting_cancellation').close();
        }


        // setTimeout(() => {
        //     console.log(`Cancelling meeting with ID: ${meetingId}`);
        //     setMeetingRoomSchedule(prevSchedule =>
        //         prevSchedule.filter(meeting => meeting.bookingId !== meetingId)
        //     );
        //     setModalLoading(false);
        //     document.getElementById('meeting_cancellation').close();
        // }, 2000);
    };

  const handleNewBookingChange = (e) => {
    setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
  };

  const submitNewBooking = async () => {
    setModalLoading(true);

    try{
        const response = await TenantService.requestRoomBooking(newBooking);
        console.log(response);
        if (response.error) {
            console.log(response.message);
            showToast(false, response.message);
        }

        console.log("New booking submitted: ", response.data.booking);
        showToast(true, response.message);

    } catch (error) {
        console.log("Error submitting new booking: ", error);
    } finally {
        setModalLoading(false);
    }

    // setTimeout(() => {
    //     console.log("Submitting new booking:", newBooking);
    //     const newMeeting = {
    //         bookingId: String(meetingRoomSchedule.length + 1),
    //         roomNo: `MR-${newBooking.roomId}`,
    //         status: 'Pending',
    //         date: newBooking.date,
    //         time: `${newBooking.startTime} - ${newBooking.endTime}`
    //     };
    //     setMeetingRoomSchedule(prevSchedule => [...prevSchedule, newMeeting]);
    //     setModalLoading(false);
    //     document.getElementById('new_booking_modal').close();
    //     setNewBooking({ date: '', startTime: '', endTime: '', roomId: '' });
    // }, 2000);
  };

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div
        className={`bg-base-100 mt-5 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${
          loading && "hidden"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold mb-5">
            Meeting Room Booking Schedule
          </h1>
        </div>
        <hr className="my-5 text-gray-200" />

        <div className="bg-primary rounded-lg bg-opacity-35 p-5 flex flex-col lg:flex-row lg:justify-between mb-3">
          <div className="flex gap-2 items-center max-sm:mb-6">
            <CalendarDateRangeIcon className="size-11 text-secondary" />
            <p className="text-xl font-bold">Meeting Room Calendar</p>
          </div>

          <div className="flex lg:justify-end gap-3 lg:w-1/3 mb-5 lg:mb-0 lg:items-end">
            <p className="mb-3 font-bold">Schedule for</p>
            <select
              className="select select-bordered w-3/4"
              value={selectedRoom}
              onChange={handleRoomChange}
            >
              {roomOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {calendarLoading ? (
          <div className="w-full h-[600px] flex items-center justify-center">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
          />
        )}

        <div className="bg-primary rounded-lg bg-opacity-35 p-5 mt-5 flex flex-col lg:flex-row lg:justify-between mb-3">
          <div className="flex gap-2 items-center max-sm:mb-6">
            <CalendarDateRangeIcon className="size-11 text-secondary" />
            <p className="text-xl font-bold">Your Booking Requests</p>
          </div>
          <button
            className="btn btn-secondary text-white"
            onClick={() =>
              document.getElementById("new_booking_modal").showModal()
            }
          >
            <PlusCircleIcon className="size-6" /> New Booking
          </button>
        </div>

        <MeetingRoomBookingTable
          meetingRoomSchedule={meetingRoomSchedule}
          role="company"
        />
      </div>

        

      {/* Modal for new booking */}
      <dialog
        id="new_booking_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Booking Request</h3>
          <div className="py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={newBooking.date}
                onChange={handleNewBookingChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Start Time</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={newBooking.startTime}
                onChange={handleNewBookingChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">End Time</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={newBooking.endTime}
                onChange={handleNewBookingChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Room</span>
              </label>
              <select
                name="roomId"
                value={newBooking.roomId}
                onChange={handleNewBookingChange}
                className="select select-bordered w-full"
              >
                <option value="">Select a room</option>
                {roomOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                document.getElementById("new_booking_modal").close()
              }
            >
              Close
            </button>
            <button
              className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
              onClick={submitNewBooking}
            >
              {modalLoading && (
                <span className="loading loading-spinner"></span>
              )}
              {modalLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </dialog>
    </Sidebar>
  );
};

export default MeetingRoomBooking;
