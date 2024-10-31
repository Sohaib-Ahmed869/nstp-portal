import React, { useState } from 'react'
import MainDashboard from '../../components/dashboards/MainDashboard'
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { CurrencyDollarIcon, HomeIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import BillingDashboard from '../../components/dashboards/BillingDashboard';
import Company from '../CompanyProfile';

const Dashboard = () => {
    const [dashboardType, setDashboardType] = useState('main');
    const [loading, setLoading] = useState(false);

    const handleDashboardChange = (type) => {
        setDashboardType(type);
    };


    return (
        <Sidebar>
            {loading && <NSTPLoader />}

             {/** Change dash type (toggles ) */}
            <div className={`flex items-center mt-10 justify-between bg-base-100 ring-1 ring-gray-200 rounded-lg my-5 `}>
                <div
                    className={`btn btn-ghost w-1/3 flex items-center justify-center transition-all duration-300 ${dashboardType === 'main' ? 'bg-primary text-base-100' : ''}`}
                    onClick={() => handleDashboardChange('main')}
                >
                    <span className="flex gap-3 items-center">
                        <HomeIcon className={`h-6 w-6`} />
                        Main Dashboard
                    </span>
                </div>
                <div
                    className={`btn btn-ghost w-1/3 flex items-center justify-center transition-all duration-300 ${dashboardType === 'billing' ? 'bg-primary text-base-100' : ''}`}
                    onClick={() => handleDashboardChange('billing')}
                >
                    <span className="flex gap-3 items-center">
                        <CurrencyDollarIcon className={`h-6 w-6`} />
                        Billing Dashboard
                    </span>
                </div>
                <div
                    className={`btn btn-ghost w-1/3 flex items-center justify-center transition-all duration-300 ${dashboardType === 'company' ? 'bg-primary text-base-100' : ''}`}
                    onClick={() => handleDashboardChange('company')}
                >
                    <span className="flex gap-3 items-center">
                        <RocketLaunchIcon className={`h-6 w-6`} />
                        Company Profile
                    </span>
                </div>
            </div>

            <div
                className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}
            >
                {dashboardType === 'main' && <MainDashboard loading={loading} setLoading={setLoading} />}
                {dashboardType === 'billing' && <BillingDashboard loading={loading} setLoading={setLoading} />}
                {/* {dashboardType === 'company' && <Company loading={loading} setLoading={setLoading} />} */}
            </div>

        </Sidebar>


    )
}

export default Dashboard
