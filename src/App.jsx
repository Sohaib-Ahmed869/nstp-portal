import { useState } from 'react'
import LoginPage from '/src/pages/LoginPage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/">
        <Route index element={<LoginPage />} />
      
        {/* <Route path="*" element={<ErrorPage />} /> */}
      </Route>
    </Routes>
  </Router>
  )
}

export default App
