import React , { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ThemeControl from '../../components/ThemeControl'
import { QuestionMarkCircleIcon, BellAlertIcon, IdentificationIcon, ArchiveBoxArrowDownIcon, ArrowPathRoundedSquareIcon, UsersIcon, PlusCircleIcon, UserGroupIcon, RocketLaunchIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import ComparativeChart from '../../components/ComparativeChart'
import { Link } from 'react-router-dom'
import hatch8icon from '../../assets/hatch8.png'
import NewsFeed from '../../components/NewsFeed'
import NSTPLoader from '../../components/NSTPLoader'
const AdminHome = () => {
  const [loading, setLoading] = useState(true)
  const [cardsStats, setCardsStats] = useState({
    cardsIssued: 1233,
    cardsReturned: 233,
    cardsRequested: 21332
  })
  const [complaintStats, setComplaintStats] = useState({
    resolved: 233,
    recieved: 542
  })
  const [tower, setTower] = useState("NSTP 1")
  const [towerOptions, setTowerOptions] = useState(["NSTP 1", "NSTP 2", "NSTP 3", "NSTP 4"]) //tower options for the currently logged in admin
  const [companyTableData, setCompanyTableData] = useState([
    {name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333},
    {name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333},
    {name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333},
    {name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333},
    {name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333},
   
  ])
  const [companyStats, setCompanyStats] = useState({
    total: 233,
    hatch8: 123,
    startups: 132
  })
  const [eTags, setETags] = useState({ issued: 10, pending: 20 }); //total = pending + approved


  // Simulate loading
  useEffect(() => {
    setLoading(true)
    //Api call here to fetch data and populate the above states,based on tower state
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }
  , [tower])


  return (
    <Sidebar>
      {/* Loading spinner */}
      {loading && <NSTPLoader />}
        {/* Select the tower with a dropdown*/}
        <div className="flex items-center justify-center bg-primary py-5 rounded-lg  gap-2 my-5">
          <BuildingOffice2Icon className="size-9 text-white" />
          <p className="font-semibold text-white">Tower: </p>
          <select className="select select-bordered max-w-xs" value={tower} onChange={(e) => setTower(e.target.value)}>
            {towerOptions.map((tower, index) => (
              <option key={index} value={tower}>{tower}</option>
            ))}
          </select>
        </div>

      <div className={`bg-base-100 mt-5  ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
        {/* Header (Title, toggles etc) */}
        <div className="flex items-center justify-between">
          <h1 className='text-2xl font-semibold mb-5'>Main Dashboard</h1>
          <div className="flex gap-3">
            <ThemeControl />
            <button className="btn btn-primary hover:text-white btn-outline rounded-full">
              <BellAlertIcon className="size-6" />
            </button>
            <button className="btn btn-primary hover:text-white btn-outline rounded-full">
              <QuestionMarkCircleIcon className="size-6" />
            </button>
          </div>
        </div>
        <hr className="my-5 text-gray-200"></hr>

        {/* First row */}
        <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-7">

          {/* Stats section */}
          <div className=" md:col-span-3">
            <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3">
              {/* Card related stats */}
            <div className=" h-full card p-5 flex flex-col justify-center  mb-4 md:mb-0">
              <IdentificationIcon className="size-7 mb-1  text-primary" />
              <p className="font-semibold text-4xl mb-0">{cardsStats.cardsIssued}</p>
              <p className="font-semibold font-lg mb-0">Cards Issued</p>
            </div>
            <div className="h-full card p-5 flex flex-col justify-center mb-4 md:mb-0">
              <ArrowPathRoundedSquareIcon className="size-7 mb-1 text-primary" />
              <p className="font-semibold text-4xl mb-0">{cardsStats.cardsReturned}</p>
              <p className="font-semibold font-lg mb-0">Cards Returned</p>
            </div>
            <div className=" col-span-2 md:col-span-1 h-full  card p-5  flex flex-col justify-center mb-4 md:mb-0">
              <ArchiveBoxArrowDownIcon className="size-7  mb-1 text-primary" />
              <p className="font-semibold text-4xl mb-0">{cardsStats.cardsRequested}</p>
              <p className="font-semibold font-lg mb-0">Cards Requested</p>
            </div></div>
            
            <div className="card p-5 col-span-3">
              <ComparativeChart title={"Complaints"} comparisonData={complaintStats} />
            </div>
            

          </div>

          {/* Table of companies info */}
          <div className=" md:col-span-4 ">
            <div className="card p-5 min-h-full ">
              <div className="w-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="mb-3 font-bold"> Companies</p>
                  <div className="flex gap-1">
                  <Link to="/admin/companies">
                  <button className="btn btn-primary btn-outline btn-md text-white">
                    <UsersIcon className="size-6"></UsersIcon> View All
                  </button>
                  </Link>
                  <Link to="/admin/add-company">
                  <button className="btn btn-primary btn-md text-white">
                    <PlusCircleIcon className="size-6"></PlusCircleIcon> Add Company
                  </button>
                  </Link>
                  </div>
                </div>
                <div className="h-full max-h-60 overflow-scroll">
                  <table className="table w-full mt-2">
                    <thead className="bg-base-200">
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Employees</th>
                        <th>Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyTableData.map((company, index) => (
                        <tr key={index}>
                          <td>{company.name}</td>
                          <td>{company.category}</td>
                          <td>{company.employees}</td>
                          <td>{company.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-7 my-6">
          <div className="md: col-span-4 lg:order-1 md:order-2 max-md:order-2">
            <NewsFeed />
          </div>
          <div className="md: col-span-3 lg:order-2 md:order-1 max-md:order-1">
            <div className="md:col-span-3 mb-3 card p-5 flex flex-col">
              <div className="flex flex-row justify-between">
                <div>
                  <span className="font-bold text-4xl flex flex-row items-center gap-2">
                    <UserGroupIcon className="size-7" /> {companyStats.total}
                  </span>
                  <p className="mb-3 mt-1 font-bold"> Total Companies </p>
                </div>
              </div>

              <div className="flex rounded-2xl overflow-clip" >
                <div className="bg-orange-300 p-5 flex flex-row justify-between w-1/2 text-red-900 dark:text-orange-300 dark:bg-orange-500 dark:bg-opacity-25">
                  <div className="flex flex-col items-start">
                    <p className="font-bold text-2xl">{companyStats.hatch8}</p>
                    <p className="text-sm">Hatch 8 Companies</p>
                  </div>
                  <img src={hatch8icon} alt="hatch8" className="w-12" />
                </div>
                <div className="bg-lime-100 p-5 flex flex-row justify-between w-1/2 text-green-900 dark:text-lime-100 dark:bg-lime-800 dark:bg-opacity-25 ">
                  <RocketLaunchIcon className="h-10 w-10 text-green-900 dark:text-lime-200" />
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-2xl">{companyStats.startups}</p>
                    <p className="text-sm">Startups</p>
                  </div>

                </div>
              </div>


            </div>

            <div className="md:col-span-3 card p-5">
              <ComparativeChart title={"E-Tags"} comparisonData={eTags} link={"etags"} />
            </div>

          </div>

        </div>
      </div>
    </Sidebar>
  )
}

export default AdminHome
