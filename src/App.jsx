import { useState } from 'react'
import LoginPage from '/src/pages/LoginPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'; 
import AdminHome from '/src/pages/admin/AdminHome.jsx';
import CompanyAddition from '/src/pages/admin/CompanyAddition.jsx';
import Dashboard from './pages/company/Dashboard.jsx';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/">
        <Route index element={<LoginPage />} />
        <Route path="admin">
          <Route index element={<AdminHome />} />
          <Route path="add-company" element={<CompanyAddition />} />
        </Route>

        <Route path="company">
          <Route index element={<Dashboard />} />
        </Route>
      
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Route>
    </Routes>
  </Router>
  )
}

export default App
