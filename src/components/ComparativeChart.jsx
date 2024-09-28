import React from 'react';
import { ArchiveBoxArrowDownIcon, ClockIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
/**
|--------------------------------------------------
| this assumes comparison data to be an object with two keys
| and their values should be the numerical data to be compared
| e.g  { "Resolved": 20, "Unresolved": 10 }
| e.g. { "Received": 20, "Pending": 10 }
|--------------------------------------------------
*/
const ComparativeChart = ({ title, comparisonData, link }) => {
  const keys = Object.keys(comparisonData);
  const values = Object.values(comparisonData);
  const total = values.reduce((acc, value) => acc + value, 0);
  const percentages = values.map(value => {
    const percentage = ((value / total) * 100).toFixed(2);
    return isNaN(percentage) ? 0 : percentage;
  });

  const formatKey = key => key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

  return (
    <>
      <div className='flex items-center mb-4 justify-between'>
        <p className="my-2 font-bold">{title}</p>
        {
          link && (
            <Link to={link} className="btn btn-primary text-white btn-md">
              <TableCellsIcon className="size-6"></TableCellsIcon>
              View All
            </Link>
          )
        }
      </div>
      <div className="flex justify-between">
        <div className="flex items-center mb-2">
          <ArchiveBoxArrowDownIcon className="w-5 h-5 mr-2" />
          <span>{formatKey(keys[0])}: {isNaN(values[0]) ? 0 : values[0]}</span>
        </div>
        <div className="flex items-center mb-2">
          <ClockIcon className="w-5 h-5 mr-2" />
          <span>{formatKey(keys[1])}: {isNaN(values[1]) ? 0 : values[1]}</span>
        </div>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${percentages[0]}%` }}
        ></div>
        <div
          className="absolute top-0 left-0 h-full bg-secondary"
          style={{ width: `${percentages[1]}%`, marginLeft: `${percentages[0]}%` }}
        ></div>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span className="text-primary font-semibold"> {percentages[0]}%</span>
        <span className="text-secondary font-semibold"> {percentages[1]}%</span>
      </div>

      <hr className="mt-2"/>

      <div className="mt-2 text-lg font-semibold">
        Total: {isNaN(total) ? 0 : total}
      </div>
    </>
  );
};

export default ComparativeChart;