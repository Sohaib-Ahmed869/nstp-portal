import { FaceFrownIcon } from '@heroicons/react/24/outline';
import React from 'react'
import { useNavigate } from 'react-router-dom'
/** 404 error page  */
const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-primary text-white">
      <h1 className="text-5xl font-bold flex flex-row mb-2">4 <FaceFrownIcon className="size-12"></FaceFrownIcon> 3</h1>
      <p className="text-lg">That means you aren't allowed to access this page. <br /> Contact tech team if you think this is a mistake.</p>
      <button className="btn btn-secondary dark:bg-base-100 dark:text-white mt-5" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  )
}

export default Unauthorized