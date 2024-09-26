import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
const localizer = momentLocalizer(moment);
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDateRangeIcon, PlusCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import MeetingRoomBookingTable from '../../components/MeetingRoomBookingTable';

export const MeetingRoomBooking = () => {
    const [events, setEvents] = useState([
        { title: 'Booked', start: new Date(2024, 8, 1, 10, 0), end: new Date(2024, 8, 1, 12, 0) },
        { title: 'Booked', start: new Date(2024, 8, 5, 14, 0), end: new Date(2024, 8, 5, 15, 0) },
        { title: 'Booked', start: new Date(2024, 9, 11, 14, 0), end: new Date(2024, 9, 11, 15, 0) },
        { title: 'Booked', start: new Date(2024, 8, 7, 14, 0), end: new Date(2024, 8, 7, 15, 0) },
        { title: 'Booked', start: new Date(2024, 9, 12, 9, 0), end: new Date(2024, 9, 12, 10, 0) },
    ]);
    const [loading, setLoading] = useState(true);
    const [calendarLoading, setCalendarLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState('1');
    const [roomOptions, setRoomOptions] = useState([
        { value: '1', label: 'Meeting Room 1' },
        { value: '2', label: 'Meeting Room 2' },
        { value: '3', label: 'Meeting Room 3' },
        { value: '4', label: 'Auditorium 1' },
        { value: '5', label: 'Auditorium 2' },
    ]);

    const [meetingRoomSchedule, setMeetingRoomSchedule] = useState([
        { bookingId: "1", roomNo: 'MT-234', status: 'Approved', date: '12/12/2024', time: '12:00 PM - 1:00 PM' },
        { bookingId: "2", roomNo: 'MS-224', status: 'Pending', date: '12/13/2024', time: '11:00 AM - 12:00 PM' },
        { bookingId: "3", roomNo: 'MS-234', status: 'Pending', date: '12/14/2024', time: '2:00 PM - 3:00 PM' },
        { bookingId: "4", roomNo: 'MS-444', status: 'Approved', date: '12/15/2024', time: '10:00 AM - 11:00 AM' },
        { bookingId: "5", roomNo: 'MS-994', status: 'Unapproved', date: '12/16/2024', time: '3:00 PM - 4:00 PM' },
    ]);

    const [modalLoading, setModalLoading] = useState(false);
    const [meetingToCancel, setMeetingToCancel] = useState(null);
    const [meetingCancellationReason, setMeetingCancellationReason] = useState("");
    const [newBooking, setNewBooking] = useState({ date: '', startTime: '', endTime: '', roomId: '' });

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            setCalendarLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        console.log("Selected room: ", selectedRoom);
        setCalendarLoading(true);
        setTimeout(() => {
            const fetchedEvents = [
                { title: 'Booked 1:00PM', start: new Date(2024, 8, 1, 10, 0), end: new Date(2024, 8, 1, 12, 0) },
                { title: 'Booked', start: new Date(2024, 8, 5, 14, 0), end: new Date(2024, 8, 5, 15, 0) },
                { title: 'Booked', start: new Date(2024, 9, 11, 14, 0), end: new Date(2024, 9, 11, 15, 0) },
                { title: 'Booked', start: new Date(2024, 8, 7, 14, 0), end: new Date(2024, 8, 7, 15, 0) },
                { title: 'Booked', start: new Date(2024, 9, 12, 9, 0), end: new Date(2024, 9, 12, 10, 0) },
            ];
            setEvents(fetchedEvents);
            setCalendarLoading(false);
        }, 1000);
    }, [selectedRoom]);

    const handleRoomChange = (e) => {
        setSelectedRoom(e.target.value);
    };

    const cancelMeeting = (meetingId) => {
        setModalLoading(true);
        setTimeout(() => {
            console.log(`Cancelling meeting with ID: ${meetingId}`);
            setMeetingRoomSchedule(prevSchedule =>
                prevSchedule.filter(meeting => meeting.bookingId !== meetingId)
            );
            setModalLoading(false);
            document.getElementById('meeting_cancellation').close();
        }, 2000);
    };

    const fetchReasonForCancellation = (bookingId) => {
        setMeetingCancellationReason("Fetching reason for meeting cancellation...");
        document.getElementById('meeting_unapproved_reason').showModal();
        setTimeout(() => {
            setMeetingCancellationReason("The meeting was not approved because the room was already booked for the requested time slot.");
        }, 1000);
    };

    const handleNewBookingChange = (e) => {
        setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
    };

    const submitNewBooking = () => {
        setModalLoading(true);
        setTimeout(() => {
            console.log("Submitting new booking:", newBooking);
            const newMeeting = {
                bookingId: String(meetingRoomSchedule.length + 1),
                roomNo: `MR-${newBooking.roomId}`,
                status: 'Pending',
                date: newBooking.date,
                time: `${newBooking.startTime} - ${newBooking.endTime}`
            };
            setMeetingRoomSchedule(prevSchedule => [...prevSchedule, newMeeting]);
            setModalLoading(false);
            document.getElementById('new_booking_modal').close();
            setNewBooking({ date: '', startTime: '', endTime: '', roomId: '' });
        }, 2000);
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            <div className={`bg-base-100 mt-5 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
                <div className="flex items-center justify-between">
                    <h1 className='text-2xl font-semibold mb-5'>Meeting Room Booking Schedule</h1>
                </div>
                <hr className="my-5 text-gray-200" />

                <div className='bg-primary rounded-lg bg-opacity-35 p-5 flex flex-col lg:flex-row lg:justify-between mb-3'>
                    <div className='flex gap-2 items-center max-sm:mb-6'>
                        <CalendarDateRangeIcon className="size-11 text-secondary" />
                        <p className="text-xl font-bold">Meeting Room Calendar</p>
                    </div>

                    <div className="flex lg:justify-end gap-3 lg:w-1/3 mb-5 lg:mb-0 lg:items-end">
                        <p className="mb-3 font-bold">Schedule for</p>
                        <select className="select select-bordered w-3/4" value={selectedRoom} onChange={handleRoomChange}>
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

                <div className='bg-primary rounded-lg bg-opacity-35 p-5 mt-5 flex flex-col lg:flex-row lg:justify-between mb-3'>
                    <div className='flex gap-2 items-center max-sm:mb-6'>
                        <CalendarDateRangeIcon className="size-11 text-secondary" />
                        <p className="text-xl font-bold">Your Booking Requests</p>
                    </div>
                    <button className="btn btn-secondary text-white" onClick={() => document.getElementById('new_booking_modal').showModal()}>
                        <PlusCircleIcon className="size-6" /> New Booking
                    </button>
                </div>

                <MeetingRoomBookingTable
                    meetingRoomSchedule={meetingRoomSchedule}
                    role="company"
                />
            </div>

            {/* Modal for meeting cancellation */}
            <dialog id="meeting_cancellation" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Are you sure you want to cancel this booking?</h3>
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
                            onClick={() => { cancelMeeting(meetingToCancel) }}
                        >
                            {modalLoading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            {modalLoading ? "Please wait..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Modal for unapproved meeting reason */}
            <dialog id="meeting_unapproved_reason" className="modal modal-bottom sm:modal-middle">
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

            {/* Modal for new booking */}
            <dialog id="new_booking_modal" className="modal modal-bottom sm:modal-middle">
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
                        <button className="btn" onClick={() => document.getElementById('new_booking_modal').close()}>Close</button>
                        <button
                            className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
                            onClick={submitNewBooking}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>
        </Sidebar>
    );
};

export default MeetingRoomBooking;