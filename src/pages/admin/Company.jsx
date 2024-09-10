import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';
import { UserGroupIcon, BriefcaseIcon, ArrowTrendingUpIcon, TicketIcon, AcademicCapIcon, CheckBadgeIcon, TruckIcon, ChartBarIcon, ClockIcon, ShieldExclamationIcon, CalendarIcon, DocumentCheckIcon, BanknotesIcon, BuildingOfficeIcon, CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import sampleCompanyLogo from '../../assets/samplecompanylogo.png'
import ReactApexChart from 'react-apexcharts';
import { getPieChartOptions } from '../util/charts';

const Company = () => {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState({
    name: "Tech Innovators",
    type: "Startup",
    joiningDate: "2022-01-15",
    contractStartDate: "2022-01-15",
    contractEndDate: "2022-04-15",
    description: "A leading tech company specializing in innovative solutions, we ensure that our employees are always at the forefront of technology and innovation, and we are always looking for new talent to join our team. We specialize in your needs, leading tech company specializing in innovative solutions, we ensure that our employees are always at the forefront of technology and innovation.",
    totalEmployees: 102,
    activeEmployees: 90,
    cardsNotIssued: 12,
    cardsIssued: 90,
    interns: {
      nustian: 30,
      nonNustian: 20,
      total: 50
    },
    gatePasses: 50,
    workPermits: 40,
    eTags: 60,
    vehiclesRegistered: 25,
    gateEntries: 200,
    foreignGateEntries: 15,
    jobsInternships: 10,
    meetingRoomUsage: 120,
    violations: 5,
    contractDuration: 75
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch company data using the companyId
    //simulate loading

    console.log(companyData)

    setTimeout(() => {
      setLoading(false);
    }, 2000);

  }, [companyId]);


  return (
    <Sidebar>

      <div className="bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10">

        {/* Header with company info, description, logo and join date */}
        <div className="flex max-sm:flex-col justify-start items-start gap-5">
          <img src={sampleCompanyLogo} alt="Company Logo" className="size-48 rounded-lg ring-1 ring-gray-200" />

          <div className="">
            <h1 className="text-4xl font-semibold text-primary">{companyData.name}</h1>
            <p className="text-base text-secondary mt-2">{companyData.description}</p>
            <div className='badge badge-secondary mt-2 mb-1'>{companyData.type}</div>
            <div className="flex flex-row gap-7 mt-3">
              <div className="flex">
              <CalendarIcon className="h-6 w-6 text-secondary" />
              <span className="text-secondary ml-2 font-semibold">{"Joined on " + companyData.joiningDate}</span>
              </div>
              <div className="">Contract start: { companyData.contractStartDate}</div>
              <div className="">Contract end: { companyData.contractEndDate}</div>
            </div>
          </div>
        </div>

        <hr className="my-5 text-gray-200"></hr>

        <div className="grid md:grid-cols-2 gap-5 mt-5 ">
          {/* Employee Stats */}
          <div className="bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5 flex flex-col ">
            <div className="flex lg:flex-row flex-col justify-between">
              <div>
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  <UserGroupIcon className="size-7" /> {companyData.totalEmployees}
                </span>
                <p className="mb-3 mt-1 font-bold"> Total Employees </p>
              </div>

              <div className="flex flex-col lg:items-end">
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  {companyData.activeEmployees}
                  <ArrowTrendingUpIcon className="size-7" />
                </span>
                <p className="mb-3 mt-1 font-bold"> Active Employees </p>
              </div>
            </div>

            <div className="flex lg:flex-row flex-col rounded-2xl overflow-clip" >
              <div className="bg-red-100 p-5 flex flex-row justify-between lg:w-1/2 text-red-900">
                <div className="flex flex-col items-start">
                  <p className="font-bold text-2xl">{companyData.cardsNotIssued}</p>
                  <p className="text-sm">Cards not issued</p>
                </div>
                <TicketIcon className="h-10 w-10 text-red-900" />
              </div>
              <div className="bg-lime-100 p-5 flex flex-row justify-between lg:w-1/2 text-green-900">
                <CheckBadgeIcon className="h-10 w-10 text-green-900" />
                <div className="flex flex-col items-end">
                  <p className="font-bold text-2xl">{companyData.cardsIssued}</p>
                  <p className="text-sm"> Cards Issued</p>
                </div>

              </div>
            </div>

          </div>

          {/* Company Stats grid */}
          <div className="bg-base-100 p-5 shadow-md border-t border-t-gray-200  grid divide-y divide-x divide-gray-200 grid-cols-1 md:grid-cols-1 lg:grid-cols-3">

            <div className="stat">
              <div className="stat-figure text-secondary">
                <DocumentCheckIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">E-tags</div>
              <div className="stat-value">{companyData.eTags}</div>
              <div className="stat-desc">Issued</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <TruckIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Vehicles</div>
              <div className="stat-value">{companyData.vehiclesRegistered}</div>
              <div className="stat-desc">Registered</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <BuildingOfficeIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Gate Passes</div>
              <div className="stat-value">{companyData.gatePasses}</div>
              <div className="stat-desc">Issued</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <BanknotesIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Gate Entries</div>
              <div className="stat-value">{companyData.gateEntries}</div>
            </div>


            <div className="stat">
              <div className="stat-figure text-secondary">
                <BriefcaseIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Work permits</div>
              <div className="stat-value">{companyData.workPermits}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <ShieldExclamationIcon className="inline-block h-8 w-8" />
              </div>
              <div className="stat-title">Violations</div>
              <div className="stat-value">{companyData.violations}</div>
            </div>

          </div>
        </div>

        {/* second row (4 col stats) */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mt-5 ">
          
          {/* internee stats and piechart */}
          <div className="mt-2 lg:col-span-1 md:col-span-2 sm:col-span-1 bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5 flex flex-row justify-between items-start">
            <div>
              <span className="font-bold text-4xl flex flex-row items-center gap-2">
                <UserGroupIcon className="size-7" /> {companyData.interns.total}
              </span>
              <p className="mb-3 mt-1 font-bold"> Internees </p>

              <div className="mb-2 p-2 rounded-md bg-accent text-white">{companyData.interns.nustian + " NUSTians"}</div>
              <div className="p-2 rounded-md bg-primary text-white">{companyData.interns.nonNustian + " Non NUSTians"}</div>
            </div>
            <div id="pie-chart">
              <ReactApexChart options={getPieChartOptions(companyData.interns)} series={getPieChartOptions(companyData.interns).series} type="pie" height={220} />
            </div>

          </div>

          {/* Contract duration stats and radial progress */}
          <div className="mt-2 bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5 flex flex-row justify-between items-center">
            <div>
              <span className="font-bold text-4xl flex flex-row items-center gap-2">
                <CalendarDateRangeIcon className="size-7" /> {companyData.contractDuration + "%"}
              </span>
              <p className="mb-3 mt-1 font-bold"> Contract complete </p>

              <span className="mt-2 block">Contract start: { companyData.contractStartDate}</span>
              <span className="">Contract end: { companyData.contractEndDate}</span>

            </div>
            <div>
            <div className="radial-progress bg-neutral text-primary" style={{ "--value": `${companyData.contractDuration}`, "--size": "7rem", "--thickness": "13px"  }} role="progressbar">
  {companyData.contractDuration}%
</div>
            </div>
          </div>


          {/* No of jobs/internships stat */}
          <div className=" mt-2 bg-base-100 rounded-md shadow-md border-t border-t-gray-200 p-5 ">
            <div className="stat border-b">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-8 w-8 stroke-current">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Jobs & Internships</div>
              <div className="stat-value text-secondary">{companyData.jobsInternships}</div>
              <div className="stat-desc">↗︎ Creating opportunities</div>
            </div>


            <div className="stat">
    <div className="stat-figure text-secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="inline-block h-8 w-8 stroke-current">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
      </svg>
    </div>
    <div className="stat-title">Meeting rooms</div>
    <div className="stat-value">{companyData.meetingRoomUsage}</div>
    <div className="stat-desc">↗︎ Hours utilized </div>
  </div>
          </div>

         

        </div>
      </div>




    </Sidebar>
  );
};

export default Company;