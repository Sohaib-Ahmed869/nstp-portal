import { FaceFrownIcon } from '@heroicons/react/24/outline';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import nstpLogo from '../assets/nstplogowhite.png'
/** 404 error page  */
const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-primary text-white">
      {/* <img src={nstpLogo} alt="NSTP Logo" className="w-20 h-20 mb-4" /> */}
      <h1 className="text-5xl font-bold flex flex-row mb-2">4 <FaceFrownIcon className="size-12"></FaceFrownIcon> 4</h1>
      <p className="text-lg">Page Not Found</p>
      <button className="btn btn-secondary dark:bg-base-100 dark:text-white mt-5" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  )
}

export default ErrorPage