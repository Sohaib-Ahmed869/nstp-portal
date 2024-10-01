import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { MagnifyingGlassIcon, TrophyIcon, UserPlusIcon } from '@heroicons/react/24/outline';

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
  const [formData, setFormData] = useState({ username: '', email: '', password: '', name: '', cnic: '', image: '' });
  const [errors, setErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    // Simulate an API call with a timeout
    setTimeout(() => {
      const data = [
        { id: 1, username: 'johndoe', email: 'john@example.com', password: 'password123', name: 'John Doe', cnic: '12345-1234567-1', image: '', gatepasses: 30, complaints: 20 },
        { id: 2, username: 'janesmith', email: 'jane@example.com', password: 'password123', name: 'Jane Smith', cnic: '12345-1234567-2', image: '', gatepasses: 25, complaints: 30 },
        { id: 3, username: 'alicejohnson', email: 'alice@example.com', password: 'password123', name: 'Alice Johnson', cnic: '12345-1234567-3', image: '', gatepasses: 40, complaints: 10 },
        { id: 4, username: 'bobbrown', email: 'bob@example.com', password: 'password123', name: 'Bob Brown', cnic: '12345-1234567-4', image: '', gatepasses: 20, complaints: 25 },
        { id: 5, username: 'charliedavis', email: 'charlie@example.com', password: 'password123', name: 'Charlie Davis', cnic: '12345-1234567-5', image: '', gatepasses: 35, complaints: 15 },
        { id: 6, username: 'evewhite', email: 'eve@example.com', password: 'password123', name: 'Eve White', cnic: '12345-1234567-6', image: '', gatepasses: 22, complaints: 18 },
        { id: 7, username: 'frankblack', email: 'frank@example.com', password: 'password123', name: 'Frank Black', cnic: '12345-1234567-7', image: '', gatepasses: 28, complaints: 22 },
        { id: 8, username: 'gracegreen', email: 'grace@example.com', password: 'password123', name: 'Grace Green', cnic: '12345-1234567-8', image: '', gatepasses: 32, complaints: 19 },
        { id: 9, username: 'hankblue', email: 'hank@example.com', password: 'password123', name: 'Hank Blue', cnic: '12345-1234567-9', image: '', gatepasses: 27, complaints: 23 },
        { id: 10, username: 'ivyred', email: 'ivy@example.com', password: 'password123', name: 'Ivy Red', cnic: '12345-1234567-0', image: '', gatepasses: 24, complaints: 21 },
        { id: 11, username: 'jackyellow', email: 'jack@example.com', password: 'password123', name: 'Jack Yellow', cnic: '12345-1234567-11', image: '', gatepasses: 26, complaints: 20 },
      ];
  
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
    rec.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.cnic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    // Dummy API call simulation
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setModalLoading(false);
      document.getElementById('add-receptionist-form').close();
      setFormData({ name: '', email: '', phone: '' });

      //add receptionist to the list of receptionists
      setReceptionistPerformanceData((prevData) => [
        ...prevData,
        {
          id: prevData.length + 1,
          name: formData.name,
          gatepasses: 0,
          complaints: 0,
        },
      ]);
    }, 2000);


  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Sidebar>
      {loading && <NSTPLoader />}

      {/* Add New Receptionist Modal */}
      <dialog id="add-receptionist-form" className="modal">
        <div className="modal-box min-w-3xl max-w-3xl">
          <h3 className="font-bold text-lg mb-3">Add New Receptionist</h3>

          <form onSubmit={handleSubmit}>
            <FloatingLabelInput
              name="username"
              type="text"
              id="username-modal"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              required={true}
            />
            {errors.username && <span className="text-red-500 col-span-2">{errors.username}</span>}

            <FloatingLabelInput
              name="email"
              type="email"
              id="email-modal"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              required={true}
            />
            {errors.email && <span className="text-red-500 col-span-2">{errors.email}</span>}

            <FloatingLabelInput
              name="password"
              type="password"
              id="password-modal"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required={true}
            />
            {errors.password && <span className="text-red-500 col-span-2">{errors.password}</span>}

            <FloatingLabelInput
              name="name"
              type="text"
              id="name-modal"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              required={true}
            />
            {errors.name && <span className="text-red-500 col-span-2">{errors.name}</span>}

            <FloatingLabelInput
              name="cnic"
              type="text"
              id="cnic-modal"
              label="CNIC"
              value={formData.cnic}
              onChange={handleInputChange}
              required={true}
            />
            {errors.cnic && <span className="text-red-500 col-span-2">{errors.cnic}</span>}

            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => {
                document.getElementById('add-receptionist-form').close();
                setErrors({});
                setFormData({ username: '', email: '', password: '', name: '', cnic: '', image: '' });
              }}>Cancel</button>           <button
                className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                type="submit"
              >
                {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
              </button>
            </div>
          </form>

        </div>
      </dialog>


      <div className={`bg-base-100 mt-5 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
        {/* Header + request new parking btn */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Receptionists</h1>
          <button className="btn btn-primary text-base-100" onClick={() => document.getElementById('add-receptionist-form').showModal()}>
            <UserPlusIcon className="size-6" /> Add New Receptionist
          </button>
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
    <th onClick={() => handleSortChange('username')}>Username {sortField === 'username' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
    <th onClick={() => handleSortChange('email')}>Email {sortField === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
    <th onClick={() => handleSortChange('name')}>Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
    <th onClick={() => handleSortChange('cnic')}>CNIC {sortField === 'cnic' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
    <th onClick={() => handleSortChange('gatepasses')}>Gate Passes Issued {sortField === 'gatepasses' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
    <th onClick={() => handleSortChange('complaints')}>Complaints Resolved {sortField === 'complaints' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
  </tr>
</thead>
<tbody>
  {currentRows.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center text-gray-500">No data to show for now.</td>
    </tr>
  ) : (
    currentRows.map((rec) => (
      <tr key={rec.id}>
        <td>{rec.username}</td>
        <td>{rec.email}</td>
        <td>{rec.name}</td>
        <td>{rec.cnic}</td>
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
          <h1 className="text-2xl font-bold flex items-center gap-3"> <TrophyIcon className="size-7" /> { "Performance: "+ title}</h1>
          <div className="flex gap-3 items-center">
            Rank on basis of:
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select select-bordered">
              <option value="gatepasses">Gate Passes Issued</option>
              <option value="complaints">Complaints Reolved</option>
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