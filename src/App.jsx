import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

// Admin Pages
import AdminHome from './pages/admin/AdminHome.jsx';
import Clearance from './pages/admin/Clearance.jsx';
import CompanyAddition from './pages/admin/CompanyAddition.jsx';
import Companies from './pages/admin/Companies.jsx';
import CardRequests from './pages/CardRequests.jsx';
import Services from './pages/admin/Services.jsx';
import MeetingRooms from './pages/admin/MeetingRooms.jsx';
import { MeetingRoomBooking as AdminMeetingRoomBooking } from './pages/admin/MeetingRoomBooking.jsx';
import Performance from './pages/admin/Performance.jsx';

// Company Pages
import Dashboard from './pages/company/Dashboard.jsx';
import Employees from './pages/company/Employees.jsx';
import { Complaints as CompanyComplaints } from './pages/company/Complaints.jsx';
import { MeetingRoomBooking as CompanyMeetingRoomBooking } from './pages/company/MeetingRoomBooking.jsx';
import Parking from './pages/company/Parking.jsx';
import EvaluationForm from './pages/company/EvaluationForm.jsx';

// Receptionist Pages
import { Dashboard as ReceptionistDashboard } from './pages/receptionist/Dashboard.jsx';
import MeetingRoomBooking from './pages/receptionist/MeetingRoomBooking.jsx';

// Shared Pages (shared between 2 or more roles)
import Company from './pages/CompanyProfile.jsx';
import Complaints from './pages/Complaints.jsx';
import Evaluations from './pages/Evaluations.jsx';
import GatePasses from './pages/GatePasses.jsx';
import WorkPermit from './pages/WorkPermit.jsx';
import LostAndFound from './pages/LostAndFound.jsx';
import Occurences from './pages/Occurences.jsx';
import ApproveOffice from './pages/admin/ApproveOffice.jsx';
import Logout from './pages/Logout.jsx';
import Etags from './pages/Etags.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

//Context
import {AuthContext} from './context/AuthContext';
import Blogs from './pages/admin/Blogs.jsx';
import Blog from './pages/admin/Blog.jsx';
import CreateBlog from './pages/admin/CreateBlog.jsx';

//Protected Route
const ProtectedRoute = ({ allowedRoles, redirectPath = '/unauthorized' }) => {
  const { role } = useContext(AuthContext);
  
  if (!role || role == "" || !allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

//Render
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin">
            <Route index element={<AdminHome />} />
            <Route path="add-company" element={<CompanyAddition />} />
            <Route path="companies" element={<Companies />} />
            <Route path="companies/:companyId" element={<Company role="admin" />} />
            <Route path="etags" element={<Etags />} />
            <Route path="work-permits" element={<WorkPermit role="admin" />} />
            <Route path="clearance" element={<Clearance />} />
            <Route path="bookings" element={<AdminMeetingRoomBooking />} />
            <Route path="meeting-rooms" element={<MeetingRooms />} />
            <Route path="cards" element={<CardRequests />} />
            <Route path="complaints" element={<Complaints role="admin" />} />
            <Route path="services" element={<Services />} />
            <Route path="assign-office" element={<ApproveOffice />} />
            <Route path="receptionists" element={<Performance />} />
            <Route path="evaluations" element={<Evaluations role="admin" />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/create" element={<CreateBlog />} />
            <Route path="blogs/:id" element={<Blog />} />
          </Route>
        </Route>

        {/* Tenant Routes */}
        <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
          <Route path="tenant">
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="bookings" element={<CompanyMeetingRoomBooking />} />
            <Route path="evaluations" element={<Evaluations role="tenant" />} />
            <Route path="evaluations/:id" element={<EvaluationForm />} />
            <Route path="parking" element={<Parking />} />
            <Route path="profile" element={<Company role="tenant" />} />
            <Route path="etags" element={<Etags />} />
            <Route path="work-permits" element={<WorkPermit role="tenant" />} />
            <Route path="gate-passes" element={<GatePasses role="tenant" />} />
            <Route path="lost-and-found" element={<LostAndFound role="tenant" />} />
            <Route path="occurences" element={<Occurences role="tenant" />} />
            <Route path="complaints" element={<CompanyComplaints />} />
          </Route>
        </Route>

        {/* Receptionist Routes */}
        <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
          <Route path="receptionist">
            <Route index element={<ReceptionistDashboard />} />
            <Route path="bookings" element={<MeetingRoomBooking />} />
            <Route path="complaints" element={<Complaints role="receptionist" />} />
            <Route path="gate-passes" element={<GatePasses role="receptionist" />} />
            <Route path="work-permits" element={<WorkPermit role="receptionist" />} />
            <Route path="lost-and-found" element={<LostAndFound role="receptionist" />} />
            <Route path="occurences" element={<Occurences role="receptionist" />} />
          </Route>
        </Route>

        {/* Error Route (404 page) */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App
