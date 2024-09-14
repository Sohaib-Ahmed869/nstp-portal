import React from 'react';
import { UserGroupIcon, ArrowTrendingUpIcon, TicketIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const EmployeeStats = ({ total, active, cardsNotIssued, cardsIssued }) => {
  return (
    <div className="card p-5 flex flex-col">
      <div className="flex lg:flex-row flex-col justify-between">
        <div>
          <span className="font-bold text-4xl flex flex-row items-center gap-2">
            <UserGroupIcon className="size-7" /> {total}
          </span>
          <p className="mb-3 mt-1 font-bold"> Total Employees </p>
        </div>

        <div className="flex flex-col lg:items-end">
          <span className="font-bold text-4xl flex flex-row items-center gap-2">
            {active}
            <ArrowTrendingUpIcon className="size-7" />
          </span>
          <p className="mb-3 mt-1 font-bold"> Active Employees </p>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col rounded-2xl overflow-clip">
        <div className="bg-red-100 dark:bg-red-800 dark:bg-opacity-60 p-5 flex flex-row justify-between lg:w-1/2 text-red-900 dark:text-red-400">
          <div className="flex flex-col items-start">
            <p className="font-bold text-2xl">{cardsNotIssued}</p>
            <p className="text-sm">Cards not issued</p>
          </div>
          <TicketIcon className="h-10 w-10 text-red-900 dark:text-red-400" />
        </div>
        <div className="bg-lime-100 dark:bg-lime-900 dark:bg-opacity-30 p-5 flex flex-row justify-between lg:w-1/2 text-green-900 dark:text-green-400">
          <CheckBadgeIcon className="h-10 w-10 text-green-900 dark:text-green-400" />
          <div className="flex flex-col items-end">
            <p className="font-bold text-2xl">{cardsIssued}</p>
            <p className="text-sm"> Cards Issued</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeStats;