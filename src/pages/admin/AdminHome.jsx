import React, { useContext, useState, useEffect } from 'react';
import { TowerContext } from '../../context/TowerContext';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar'
import ThemeControl from '../../components/ThemeControl'
import { QuestionMarkCircleIcon, BellAlertIcon, IdentificationIcon, ArchiveBoxArrowDownIcon, ArrowPathRoundedSquareIcon, UsersIcon, PlusCircleIcon, UserGroupIcon, RocketLaunchIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import ComparativeChart from '../../components/ComparativeChart'
import { Link } from 'react-router-dom'
import hatch8icon from '../../assets/hatch8.png'
import NewsFeed from '../../components/NewsFeed'
import NSTPLoader from '../../components/NSTPLoader'
import showToast from '../../util/toast';
import { AdminService } from '../../services';


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
  const { permissions } = useContext(AuthContext);
  const { tower, setTower } = useContext(TowerContext);
  const [towerOptions, setTowerOptions] = useState([]) //tower options for the currently logged in admin
  const [companyTableData, setCompanyTableData] = useState([
    { name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333 },
    { name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333 },
    { name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333 },
    { name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333 },
    { name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333 },
    { name: "HexlerTech", category: "Tech", employees: 23, totalRevenue: 2333 },

  ])
  const [companyStats, setCompanyStats] = useState({
    total: 233,
    hatch8: 123,
    startups: 132
  })
  const [eTags, setETags] = useState({ issued: 10, pending: 20 }); //total = pending + approved


  useEffect(() => { 
    async function fetchData() {
      try {
        setLoading(true);
        // Extract towers from permissions and set tower options
        const towers = permissions.map(permission => ({
          id: permission.tower._id,
          name: permission.tower.name
        }));
        console.log("TOWERS ", towers)
        setTowerOptions(towers);
        if (!tower || !towers.some(t => t.id === tower.id)) {
          setTower(towers[0]);
        }
  

        console.log("🚀 ~ fetchData ~ towers:", towers)
        console.log(permissions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [])

  const [dashboardError, setDashboardError] = useState(false);

  
  useEffect(() => {
    console.log("\n\nTOWER ", tower)
    // API call here to update the dashboard data when tower changes
    setLoading(true);
    async function fetchData() {
      try {
        console.log("TOWER ", tower.id)
        const response = await AdminService.getDashboard(tower.id);
        if (response.error) {
          console.log("🚀 ~ fetchData ~ response", response);
          console.log(response.error);
          showToast(false, "Unfortunately, an error occurred. Please try again later.");
          setDashboardError(true)
          return;
        }
        const dashboard = response.data.dashboard;
        console.log("🚀 ~ fetchData ~ dashboard", dashboard);
  
        // Update states based on the dashboard object
        setCardsStats({
          cardsIssued: dashboard.cards.issued,
          cardsReturned: dashboard.cards.returned,
          cardsRequested: dashboard.cards.requested,
        });
  
        setComplaintStats({
          resolved: dashboard.complaints.resolved,
          recieved: dashboard.complaints.total,
        });
  
        setCompanyTableData(
          dashboard.tenants.map((tenant) => ({
            name: tenant.registration.organizationName || "N/A",
            category: tenant.industrySector.category || "N/A",
            employees: tenant.employees || "N/A",
            companyEmail: tenant.registration.companyEmail || "N/A" , // Placeholder value as totalRevenue is not available in the dashboard object
          }))
        );
  
        setCompanyStats({
          total: Object.values(dashboard.companyCategories).reduce((acc, val) => acc + val, 0),
          hatch8: dashboard.companyCategories["Hatch 8"],
          startups: dashboard.companyCategories["Startup"],
        });
  
        setETags({
          issued: dashboard.etags.issued,
          pending: dashboard.etags.requested,
        });
  
      } catch (error) {
        console.log(error);
        showToast(false, "Unfortunately, an error occurred. Please try again later.");
        setDashboardError(true);
      } finally {
        setLoading(false);
      }
    }
    console.log(permissions);
    fetchData();
  }, [tower]);


  return (
    <Sidebar>
      {/* Loading spinner */}
      {loading && <NSTPLoader />}

      {/* Select the tower with a dropdown*/}
      <div className={`flex items-center justify-center bg-primary py-5 rounded-lg gap-2 my-5 ${loading && 'hidden'}`}>
        <BuildingOffice2Icon className="size-9 text-white" />
        <p className="font-semibold text-white">Tower: </p>
        <select
          className="select select-bordered max-w-xs"
          value={tower ? tower.id : ''}
          onChange={(e) => {
            const selectedTower = towerOptions.find(t => t.id === e.target.value);
            setTower(selectedTower);
          }}
        >
          {towerOptions.map((tower) => (
            <option key={tower.id} value={tower.id}>{tower.name}</option>
          ))}
        </select>
      </div>

      <div className={`bg-base-100 mt-5  ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
        {/* Header (Title, toggles etc) */}
        <div className="flex items-center md:flex-row flex-col md:justify-between">
          <h1 className='text-2xl font-semibold mb-5'>Main Dashboard</h1>
          <div className="flex gap-3">
            <ThemeControl />
            <button className="btn btn-primary max-sm:btn-sm hover:text-white btn-outline rounded-full">
              <BellAlertIcon className="size-6" />
            </button>
            <button className="btn btn-primary max-sm:btn-sm hover:text-white btn-outline rounded-full">
              <QuestionMarkCircleIcon className="size-6" />
            </button>
          </div>
        </div>
        <hr className="my-5 text-gray-200"></hr>

    { dashboardError ? <div> 
      <p>There was an error loading the dashboard data. We apologize for the inconvenience.</p>
       </div> : <>
         {/* First row */}
         <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-7">
      
           {/* Stats section */}
           <div className=" md:col-span-3">
             <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3">
               <div className="md:col-span-3 col-span-2">
                 <Link to="cards" className="btn btn-primary btn-md max-sm:btn-sm text-white">
                   <IdentificationIcon className="size-6 max-sm:size-5"></IdentificationIcon> View Cards
                 </Link>
      
               </div>
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
               <ComparativeChart title={"Complaints"} comparisonData={complaintStats} link={"complaints"} />
             </div>
      
      
           </div>
      
           {/* Table of companies info */}
           <div className=" md:col-span-4 ">
             <div className="card p-5 max-h-60 overflow-y-scroll min-h-full ">
               <div className="w-full flex flex-col">
                 <div className="flex max-sm:flex-col items-center max-sm:items-start justify-between mb-2">
                   <p className="mb-3 font-bold"> Companies</p>
                   <div className="flex max-[450px]:flex-col max-sm:items-end max-sm:w-full gap-1">
                     <Link to="/admin/companies" className='max-sm:w-1/2 max-[450px]:w-full'>
                       <button className="btn btn-primary btn-outline max-sm:btn-block btn-md max-sm:btn-sm text-white">
                         <UsersIcon className="size-6 max-[450px]:hidden"></UsersIcon> View All
                       </button>
                     </Link>
                     <Link to="/admin/add-company" className='max-sm:w-1/2 max-[450px]:w-full'>
                       <button className="btn btn-primary btn-md max-sm:btn-block max-sm:btn-sm text-white">
                         <PlusCircleIcon className="size-6 max-[450px]:hidden"></PlusCircleIcon> Add Company
                       </button>
                     </Link>
                   </div>
                 </div>
                 <div className="h-full ">
                   <table className="table w-full h-full mt-2">
                     <thead className="bg-base-200">
                       <tr>
                         <th>Name</th>
                         <th>Category</th>
                         <th>Employees</th>
                         <th>Company Mail</th>
                       </tr>
                     </thead>
                     <tbody>
                       {companyTableData.map((company, index) => (
                         <tr key={index}>
                           <td>{company.name}</td>
                           <td>{company.category}</td>
                           <td>{company.employees}</td>
                           <td>{company.companyEmail}</td>
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
     </>}
      </div>
    </Sidebar>
  )
}

export default AdminHome
