import { useState } from 'react'
import LoginPage from '/src/pages/LoginPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'; 
import AdminHome from '/src/pages/admin/AdminHome.jsx';
import CompanyAddition from '/src/pages/admin/CompanyAddition.jsx';
import Dashboard from './pages/company/Dashboard.jsx';
import Employees from './pages/company/Employees.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Companies from './pages/admin/Companies.jsx';
import Company from './pages/admin/Company.jsx';
import Complaints from './pages/company/Complaints.jsx';
import GatePasses from './pages/company/GatePasses.jsx';
import { Complaints as ReceptionistComplaints } from './pages/receptionist/Complaints.jsx';
import { Dashboard as ReceptionistDashboard } from './pages/receptionist/Dashboard.jsx';
import MeetingRoomBooking from './pages/receptionist/MeetingRoomBooking.jsx';
import Etags from './pages/admin/Etags.jsx';
import CardRequests from './pages/admin/CardRequests.jsx';
import Services from './pages/admin/Services.jsx';
import MeetingRooms from './pages/admin/MeetingRooms.jsx';
import {MeetingRoomBooking as AdminMeetingRoomBooking } from './pages/admin/MeetingRoomBooking.jsx';
import {MeetingRoomBooking as CompanyMeetingRoomBooking } from './pages/company/MeetingRoomBooking.jsx';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/">
        <Route index element={<LoginPage />} />
        <Route path="admin">
          <Route index element={<AdminHome />} />
          <Route path="add-company" element={<CompanyAddition />} />
          <Route path="companies" element={<Companies />} />
          <Route path="etags" element={<Etags />} />          
          <Route path="services" element={<Services />} />          
          <Route path="meeting-rooms" element={<MeetingRooms />} />
          <Route path='bookings' element={<AdminMeetingRoomBooking />} />       
          <Route path="cards" element={<CardRequests />} />
          <Route path="companies/:companyId" element={<Company />} />
        </Route>

        <Route path="company">
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="gate-passes" element={<GatePasses />} />
          <Route path="bookings" element={<CompanyMeetingRoomBooking />} />
        </Route>

        <Route path="receptionist">
          <Route index element={<ReceptionistDashboard />} />
          <Route path="complaints" element={<ReceptionistComplaints />} />
          <Route path="bookings" element={<MeetingRoomBooking />} />
        </Route>
      
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  </Router>
  )
}

export default App
