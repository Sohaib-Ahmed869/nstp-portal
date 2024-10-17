import React, { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Sidebar from '../../components/Sidebar';
import MeetingRoomBookingTable from '../../components/MeetingRoomBookingTable';
import NSTPLoader from '../../components/NSTPLoader';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CalendarDateRangeIcon } from '@heroicons/react/20/solid';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { ReceptionistService } from '../../services';
import { formatDate } from '../../util/date'



const MeetingRoomBooking = () => {
    //these events are approved meetings with respect to a particular room
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('1');
    const [roomOptions, setRoomOptions] = useState([
        { value: '1', label: 'Meeting Room 1' }, //value == room id
    ]);
    //this is the overall schedule of all requests for rooms which may be pending or approved or unapproved
    const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([]);
    const localizer = momentLocalizer(moment);

    useEffect(() => {
        //Api call here to fetch data and populate the above states initially
        async function fetchData() {
            try {
                const roomsResponse = await ReceptionistService.getRooms();
                console.log(roomsResponse);
                if (roomsResponse.error) {
                    console.log("Error fetching rooms: ", roomsResponse.error);
                    return;
                }

                console.log("Rooms: ", roomsResponse.data.rooms);
                const mappedRooms = roomsResponse.data.rooms.map(room => ({
                    value: room._id,
                    label: room.name,
                }));

                setRoomOptions(mappedRooms);
                setSelectedRoom(mappedRooms[0].value);
                //other fields include floor, time_end, time_start (both in 24hr), type id

                const bookingsResponse = await ReceptionistService.getRoomBookings();
                console.log(bookingsResponse);
                if (bookingsResponse.error) {
                    console.log("Error fetching room bookings: ", bookingsResponse.error);
                    return;
                }
                console.log("Room bookings: ", bookingsResponse.data.bookings);

                const mappedBookings = bookingsResponse.data.bookings.map(booking => {
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
                        company: booking.tenant_name || "Tennant", //musa return this
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
                setMeetingRoomSchedule(mappedBookings);
            } catch (error) {
                console.log("Error fetching room bookings: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        setCalendarLoading(true)
        console.log("Selected room: ", selectedRoom);

        //out of meeting room schedule get those rooms whose roomId == selectedRoom
        const thisRoomBookings = meetingRoomSchedule.filter(booking => booking.roomId === selectedRoom);
        console.log("THIS room's bookings", thisRoomBookings);

        //get the approved bookings only
        const approvedBookings = thisRoomBookings.filter(booking => booking.status === 'Approved').map(booking => {
            const startTime = new Date(booking.time_start);
            const endTime = new Date(booking.time_end);

            return {
                title: booking.tenant_name || "Tennant",
                start: startTime,
                end: endTime,
            };
        });

        console.log("setting events", approvedBookings);
        setEvents(approvedBookings);

        setTimeout(() => {
            setCalendarLoading(false);
        }, 1000);

    }, [selectedRoom]);


    const handleRoomChange = (e) => {
        setSelectedRoom(e.target.value);
    };


    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            <div className={`bg-base-100 mt-5  ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>

                {/* Header (Title, toggles etc) */}
                <div className="flex items-center mb-5 gap-3">
                    <PresentationChartLineIcon className="size-11 text-primary" />
                    <h1 className='text-2xl font-semibold '>Meeting Room Booking Schedule</h1>
                </div>
                <hr className="my-5 text-gray-200"></hr>

                <div className='bg-primary rounded-lg bg-opacity-35 p-5  flex flex-col lg:flex-row lg:justify-between mb-3'>
                    <div className='flex gap-2 items-center max-sm:mb-6'>
                        <CalendarDateRangeIcon className="size-11 text-secondary" />
                        <p className=" text-xl font-bold">Meeting room Calendar</p>
                    </div>

                    <div className="flex lg:justify-end gap-3 lg:w-1/3 mb-5 lg:mb-0 lg:items-end">
                        <p className="mb-3 font-bold">Schedule for</p>
                        {/* Dropdown to select the room */}
                        <select className="select select-bordered w-3/4" value={selectedRoom} onChange={handleRoomChange}>
                            {roomOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div >

                {/* Meeting room booking calednar */}
                {calendarLoading ? (
                    <div className="w-full h-[600px] flex items-center justify-center">
                        <span className="loading loading-spinner"> </span>
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

                <div className='bg-primary rounded-lg bg-opacity-35 p-5 mt-5  flex flex-col lg:flex-row lg:justify-between mb-3'>
                    <div className='flex gap-2 items-center max-sm:mb-6 '>
                        <CalendarDateRangeIcon className="size-11 text-secondary" />
                        <p className=" text-xl font-bold">Manage Booking Requests</p>
                    </div>
                </div >
                <MeetingRoomBookingTable meetingRoomSchedule={meetingRoomSchedule} role={"receptionist"} setMeetingRoomSchedule={setMeetingRoomSchedule} />

            </div>
        </Sidebar>


    )
}

export default MeetingRoomBooking
