import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Performance = () => {
  const [receptionistPerformanceData, setReceptionistPerformanceData] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('gatepasses'); // 'gatepasses' or 'complaints'
  const [loading, setLoading] = useState(true);
  const [topReceptionists, setTopReceptionists] = useState([]);
  const [title, setTitle] = useState('Top Receptionists');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
const rowsPerPage = 10;

  useEffect(() => {
    // Simulate an API call with a timeout
    setTimeout(() => {
      const data = [
        { id: 1, name: 'John Doe', gatepasses: 30, complaints: 20 },
        { id: 2, name: 'Jane Smith', gatepasses: 25, complaints: 30 },
        { id: 3, name: 'Alice Johnson', gatepasses: 40, complaints: 10 },
        { id: 4, name: 'Bob Brown', gatepasses: 20, complaints: 25 },
        { id: 5, name: 'Charlie Davis', gatepasses: 35, complaints: 15 },
        { id: 6, name: 'Eve White', gatepasses: 22, complaints: 18 },
        { id: 7, name: 'Frank Black', gatepasses: 28, complaints: 22 },
        { id: 8, name: 'Grace Green', gatepasses: 32, complaints: 19 },
        { id: 9, name: 'Hank Blue', gatepasses: 27, complaints: 23 },
        { id: 10, name: 'Ivy Red', gatepasses: 24, complaints: 21 },
        { id: 11, name: 'Jack Yellow', gatepasses: 26, complaints: 20 },
      ];
      console.log('API Data:', data);
      setReceptionistPerformanceData(data);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const updateTopReceptionists = () => {
      const isSmallScreen = window.innerWidth < 768;
      const limit = isSmallScreen ? 5 : 10;
      const sortedData = [...receptionistPerformanceData].sort((a, b) => {
        const field = filter === 'gatepasses' ? 'gatepasses' : 'complaints';
        return b[field] - a[field];
      });
      const topData = sortedData.slice(0, limit);
      setTopReceptionists(topData);
      setTitle(`Top ${topData.length} Receptionists`);
    };

    updateTopReceptionists();
    window.addEventListener('resize', updateTopReceptionists);
    return () => window.removeEventListener('resize', updateTopReceptionists);
  }, [receptionistPerformanceData, filter]);

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    const sortedData = [...receptionistPerformanceData].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setReceptionistPerformanceData(sortedData);
  };

  const chartData = {
    series: [
      {
        name: filter === 'gatepasses' ? 'Gate Passes' : 'Complaints',
        data: topReceptionists.map((rec) => (filter === 'gatepasses' ? rec.gatepasses : rec.complaints)),
      },
    ],
    options: {
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: topReceptionists.map((rec) => rec.name),
      },
      plotOptions: {
        bar: {
          distributed: true, // Ensure bars are colored individually
        },
      },
      colors: ['#87b37a', '#4c6663', '#2a1e5c'], // Set the colors for the bars
      legend: {
        show: false,
      },
    },
  };

  const filteredData = receptionistPerformanceData.filter((rec) =>
    rec.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div className={`bg-base-100 mt-5 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
        {/* Header + request new parking btn */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Receptionists Performance</h1>
        </div>
        <hr className="my-5 text-gray-200" />
        <div className="relative w-full lg:max-w-xs mb-4">
  <input
    type="text"
    placeholder="Search..."
    className="input input-bordered w-full pl-10"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
</div>
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200 cursor-pointer">
              <th onClick={() => handleSortChange('name')}>Receptionist Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSortChange('gatepasses')}>Gate Passes Issued {sortField === 'gatepasses' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSortChange('complaints')}>Complaints Resolved {sortField === 'complaints' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
            </tr>
          </thead>
          <tbody>
  {currentRows.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-center text-gray-500">No data to show for now.</td>
    </tr>
  ) : (
    currentRows.map((rec) => (
      <tr key={rec.id}>
        <td>{rec.name}</td>
        <td>{rec.gatepasses}</td>
        <td>{rec.complaints}</td>
      </tr>
    ))
  )}
</tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
  <button
    className="btn btn-outline"
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span>
    Page {currentPage} of {Math.ceil(receptionistPerformanceData.length / rowsPerPage)}
  </span>
  <button
    className="btn btn-outline"
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(receptionistPerformanceData.length / rowsPerPage)))}
    disabled={currentPage === Math.ceil(receptionistPerformanceData.length / rowsPerPage)}
  >
    Next
  </button>
</div>

        <div className="flex flex-row items-center justify-between mt-10">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-3 items-center">
            Rank on basis of:
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select select-bordered">
              <option value="gatepasses">Gate Passes</option>
              <option value="complaints">Complaints</option>
            </select>
          </div>
        </div>
        <hr className="my-5 text-gray-200" />
        <div className="mt-8">
          <ApexCharts options={chartData.options} series={chartData.series} type="bar" height={350} />
        </div>
      </div>
    </Sidebar>
  );
};

export default Performance;