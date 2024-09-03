import { useState } from 'react'
import LoginPage from '/src/pages/LoginPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'; 
import AdminHome from '/src/pages/AdminHome.jsx';
import CompanyAddition from '/src/pages/CompanyAddition.jsx';

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
      
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Route>
    </Routes>
  </Router>
  )
}

export default App
