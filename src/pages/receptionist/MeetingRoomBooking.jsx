import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
const localizer = momentLocalizer(moment);
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDateRangeIcon } from '@heroicons/react/20/solid';
import MeetingRoomBookingTable from '../../components/MeetingRoomBookingTable';

const MeetingRoomBooking = () => {

    //these events are approved meetings with respect to a particular room
    const [events, setEvents] = useState([
        { title: 'Hexler', start: new Date(2024, 8, 1, 10, 0), end: new Date(2024, 8, 1, 12, 0) },
        { title: 'InnoTech', start: new Date(2024, 8, 5, 14, 0), end: new Date(2024, 8, 5, 15, 0) },
        { title: 'PinkFly', start: new Date(2024, 9, 11, 14, 0), end: new Date(2024, 9, 11, 15, 0) },
        { title: 'Zanbeel', start: new Date(2024, 8, 7, 14, 0), end: new Date(2024, 8, 7, 15, 0) },
        { title: 'Vyro', start: new Date(2024, 9, 12, 9, 0), end: new Date(2024, 9, 12, 10, 0) },
    ]);
    const [loading, setLoading] = useState(true);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('1');
    const [roomOptions, setRoomOptions] = useState([
        { value: '1', label: 'Meeting Room 1' }, //value == room id
        { value: '2', label: 'Meeting Room 2' },
        { value: '3', label: 'Meeting Room 3' },
        { value: '4', label: 'Auditorium 1' },
        { value: '5', label: 'Auditorium 2' },
    ]);

    //this is the overall schedule of all requests for rooms which may be pending or approved or unapproved
    const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([
        { bookingId: "1", roomNo: 'MT-234', company: 'HexlerTech',status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
        { bookingId: "2", roomNo: 'MS-224', company: 'HexlerTech',status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
        { bookingId: "3", roomNo: 'MS-234', company: 'HexlerTech',status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
        { bookingId: "5", roomNo: 'MS-444', company: 'InnoSolution',status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
        { bookingId: "6", roomNo: 'MS-994', company: 'HexlerTech',status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
        { bookingId: "7c", roomNo: 'MS-214', company: 'PinkFly',status: 'Pending', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
        { bookingId: "8", roomNo: 'MT-214', company: 'Zambeel Tecch',status: 'Approved', date: '12/12/2021', time: '12:00 PM - 1:00 PM' },
        { bookingId: "9h", roomNo: 'MS-334', company: 'HexlerTech',status: 'Unapproved', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
        { bookingId: "10", roomNo: 'MS-334', company: 'HexlerTech',status: 'Unapproved', date: '12/13/2024', time: '11:00 PM - 1:00 AM' },
      
    ]);

    useEffect(() => {
        //Api call here to fetch data and populate the above states initially
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    useEffect(() => {

        console.log("Selected room: ", selectedRoom);
        // Simulate an API call to fetch events for the selected room
        // selectedRoom state can be used in api call
        const fetchEvents = async () => {
            setCalendarLoading(true);
            // Simulate API call delay
            setTimeout(() => {
                const fetchedEvents = [
                    { title: 'Hexler', start: new Date(2024, 8, 1, 10, 0), end: new Date(2024, 8, 1, 12, 0) },
                    { title: 'InnoTech', start: new Date(2024, 8, 5, 14, 0), end: new Date(2024, 8, 5, 15, 0) },
                    { title: 'PinkFly', start: new Date(2024, 9, 11, 14, 0), end: new Date(2024, 9, 11, 15, 0) },
                    { title: 'Zanbeel', start: new Date(2024, 8, 7, 14, 0), end: new Date(2024, 8, 7, 15, 0) },
                    { title: 'Vyro', start: new Date(2024, 9, 12, 9, 0), end: new Date(2024, 9, 12, 10, 0) },
                ];
                setEvents(fetchedEvents);
                setCalendarLoading(false);
            }, 2000);
        };

        fetchEvents();
    }, [selectedRoom]);


    const handleRoomChange = (e) => {
        setSelectedRoom(e.target.value);
    };


    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            <div className={`bg-base-100 mt-5  ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>

                {/* Header (Title, toggles etc) */}
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-semibold mb-5 '>Meeting Room Booking Schedule</h1>

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
                                    <MeetingRoomBookingTable  meetingRoomSchedule={meetingRoomSchedule} role={"receptionist"} />

            </div>
        </Sidebar>


    )
}

export default MeetingRoomBooking
