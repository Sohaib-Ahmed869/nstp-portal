import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import LoginPage from '/src/pages/LoginPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

// Admin Pages
import AdminHome from '/src/pages/admin/AdminHome.jsx';
import CompanyAddition from '/src/pages/admin/CompanyAddition.jsx';
import Companies from './pages/admin/Companies.jsx';
import Etags from './pages/admin/Etags.jsx';
import CardRequests from './pages/admin/CardRequests.jsx';
import Services from './pages/admin/Services.jsx';
import MeetingRooms from './pages/admin/MeetingRooms.jsx';
import { MeetingRoomBooking as AdminMeetingRoomBooking } from './pages/admin/MeetingRoomBooking.jsx';
import Performance from './pages/admin/Performance.jsx';

// Company Pages
import Dashboard from './pages/company/Dashboard.jsx';
import Employees from './pages/company/Employees.jsx';
import { Complaints as CompanyComplaints } from './pages/company/Complaints.jsx';
import { MeetingRoomBooking as CompanyMeetingRoomBooking } from './pages/company/MeetingRoomBooking.jsx';
import Evaluations from './pages/company/Evaluations.jsx';
import Parking from './pages/company/Parking.jsx';

// Receptionist Pages
import { Dashboard as ReceptionistDashboard } from './pages/receptionist/Dashboard.jsx';
import MeetingRoomBooking from './pages/receptionist/MeetingRoomBooking.jsx';

// Shared Pages (shared between 2 or more roles)
import Company from './pages/CompanyProfile.jsx';
import Complaints from './pages/Complaints.jsx';
import GatePasses from './pages/GatePasses.jsx';
import WorkPermit from './pages/WorkPermit.jsx';
import LostAndFound from './pages/LostAndFound.jsx';
import Occurences from './pages/Occurences.jsx';
import ApproveOffice from './pages/admin/ApproveOffice.jsx';

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
            <Route path="companies/:companyId" element={<Company role={"admin"} />} />
            <Route path="etags" element={<Etags />} />
            <Route path="work-permits" element={<WorkPermit role={'admin'} />} />
            <Route path='bookings' element={<AdminMeetingRoomBooking />} />
            <Route path="meeting-rooms" element={<MeetingRooms />} />
            <Route path="cards" element={<CardRequests />} />
            <Route path='complaints' element={<Complaints role={'admin'} />} />
            <Route path="services" element={<Services />} />
            <Route path="assign-office" element={<ApproveOffice />} />
            {/** Opportunities to be added here */}
            <Route path="performance" element={<Performance />} />
          </Route>

          <Route path="tenant">
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="bookings" element={<CompanyMeetingRoomBooking />} />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="parking" element={<Parking />} />
            <Route path="profile" element={<Company role={"tenant"} />} />
            <Route path="work-permits" element={<WorkPermit role={"tenant"} />} />
            <Route path="gate-passes" element={<GatePasses role={"tenant"} />} />
            <Route path="lost-and-found" element={<LostAndFound role={"tenant"} />} />
            <Route path="occurences" element={<Occurences role={"tenant"} />} />
            <Route path="complaints" element={<CompanyComplaints />} />
          </Route>

          <Route path="receptionist">
            <Route index element={<ReceptionistDashboard />} />
            <Route path="bookings" element={<MeetingRoomBooking />} />
            <Route path="complaints" element={<Complaints role={"receptionist"} />} />
            <Route path="gate-passes" element={<GatePasses role={"receptionist"} />} />
            <Route path="work-permits" element={<WorkPermit role={"receptionist"} />} />
            <Route path="lost-and-found" element={<LostAndFound role={"receptionist"} />} />
            <Route path="occurences" element={<Occurences role={"receptionist"} />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
